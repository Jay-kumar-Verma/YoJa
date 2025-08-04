"""
Django Integration Views - Heavy data operations and analytics
Handles user management, data persistence, analytics, and reporting
Security hardened with input validation, rate limiting, and proper error handling
"""

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.cache import cache
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_headers
from django.utils.decorators import method_decorator
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
import json
import logging
import requests
import sys
from datetime import timedelta
from typing import Dict, Any, Optional, List
from django.http import HttpRequest
import os
import re
import bleach
from functools import wraps
import hashlib
import hmac
import time
from urllib.parse import urlparse
import ipaddress

# Configure logging with security context
logger = logging.getLogger(__name__)

# Service URLs with validation
FASTAPI_SERVICE_URL = os.getenv('FASTAPI_SERVICE_URL', 'http://fastapi-service:8000')
ML_SERVICE_URL = os.getenv('ML_SERVICE_URL', 'http://ml-service:8889')

# Security constants
MAX_REQUEST_SIZE = 1024 * 1024  # 1MB
MAX_USERNAME_LENGTH = 150
MAX_PASSWORD_LENGTH = 128
MAX_SESSION_DURATION = 3600  # 1 hour
ALLOWED_DOMAINS = ['localhost', '127.0.0.1', 'yoja.app']
RATE_LIMIT_REQUESTS = 100
RATE_LIMIT_WINDOW = 3600  # 1 hour

# Security decorators
def rate_limit(max_requests: int = RATE_LIMIT_REQUESTS, window: int = RATE_LIMIT_WINDOW):
    """Rate limiting decorator"""
    def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            client_ip = get_client_ip(request)
            cache_key = f"rate_limit:{client_ip}:{func.__name__}"
            
            current_requests = cache.get(cache_key, 0)
            if current_requests >= max_requests:
                return create_response(
                    success=False,
                    message="Rate limit exceeded",
                    status=429
                )
            
            cache.set(cache_key, current_requests + 1, window)
            return func(request, *args, **kwargs)
        return wrapper
    return decorator

def validate_request_size(max_size: int = MAX_REQUEST_SIZE):
    """Request size validation decorator"""
    def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            if hasattr(request, 'body') and len(request.body) > max_size:
                return create_response(
                    success=False,
                    message="Request too large",
                    status=413
                )
            return func(request, *args, **kwargs)
        return wrapper
    return decorator

