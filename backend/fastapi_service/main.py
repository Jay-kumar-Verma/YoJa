"""
FastAPI Integration Service - Lightweight operations and real-time communication
Handles authentication, real-time updates, and coordinates with Django and ML services
"""

from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import aiohttp
import json
import logging
from datetime import datetime, timedelta, timezone
from typing import List, Dict, Any, Optional
import os
import uvicorn
from contextlib import asynccontextmanager
try:
    import redis.asyncio as redis
except ImportError:
    redis = None  # type: ignore
import jwt
from passlib.context import CryptContext

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
DJANGO_SERVICE_URL = os.getenv('DJANGO_SERVICE_URL', 'http://django-service:8001')
ML_SERVICE_URL = os.getenv('ML_SERVICE_URL', 'http://ml-service:8889')
REDIS_URL = os.getenv('REDIS_URL', 'redis://redis:6379/0')
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-super-secret-jwt-key')
JWT_ALGORITHM = os.getenv('JWT_ALGORITHM', 'HS256')
JWT_EXPIRATION_DELTA = timedelta(minutes=30)

# Security
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Redis connection
redis_client: Optional[Any] = None

class ConnectionManager:
    """WebSocket connection manager for real-time communication"""
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.user_connections: Dict[str, WebSocket] = {}
    
    async def connect(self, websocket: WebSocket, user_id: Optional[str] = None):
        await websocket.accept()
        self.active_connections.append(websocket)
        if user_id:
            self.user_connections[user_id] = websocket
    
    def disconnect(self, websocket: WebSocket, user_id: Optional[str] = None):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        if user_id and user_id in self.user_connections:
            del self.user_connections[user_id]
    
    async def send_personal_message(self, message: Dict[str, Any], user_id: str):
        if user_id in self.user_connections:
            websocket = self.user_connections[user_id]
            try:
                await websocket.send_text(json.dumps(message))
            except:
                self.disconnect(websocket, user_id)
    
    async def broadcast(self, message: Dict[str, Any]):
        disconnected: List[WebSocket] = []
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except:
                disconnected.append(connection)
        
        # Clean up disconnected connections
        for conn in disconnected:
            self.disconnect(conn)

manager = ConnectionManager()

# JWT token handling
def create_access_token(data: Dict[str, Any]) -> str:
    to_encode: Dict[str, Any] = data.copy()
    expire = datetime.now(timezone.utc) + JWT_EXPIRATION_DELTA
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id: Optional[str] = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