def get_client_ip(request: HttpRequest) -> str:
    """Get client IP address securely"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR', 'unknown')
    
    # Validate IP format
    try:
        ipaddress.ip_address(ip)
        return ip
    except ValueError:
        return 'unknown'

def sanitize_input(text: str, max_length: int = 1000) -> str:
    """Sanitize user input"""
    if not text:
        return ""
    
    # Remove HTML tags and limit length
    cleaned = bleach.clean(str(text), tags=[], strip=True)
    return cleaned[:max_length]

def validate_user_id(user_id: str) -> bool:
    """Validate user ID format"""
    if not user_id:
        return False
    
    # Check if it's a valid integer or UUID format
    try:
        int(user_id)
        return True
    except ValueError:
        # Check UUID format
        uuid_pattern = re.compile(r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', re.IGNORECASE)
        return bool(uuid_pattern.match(user_id))

def validate_url(url: str) -> bool:
    """Validate URL for SSRF protection"""
    try:
        parsed = urlparse(url)
        if not parsed.scheme in ['http', 'https']:
            return False
        
        # Check against allowed domains
        hostname = parsed.hostname
        if hostname and hostname not in ALLOWED_DOMAINS:
            # Allow internal service names
            if not (hostname.endswith('-service') or hostname in ['fastapi-service', 'ml-service']):
                return False
        
        return True
    except:
        return False

# Utility functions with security enhancements
def create_response(success: bool, data: Any = None, message: str = "", status: int = 200) -> JsonResponse:
    """Create standardized API response with security headers"""
    response_data: Dict[str, Any] = {
        "success": success,
        "message": sanitize_input(message, 500),
        "timestamp": timezone.now().isoformat()
    }
    
    if data is not None:
        response_data["data"] = data
    
    response = JsonResponse(response_data, status=status)
    
    # Add security headers
    response['X-Content-Type-Options'] = 'nosniff'
    response['X-Frame-Options'] = 'DENY'
    response['X-XSS-Protection'] = '1; mode=block'
    response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    
    return response

def call_external_service(url: str, method: str = "GET", data: Optional[Dict[str, Any]] = None, timeout: int = 10) -> Dict[str, Any]:
    """Make HTTP calls to external services with security validation"""
    # Validate URL to prevent SSRF
    if not validate_url(url):
        raise ValueError(f"Invalid or unauthorized URL: {url}")
    
    # Limit timeout to prevent resource exhaustion
    timeout = min(timeout, 30)
    
    try:
        headers = {
            'User-Agent': 'YoJa-Django-Service/1.0',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        
        if method.upper() == "GET":
            response = requests.get(url, timeout=timeout, headers=headers)
        elif method.upper() == "POST":
            if data:
                # Validate data size
                import sys
                if sys.getsizeof(data) > MAX_REQUEST_SIZE:
                    raise ValueError("Request data too large")
            response = requests.post(url, json=data, timeout=timeout, headers=headers)
        elif method.upper() == "PUT":
            if data:
                if sys.getsizeof(data) > MAX_REQUEST_SIZE:
                    raise ValueError("Request data too large")
            response = requests.put(url, json=data, timeout=timeout, headers=headers)
        elif method.upper() == "DELETE":
            response = requests.delete(url, timeout=timeout, headers=headers)
        else:
            raise ValueError(f"Unsupported HTTP method: {method}")
        
        response.raise_for_status()
        
        # Validate response size
        if len(response.content) > MAX_REQUEST_SIZE * 5:  # Allow larger responses
            raise ValueError("Response too large")
        
        return response.json()
        
    except requests.exceptions.Timeout:
        logger.warning(f"External service timeout: {url}")
        raise
    except requests.exceptions.RequestException as e:
        logger.error(f"External service call failed: {url} - {e}")
        raise
    except ValueError as e:
        logger.error(f"External service validation failed: {e}")
        raise

# Health check view
@require_http_methods(["GET"])
def health_check(request: HttpRequest) -> JsonResponse:
    """Health check endpoint"""
    try:
        # Check database connection
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        
        # Check external services
        services_health = {}
        
        try:
            _ = call_external_service(f"{FASTAPI_SERVICE_URL}/health", timeout=5)
            services_health["fastapi"] = "healthy"
        except:
            services_health["fastapi"] = "unhealthy"
        
        try:
            _ = call_external_service(f"{ML_SERVICE_URL}/health", timeout=5)
            services_health["ml"] = "healthy"
        except:
            services_health["ml"] = "unhealthy"
        
        return create_response(
            success=True,
            data={
                "service": "django-service",
                "database": "healthy",
                "external_services": services_health
            },
            message="Service is healthy"
        )
        
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return create_response(
            success=False,
            message="Service health check failed",
            status=503
        )

# Authentication views with enhanced security
@csrf_exempt
@require_http_methods(["POST"])
@rate_limit(max_requests=5, window=300)  # 5 attempts per 5 minutes
@validate_request_size()
def login_view(request: HttpRequest) -> JsonResponse:
    """User authentication with security enhancements"""
    try:
        # Check for brute force attempts
        client_ip = get_client_ip(request)
        failed_attempts_key = f"login_failures:{client_ip}"
        failed_attempts = cache.get(failed_attempts_key, 0)
        
        if failed_attempts >= 5:
            logger.warning(f"Blocked login attempt from {client_ip} due to too many failures")
            return create_response(
                success=False,
                message="Too many failed attempts. Please try again later.",
                status=429
            )
        
        data = json.loads(request.body)
        username = sanitize_input(data.get('username', ''), MAX_USERNAME_LENGTH)
        password = data.get('password', '')
        
        # Input validation
        if not username or not password:
            return create_response(
                success=False,
                message="Username and password are required",
                status=400
            )
        
        if len(username) < 3 or len(username) > MAX_USERNAME_LENGTH:
            return create_response(
                success=False,
                message="Invalid username length",
                status=400
            )
        
        if len(password) > MAX_PASSWORD_LENGTH:
            return create_response(
                success=False,
                message="Password too long",
                status=400
            )
        
        # Validate username format (alphanumeric and specific characters only)
        if not re.match(r'^[a-zA-Z0-9_.-]+$', username):
            cache.set(failed_attempts_key, failed_attempts + 1, 3600)
            return create_response(
                success=False,
                message="Invalid username format",
                status=400
            )
        
        user = authenticate(request, username=username, password=password)
        
        if user and user.is_active:
            # Clear failed attempts on successful login
            cache.delete(failed_attempts_key)
            
            login(request, user)
            
            # Get or create user profile with safe attribute access
            user_profile: Dict[str, Any] = {
                "id": getattr(user, 'id', None),
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "last_login": user.last_login.isoformat() if user.last_login else None,
                "date_joined": user.date_joined.isoformat(),
                "is_active": user.is_active
            }
            
            # Cache user session with shorter duration for security
            user_id = getattr(user, 'id', None)
            if user_id is not None:
                cache.set(f"user_session_{user_id}", user_profile, MAX_SESSION_DURATION)
            
            # Log successful login
            logger.info(f"Successful login for user {username} from {client_ip}")
            
            return create_response(
                success=True,
                data={"user": user_profile},
                message="Login successful"
            )
        else:
            # Increment failed attempts
            cache.set(failed_attempts_key, failed_attempts + 1, 3600)
            
            # Log failed login attempt
            logger.warning(f"Failed login attempt for user {username} from {client_ip}")
            
            return create_response(
                success=False,
                message="Invalid credentials",
                status=401
            )
            
    except json.JSONDecodeError:
        return create_response(
            success=False,
            message="Invalid JSON data",
            status=400
        )
    except Exception as e:
        logger.error(f"Login failed: {e}")
        return create_response(
            success=False,
            message="Login service error",
            status=500
        )

@csrf_exempt
@require_http_methods(["POST"])
def logout_view(request: HttpRequest) -> JsonResponse:
    """User logout"""
    try:
        if request.user.is_authenticated:
            user_id = getattr(request.user, 'id', None)
            if user_id is not None:
                logout(request)
                
                # Clear user session cache
                cache.delete(f"user_session_{user_id}")
                
                return create_response(
                    success=True,
                    message="Logout successful"
                )
            else:
                return create_response(
                    success=False,
                    message="User ID not available",
                    status=500
                )
        else:
            return create_response(
                success=False,
                message="User not authenticated",
                status=401
            )
            
    except Exception as e:
        logger.error(f"Logout failed: {e}")
        return create_response(
            success=False,
            message="Logout service error",
            status=500
        )

# User management views
@login_required
@require_http_methods(["GET"])
def get_user_profile(request: HttpRequest, user_id: str) -> JsonResponse:
    """Get user profile"""
    try:
        # Check cache first
        cached_profile = cache.get(f"user_profile_{user_id}")
        if cached_profile:
            return create_response(success=True, data=cached_profile)
        
        # Fetch from database
        user = User.objects.get(id=user_id)
        
        # TODO: Add UserProfile model and additional profile data
        profile_data: Dict[str, Any] = {
            "id": getattr(user, 'id', None),
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "date_joined": user.date_joined.isoformat(),
            "last_login": user.last_login.isoformat() if user.last_login else None,
            # Additional profile fields would go here
            "total_sessions": 0,  # TODO: Calculate from sessions
            "total_practice_time": 0,  # TODO: Calculate from sessions
            "favorite_poses": [],  # TODO: Get from user preferences
            "skill_level": "beginner",  # TODO: Get from user profile
            "goals": []  # TODO: Get from user goals
        }
        
        # Cache profile
        cache.set(f"user_profile_{user_id}", profile_data, 1800)  # 30 minutes
        
        return create_response(success=True, data=profile_data)
        
    except User.DoesNotExist:
        return create_response(
            success=False,
            message="User not found",
            status=404
        )
    except Exception as e:
        logger.error(f"Failed to get user profile: {e}")
        return create_response(
            success=False,
            message="Failed to retrieve user profile",
            status=500
        )

@login_required
@csrf_exempt
@require_http_methods(["PUT"])
@rate_limit(max_requests=10, window=600)  # 10 updates per 10 minutes
@validate_request_size()
def update_user_profile(request: HttpRequest, user_id: str) -> JsonResponse:
    """Update user profile with enhanced validation"""
    try:
        # Validate user_id format
        if not validate_user_id(user_id):
            return create_response(
                success=False,
                message="Invalid user ID format",
                status=400
            )
        
        current_user_id = getattr(request.user, 'id', None)
        if str(current_user_id) != str(user_id):
            logger.warning(f"User {current_user_id} attempted to access user {user_id}")
            return create_response(
                success=False,
                message="Permission denied",
                status=403
            )
        
        data = json.loads(request.body)
        user = User.objects.get(id=user_id)
        
        # Validate and sanitize input fields
        updated_fields = []
        
        if 'first_name' in data:
            first_name = sanitize_input(data['first_name'], 30)
            if len(first_name) > 30:
                return create_response(
                    success=False,
                    message="First name too long",
                    status=400
                )
            user.first_name = first_name
            updated_fields.append('first_name')
            
        if 'last_name' in data:
            last_name = sanitize_input(data['last_name'], 30)
            if len(last_name) > 30:
                return create_response(
                    success=False,
                    message="Last name too long",
                    status=400
                )
            user.last_name = last_name
            updated_fields.append('last_name')
            
        if 'email' in data:
            email = sanitize_input(data['email'], 254)
            try:
                validate_email(email)
                user.email = email
                updated_fields.append('email')
            except ValidationError:
                return create_response(
                    success=False,
                    message="Invalid email format",
                    status=400
                )
        
        # Only save if there are actual changes
        if updated_fields:
            user.save(update_fields=updated_fields)
            
            # Clear cache
            cache.delete(f"user_profile_{user_id}")
            cache.delete(f"user_session_{user_id}")
            
            logger.info(f"User {user_id} updated fields: {', '.join(updated_fields)}")
        
        return create_response(
            success=True,
            message="Profile updated successfully",
            data={"updated_fields": updated_fields}
        )
        
    except User.DoesNotExist:
        return create_response(
            success=False,
            message="User not found",
            status=404
        )
    except json.JSONDecodeError:
        return create_response(
            success=False,
            message="Invalid JSON data",
            status=400
        )
    except Exception as e:
        logger.error(f"Failed to update user profile: {e}")
        return create_response(
            success=False,
            message="Failed to update user profile",
            status=500
        )

# Posture management views
@require_http_methods(["GET"])
def get_postures(request: HttpRequest) -> JsonResponse:
    """Get yoga postures"""
    try:
        # Check cache first
        cached_postures = cache.get("all_postures")
        if cached_postures:
            return create_response(success=True, data=cached_postures)
        
        # TODO: Fetch from Posture model
        # For now, return mock data
        postures: List[Dict[str, Any]] = [
            {
                "id": 1,
                "name": "Mountain Pose",
                "sanskrit_name": "Tadasana",
                "description": "A foundational standing pose that improves posture and balance",
                "difficulty": "beginner",
                "category": "standing",
                "benefits": ["Improves posture", "Strengthens thighs", "Develops balance"],
                "duration": 30,
                "instructions": [
                    "Stand with feet hip-width apart",
                    "Keep arms at your sides",
                    "Engage your core",
                    "Hold for 30 seconds"
                ]
            },
            {
                "id": 2,
                "name": "Warrior I",
                "sanskrit_name": "Virabhadrasana I",
                "description": "A powerful standing pose that builds strength and stability",
                "difficulty": "intermediate",
                "category": "standing",
                "benefits": ["Strengthens legs", "Opens hips", "Improves balance"],
                "duration": 60,
                "instructions": [
                    "Step left foot back 3-4 feet",
                    "Turn left foot out 45 degrees",
                    "Bend right knee over ankle",
                    "Raise arms overhead",
                    "Hold for 60 seconds, switch sides"
                ]
            },
            {
                "id": 3,
                "name": "Tree Pose",
                "sanskrit_name": "Vrikshasana",
                "description": "A balancing pose that strengthens legs and improves focus",
                "difficulty": "intermediate",
                "category": "balancing",
                "benefits": ["Improves balance", "Strengthens legs", "Enhances focus"],
                "duration": 45,
                "instructions": [
                    "Stand on left foot",
                    "Place right foot on inner left thigh",
                    "Bring palms together at heart center",
                    "Hold for 45 seconds, switch sides"
                ]
            },
            {
                "id": 4,
                "name": "Downward Facing Dog",
                "sanskrit_name": "Adho Mukha Svanasana",
                "description": "An energizing pose that stretches and strengthens the entire body",
                "difficulty": "beginner",
                "category": "inversion",
                "benefits": ["Stretches hamstrings", "Strengthens arms", "Energizes body"],
                "duration": 60,
                "instructions": [
                    "Start on hands and knees",
                    "Tuck toes under",
                    "Lift hips up and back",
                    "Straighten legs",
                    "Hold for 60 seconds"
                ]
            }
        ]
        
        # Cache postures
        cache.set("all_postures", postures, 3600)  # 1 hour
        
        return create_response(success=True, data=postures)
        
    except Exception as e:
        logger.error(f"Failed to get postures: {e}")
        return create_response(
            success=False,
            message="Failed to retrieve postures",
            status=500
        )

@login_required
@csrf_exempt
@require_http_methods(["POST"])
def create_custom_posture(request: HttpRequest) -> JsonResponse:
    """Create custom yoga posture"""
    try:
        data = json.loads(request.body)
        
        # TODO: Create custom posture in database
        # For now, return success response
        custom_posture: Dict[str, Any] = {
            "id": f"custom_{timezone.now().timestamp()}",
            "name": data.get("name", "Custom Pose"),
            "description": data.get("description", ""),
            "difficulty": data.get("difficulty", "beginner"),
            "category": "custom",
            "created_by": getattr(request.user, 'id', None),
            "created_at": timezone.now().isoformat()
        }
        
        return create_response(
            success=True,
            data=custom_posture,
            message="Custom posture created successfully"
        )
        
    except json.JSONDecodeError:
        return create_response(
            success=False,
            message="Invalid JSON data",
            status=400
        )
    except Exception as e:
        logger.error(f"Failed to create custom posture: {e}")
        return create_response(
            success=False,
            message="Failed to create custom posture",
            status=500
        )

# Session management views
@login_required
@csrf_exempt
@require_http_methods(["POST"])
def create_session(request: HttpRequest) -> JsonResponse:
    """Create new yoga session"""
    try:
        data = json.loads(request.body)
        
        # TODO: Create session in database
        session_data: Dict[str, Any] = {
            "id": f"session_{timezone.now().timestamp()}",
            "user_id": data.get("user_id", getattr(request.user, 'id', None)),
            "posture_type": data.get("posture_type", "general"),
            "status": "active",
            "start_time": timezone.now().isoformat(),
            "config": data.get("config", {}),
            "analysis_results": []
        }
        
        return create_response(
            success=True,
            data=session_data,
            message="Session created successfully"
        )
        
    except json.JSONDecodeError:
        return create_response(
            success=False,
            message="Invalid JSON data",
            status=400
        )
    except Exception as e:
        logger.error(f"Failed to create session: {e}")
        return create_response(
            success=False,
            message="Failed to create session",
            status=500
        )

@login_required
@require_http_methods(["GET"])
def get_session_history(request: HttpRequest, user_id: str) -> JsonResponse:
    """Get user's session history"""
    try:
        current_user_id = getattr(request.user, 'id', None)
        if str(current_user_id) != str(user_id):
            return create_response(
                success=False,
                message="Permission denied",
                status=403
            )
        
        # TODO: Fetch from Session model
        # Mock data for now
        sessions: List[Dict[str, Any]] = [
            {
                "id": "session_1",
                "posture_type": "warrior",
                "duration": 1800,  # 30 minutes
                "accuracy_score": 85.5,
                "completed_at": (timezone.now() - timedelta(days=1)).isoformat(),
                "calories_burned": 120
            },
            {
                "id": "session_2",
                "posture_type": "tree",
                "duration": 900,  # 15 minutes
                "accuracy_score": 78.2,
                "completed_at": (timezone.now() - timedelta(days=2)).isoformat(),
                "calories_burned": 60
            }
        ]
        
        return create_response(success=True, data=sessions)
        
    except Exception as e:
        logger.error(f"Failed to get session history: {e}")
        return create_response(
            success=False,
            message="Failed to retrieve session history",
            status=500
        )

# Analytics views
@login_required
@require_http_methods(["GET"])
def get_analytics(request: HttpRequest) -> JsonResponse:
    """Get user analytics"""
    try:
        current_user_id = getattr(request.user, 'id', None)
        user_id = request.GET.get('user_id', str(current_user_id) if current_user_id else None)
        days = int(request.GET.get('days', 7))
        
        # TODO: Calculate real analytics from database
        # Mock analytics data
        analytics: Dict[str, Any] = {
            "user_id": user_id,
            "period_days": days,
            "total_sessions": 15,
            "total_practice_time": 7200,  # 2 hours in seconds
            "average_session_duration": 480,  # 8 minutes
            "average_accuracy": 82.5,
            "most_practiced_pose": "Warrior I",
            "improvement_trend": "positive",
            "calories_burned": 450,
            "session_frequency": {
                "weekly": 5,
                "monthly": 20
            },
            "accuracy_by_pose": {
                "warrior": 85.2,
                "tree": 78.9,
                "mountain": 92.1,
                "downward_dog": 79.5
            },
            "daily_stats": [
                {"date": (timezone.now() - timedelta(days=i)).date().isoformat(), 
                 "sessions": 2 if i % 2 == 0 else 1,
                 "duration": 600 if i % 2 == 0 else 300}
                for i in range(days)
            ]
        }
        
        return create_response(success=True, data=analytics)
        
    except ValueError:
        return create_response(
            success=False,
            message="Invalid days parameter",
            status=400
        )
    except Exception as e:
        logger.error(f"Failed to get analytics: {e}")
        return create_response(
            success=False,
            message="Failed to retrieve analytics",
            status=500
        )