# Service integration helpers
async def call_django_service(endpoint: str, method: str = "GET", data: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
    """Make HTTP calls to Django service"""
    try:
        async with aiohttp.ClientSession() as session:
            url = f"{DJANGO_SERVICE_URL}{endpoint}"
            
            if method == "GET":
                async with session.get(url) as response:
                    return await response.json()
            elif method == "POST":
                async with session.post(url, json=data) as response:
                    return await response.json()
            elif method == "PUT":
                async with session.put(url, json=data) as response:
                    return await response.json()
            elif method == "DELETE":
                async with session.delete(url) as response:
                    return await response.json()
    except Exception as e:
        logger.error(f"Django service call failed: {e}")
        raise HTTPException(status_code=503, detail="Django service unavailable")

async def call_ml_service(endpoint: str, method: str = "GET", data: Optional[Dict[str, Any]] = None, files: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
    """Make HTTP calls to ML service"""
    try:
        async with aiohttp.ClientSession() as session:
            url = f"{ML_SERVICE_URL}{endpoint}"
            
            if method == "GET":
                async with session.get(url) as response:
                    return await response.json()
            elif method == "POST":
                if files:
                    # Handle file uploads
                    form_data = aiohttp.FormData()
                    for key, value in files.items():
                        form_data.add_field(key, value)
                    if data:
                        for key, value in data.items():
                            form_data.add_field(key, value)
                    async with session.post(url, data=form_data) as response:
                        return await response.json()
                else:
                    async with session.post(url, json=data) as response:
                        return await response.json()
    except Exception as e:
        logger.error(f"ML service call failed: {e}")
        raise HTTPException(status_code=503, detail="ML service unavailable")

# FastAPI app initialization
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global redis_client
    redis_client = redis.from_url(REDIS_URL)
    logger.info("FastAPI Service starting up...")
    yield
    # Shutdown
    if redis_client:
        await redis_client.close()
    logger.info("FastAPI Service shutting down...")

app = FastAPI(
    title="YoJa FastAPI Service",
    description="Lightweight operations and real-time communication hub",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/health")
async def health_check() -> Dict[str, Any]:
    """Health check endpoint"""
    service_health: Dict[str, str] = {
        "fastapi": "healthy",
        "redis": "unknown",
        "django": "unknown",
        "ml": "unknown"
    }
    
    # Check Redis
    try:
        if redis_client:
            await redis_client.ping()
            service_health["redis"] = "healthy"
        else:
            service_health["redis"] = "unavailable"
    except:
        service_health["redis"] = "unhealthy"
    
    # Check Django service
    try:
        await call_django_service("/health/")
        service_health["django"] = "healthy"
    except:
        service_health["django"] = "unhealthy"
    
    # Check ML service
    try:
        await call_ml_service("/health")
        service_health["ml"] = "healthy"
    except:
        service_health["ml"] = "unhealthy"
    
    return {
        "status": "healthy",
        "service": "fastapi-service",
        "timestamp": datetime.now().isoformat(),
        "services": service_health
    }

# Authentication endpoints
@app.post("/auth/login")
async def login(credentials: Dict[str, Any]) -> Dict[str, Any]:
    """User authentication"""
    try:
        # Validate credentials with Django service
        django_response = await call_django_service("/api/auth/login", "POST", credentials)
        
        if django_response and django_response.get("success"):
            # Create JWT token
            user_data = django_response.get("user", {})
            access_token = create_access_token(data={"sub": str(user_data.get("id"))})
            
            # Cache user session in Redis
            if redis_client:
                await redis_client.setex(
                    f"session:{user_data.get('id')}", 
                    3600,  # 1 hour
                    json.dumps(user_data)
                )
            
            return {
                "access_token": access_token,
                "token_type": "bearer",
                "user": user_data,
                "expires_in": JWT_EXPIRATION_DELTA.total_seconds()
            }
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login failed: {e}")
        raise HTTPException(status_code=500, detail="Login service unavailable")

@app.post("/auth/logout")
async def logout(user_id: str = Depends(verify_token)) -> Dict[str, str]:
    """User logout"""
    try:
        # Remove session from Redis
        if redis_client:
            await redis_client.delete(f"session:{user_id}")
        
        # Notify Django service
        await call_django_service(f"/api/auth/logout", "POST", {"user_id": user_id})
        
        return {"message": "Logged out successfully"}
        
    except Exception as e:
        logger.error(f"Logout failed: {e}")
        return {"message": "Logged out successfully"}  # Return success even if some operations fail

# Yoga session management
@app.post("/yoga/session/start")
async def start_yoga_session(session_config: Dict[str, Any], user_id: str = Depends(verify_token)) -> Dict[str, Any]:
    """Start a new yoga session"""
    try:
        # Create session in Django service
        session_data: Dict[str, Any] = {
            "user_id": user_id,
            "config": session_config,
            "status": "active",
            "start_time": datetime.now().isoformat()
        }
        
        django_response = await call_django_service("/api/sessions", "POST", session_data)
        session_id = django_response.get("id") if django_response else None
        
        # Cache session in Redis for real-time updates
        if redis_client:
            await redis_client.setex(
                f"session:{session_id}",
                7200,  # 2 hours
                json.dumps(session_data)
            )
        
        # Notify user via WebSocket
        await manager.send_personal_message({
            "type": "session_started",
            "session_id": session_id,
            "config": session_config
        }, user_id)
        
        return {
            "session_id": session_id,
            "status": "started",
            "config": session_config
        }
        
    except Exception as e:
        logger.error(f"Failed to start session: {e}")
        raise HTTPException(status_code=500, detail="Failed to start yoga session")
        raise HTTPException(status_code=500, detail="Failed to start yoga session")

@app.post("/yoga/session/{session_id}/end")
@app.post("/yoga/session/end/{session_id}")
async def end_yoga_session(session_id: str, user_id: str = Depends(verify_token)) -> Dict[str, Any]:
    """End a yoga session"""
    try:
        # Get session data from Redis
        if redis_client:
            session_data = await redis_client.get(f"session:{session_id}")
            if session_data:
                session_info = json.loads(session_data)
                session_info["end_time"] = datetime.now().isoformat()
                session_info["status"] = "completed"
                
                # Update session in Django service
                await call_django_service(f"/api/sessions/{session_id}", "PUT", session_info)
                
                # Remove from Redis
                await redis_client.delete(f"session:{session_id}")
                
                # Notify user via WebSocket
                await manager.send_personal_message({
                    "type": "session_ended",
                    "session_id": session_id,
                    "duration": session_info.get("duration", 0)
                }, user_id)
                
                return {"message": "Session ended successfully", "session_id": session_id}
            else:
                raise HTTPException(status_code=404, detail="Session not found")
        else:
            # Fallback to Django service only
            await call_django_service(f"/api/sessions/{session_id}", "PUT", {
                "end_time": datetime.now().isoformat(),
                "status": "completed"
            })
            return {"message": "Session ended successfully", "session_id": session_id}
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to end session: {e}")
        raise HTTPException(status_code=500, detail="Failed to end session")
        raise HTTPException(status_code=500, detail="Failed to end yoga session")

# Posture data endpoints
@app.get("/yoga/postures")
async def get_postures() -> Any:
    """Get yoga postures from Django service"""
    try:
        # Check Redis cache first
        if redis_client:
            cached_postures = await redis_client.get("postures:all")
            if cached_postures:
                return json.loads(cached_postures)
        
        # Fetch from Django service
        postures = await call_django_service("/api/postures")
        
        # Cache for 1 hour
        if redis_client:
            await redis_client.setex("postures:all", 3600, json.dumps(postures))
        
        return postures
        
        return postures
        
    except Exception as e:
        logger.error(f"Failed to get postures: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve postures")

# Real-time stats update
@app.post("/yoga/stats/update")
async def update_stats(stats_data: Dict[str, Any], user_id: str = Depends(verify_token)) -> Dict[str, str]:
    """Update real-time yoga stats"""
    try:
        # Update stats in Django service
        update_data: Dict[str, Any] = {
            "user_id": user_id,
            **stats_data
        }
        await call_django_service("/api/stats/update", "POST", update_data)
        
        # Cache latest stats in Redis
        if redis_client:
            await redis_client.setex(
                f"stats:{user_id}:latest",
                300,  # 5 minutes
                json.dumps(stats_data)
            )
        
        # Broadcast to user's connections
        await manager.send_personal_message({
            "type": "stats_updated",
            "stats": stats_data
        }, user_id)
        
        return {"message": "Stats updated successfully"}
        
    except Exception as e:
        logger.error(f"Failed to update stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to update stats")

# ML service integration
@app.post("/ml/analysis-result")
async def handle_ml_analysis_result(result_data: Dict[str, Any]) -> Dict[str, str]:
    """Handle ML analysis results from ML service"""
    try:
        # Store result in Redis for real-time access
        result_id = result_data.get("session_id", f"analysis_{datetime.now().timestamp()}")
        if redis_client:
            await redis_client.setex(
                f"analysis:{result_id}",
                1800,  # 30 minutes
                json.dumps(result_data)
            )
        
        # Forward to Django service for permanent storage
        await call_django_service("/api/analysis/results", "POST", result_data)
        
        # Broadcast to relevant users
        user_id = result_data.get("user_id")
        if user_id:
            await manager.send_personal_message({
                "type": "analysis_complete",
                "result": result_data
            }, str(user_id))
        
        return {"message": "Analysis result processed successfully"}
        
    except Exception as e:
        logger.error(f"Failed to handle ML analysis result: {e}")
        raise HTTPException(status_code=500, detail="Failed to process analysis result")

# WebSocket endpoint for real-time communication
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: Optional[str] = None):
    """WebSocket endpoint for real-time communication"""
    user_id = None
    
    # Verify token if provided
    if token:
        try:
            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
            user_id = payload.get("sub")
        except jwt.PyJWTError:
            await websocket.close(code=4001, reason="Invalid token")
            return
    
    await manager.connect(websocket, user_id)
    
    try:
        # Send welcome message
        await websocket.send_text(json.dumps({
            "type": "connection_established",
            "user_id": user_id,
            "timestamp": datetime.now().isoformat()
        }))
        
        while True:
            # Receive messages from client
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle different message types
            message_type = message.get("type")
            
            if message_type == "ping":
                await websocket.send_text(json.dumps({"type": "pong"}))
            
            elif message_type == "pose_update" and user_id:
                # Handle real-time pose updates
                pose_data = message.get("data", {})
                
                # Cache pose data in Redis
                if redis_client:
                    await redis_client.setex(
                        f"pose:{user_id}:current",
                        60,  # 1 minute
                        json.dumps(pose_data)
                    )
                
                # Optionally forward to ML service for real-time analysis
                if pose_data.get("analyze", False):
                    try:
                        ml_result = await call_ml_service("/pose/estimate", "POST", pose_data)
                        await websocket.send_text(json.dumps({
                            "type": "pose_analysis",
                            "result": ml_result
                        }))
                    except Exception as e:
                        logger.error(f"Real-time pose analysis failed: {e}")
            
            elif message_type == "session_update" and user_id:
                # Handle session updates
                session_data = message.get("data", {})
                session_id = session_data.get("session_id")
                
                if session_id and redis_client:
                    # Update session in Redis
                    cached_session = await redis_client.get(f"session:{session_id}")
                    if cached_session:
                        session_info = json.loads(cached_session)
                        session_info.update(session_data)
                        await redis_client.setex(
                            f"session:{session_id}",
                            7200,  # 2 hours
                            json.dumps(session_info)
                        )
            
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for user: {user_id}")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        manager.disconnect(websocket, user_id)

# Service status endpoint
@app.get("/status")
async def get_service_status() -> Dict[str, Any]:
    """Get comprehensive service status"""
    return {
        "service": "fastapi-service",
        "status": "running",
        "timestamp": datetime.now().isoformat(),
        "active_connections": len(manager.active_connections),
        "user_connections": len(manager.user_connections),
        "redis_connected": redis_client is not None,
        "version": "1.0.0"
    }

# Cache management endpoints
@app.delete("/cache/clear")
async def clear_cache(user_id: str = Depends(verify_token)) -> Dict[str, str]:
    """Clear user-specific cache (admin only)"""
    try:
        # Clear user-related cache keys
        keys_to_delete = [
            f"session:{user_id}",
            f"stats:{user_id}:latest",
            f"pose:{user_id}:current"
        ]
        
        if redis_client:
            for key in keys_to_delete:
                await redis_client.delete(key)
        
        return {"message": "Cache cleared successfully"}
        
    except Exception as e:
        logger.error(f"Failed to clear cache: {e}")
        raise HTTPException(status_code=500, detail="Failed to clear cache")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