@login_required
@require_http_methods(["GET"])
def get_user_progress(request: HttpRequest, user_id: str) -> JsonResponse:
    """Get user progress over time"""
    try:
        current_user_id = getattr(request.user, 'id', None)
        if str(current_user_id) != str(user_id):
            return create_response(
                success=False,
                message="Permission denied",
                status=403
            )
        
        time_range = request.GET.get('range', '30d')
        
        # TODO: Calculate real progress from database
        # Mock progress data
        progress: Dict[str, Any] = {
            "user_id": user_id,
            "time_range": time_range,
            "overall_improvement": 15.5,  # percentage
            "accuracy_trend": [
                {"date": (timezone.now() - timedelta(days=30-i)).date().isoformat(),
                 "accuracy": 70 + (i * 0.5)}  # Gradual improvement
                for i in range(30)
            ],
            "consistency_score": 78.5,
            "goals_achieved": 3,
            "total_goals": 5,
            "milestones": [
                {
                    "title": "First Perfect Pose",
                    "achieved_at": (timezone.now() - timedelta(days=20)).isoformat(),
                    "accuracy": 95.0
                },
                {
                    "title": "10 Sessions Completed",
                    "achieved_at": (timezone.now() - timedelta(days=15)).isoformat(),
                    "sessions": 10
                }
            ]
        }
        
        return create_response(success=True, data=progress)
        
    except Exception as e:
        logger.error(f"Failed to get user progress: {e}")
        return create_response(
            success=False,
            message="Failed to retrieve user progress",
            status=500
        )

# Stats update view
@csrf_exempt
@require_http_methods(["POST"])
def update_stats(request: HttpRequest) -> JsonResponse:
    """Update user statistics"""
    try:
        data = json.loads(request.body)
        user_id = data.get("user_id")
        
        if not user_id:
            return create_response(
                success=False,
                message="User ID is required",
                status=400
            )
        
        # TODO: Update stats in database
        # For now, just acknowledge the update
        
        return create_response(
            success=True,
            message="Stats updated successfully"
        )
        
    except json.JSONDecodeError:
        return create_response(
            success=False,
            message="Invalid JSON data",
            status=400
        )
    except Exception as e:
        logger.error(f"Failed to update stats: {e}")
        return create_response(
            success=False,
            message="Failed to update stats",
            status=500
        )

# Analysis results view
@csrf_exempt
@require_http_methods(["POST"])
def store_analysis_results(request: HttpRequest) -> JsonResponse:
    """Store ML analysis results"""
    try:
        analysis_data = json.loads(request.body)
        
        # TODO: Store analysis results in database
        # For now, just acknowledge the storage
        # Analysis data structure: analysis_data contains pose analysis results
        logger.info(f"Received analysis data with {len(analysis_data.get('results', []))} results")
        
        return create_response(
            success=True,
            message="Analysis results stored successfully"
        )
        
    except json.JSONDecodeError:
        return create_response(
            success=False,
            message="Invalid JSON data",
            status=400
        )
    except Exception as e:
        logger.error(f"Failed to store analysis results: {e}")
        return create_response(
            success=False,
            message="Failed to store analysis results",
            status=500
        )

# Service integration view
@require_http_methods(["GET"])
def service_integration_status(request: HttpRequest) -> JsonResponse:
    """Check integration status with other services"""
    try:
        integration_status = {
            "fastapi_service": {
                "status": "unknown",
                "last_check": timezone.now().isoformat()
            },
            "ml_service": {
                "status": "unknown",
                "last_check": timezone.now().isoformat()
            }
        }
        
        # Check FastAPI service
        try:
            _ = call_external_service(f"{FASTAPI_SERVICE_URL}/health", timeout=5)
            integration_status["fastapi_service"]["status"] = "healthy"
            integration_status["fastapi_service"]["response_time"] = "< 5s"
        except Exception as e:
            integration_status["fastapi_service"]["status"] = "unhealthy"
            integration_status["fastapi_service"]["error"] = str(e)
        
        # Check ML service
        try:
            _ = call_external_service(f"{ML_SERVICE_URL}/health", timeout=5)
            integration_status["ml_service"]["status"] = "healthy"
            integration_status["ml_service"]["response_time"] = "< 5s"
        except Exception as e:
            integration_status["ml_service"]["status"] = "unhealthy"
            integration_status["ml_service"]["error"] = str(e)
        
        return create_response(
            success=True,
            data=integration_status,
            message="Integration status checked"
        )
        
    except Exception as e:
        logger.error(f"Failed to check integration status: {e}")
        return create_response(
            success=False,
            message="Failed to check integration status",
            status=500
        )

# Additional security helper functions
def hash_sensitive_data(data: str) -> str:
    """Hash sensitive data for logging"""
    return hashlib.sha256(data.encode()).hexdigest()[:8]

def validate_json_structure(data: dict, required_fields: List[str]) -> bool:
    """Validate JSON structure has required fields"""
    return all(field in data for field in required_fields)

def log_security_event(event_type: str, user_id: Optional[str], client_ip: str, details: str = ""):
    """Log security-related events"""
    logger.warning(f"SECURITY_EVENT: {event_type} | User: {user_id} | IP: {client_ip} | Details: {details}")

# Rate limiting view for testing
@require_http_methods(["GET"])
@rate_limit(max_requests=2, window=60)  # Very restrictive for testing
def test_rate_limit(request: HttpRequest) -> JsonResponse:
    """Test endpoint for rate limiting"""
    return create_response(
        success=True,
        message="Rate limit test passed",
        data={"timestamp": timezone.now().isoformat()}
    )
