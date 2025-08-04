#!/bin/bash

# YoJa Project Integration Setup Script
# This script ensures all services are properly integrated and can communicate

echo "YoJa Integration Setup Starting..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}$1${NC}"
}

# Check if Docker is installed
check_docker() {
    print_header "Checking Docker Installation..."
    
    if command -v docker &> /dev/null; then
        print_status "Docker is installed: $(docker --version)"
    else
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if command -v docker-compose &> /dev/null; then
        print_status "Docker Compose is installed: $(docker-compose --version)"
    elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
        print_status "Docker Compose (plugin) is available: $(docker compose version)"
    else
        print_error "Docker Compose is not available. Please install Docker Compose."
        exit 1
    fi
}

# Validate docker-compose.yml
validate_compose() {
    print_header "Validating Docker Compose Configuration..."
    
    if [ -f "docker-compose.yml" ]; then
        print_status "docker-compose.yml found"
        
        # Try to validate the compose file
        if docker-compose config --quiet 2>/dev/null || docker compose config --quiet 2>/dev/null; then
            print_status "Docker Compose configuration is valid"
        else
            print_warning "Docker Compose configuration validation failed, but continuing..."
        fi
    else
        print_error "docker-compose.yml not found in current directory"
        exit 1
    fi
}

# Check environment files
setup_environment() {
    print_header "Setting up Environment Configuration..."
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        print_status "Creating .env file with default values..."
        cat > .env << EOF
# Database Configuration
POSTGRES_USER=adminYoja
POSTGRES_PASSWORD=Yoja\$#@98342
POSTGRES_DB_MAIN=yoja_main
POSTGRES_DB_ANALYTICS=yoja_analytics

# Redis Configuration
REDIS_URL=redis://redis:6379/0

# Service URLs (Internal Docker Network)
FASTAPI_SERVICE_URL=http://fastapi-service:8000
DJANGO_SERVICE_URL=http://django-service:8001
ML_SERVICE_URL=http://ml-service:8889

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# MinIO Configuration
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin123

# ML Configuration
MODEL_PATH=/ml/models
DATA_PATH=/ml/data

# Development/Production
NODE_ENV=development
DJANGO_SETTINGS_MODULE=yoja_project.settings.development
EOF
        print_status ".env file created successfully"
    else
        print_status ".env file already exists"
    fi
}

# Create necessary directories
create_directories() {
    print_header "Creating Required Directories..."
    
    directories=(
        "backend/fastapi_service"
        "backend/django_service"
        "machine_learning/models"
        "machine_learning/data"
        "machine_learning/logs"
        "database/backups"
        "frontend/src/services"
        "nginx/conf.d"
        "ssl"
        "monitoring"
        "logs"
    )
    
    for dir in "${directories[@]}"; do
        if [ ! -d "$dir" ]; then
            mkdir -p "$dir"
            print_status "Created directory: $dir"
        else
            print_status "Directory exists: $dir"
        fi
    done
}

# Create requirements files if they don't exist
create_requirements() {
    print_header "Setting up Requirements Files..."
    
    # FastAPI requirements
    if [ ! -f "backend/fastapi_service/requirements.txt" ]; then
        cat > backend/fastapi_service/requirements.txt << EOF
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
sqlalchemy==2.0.23
asyncpg==0.29.0
redis==5.0.1
aiohttp==3.9.1
pydantic==2.5.0
python-dotenv==1.0.0
celery==5.3.4
PIL==10.1.0
requests==2.31.0
websockets==12.0
EOF
        print_status "Created FastAPI requirements.txt"
    fi
    
    # Django requirements
    if [ ! -f "backend/django_service/requirements.txt" ]; then
        cat > backend/django_service/requirements.txt << EOF
Django==4.2.7
djangorestframework==3.14.0
psycopg2-binary==2.9.9
redis==5.0.1
celery==5.3.4
django-celery-beat==2.5.0
django-cors-headers==4.3.1
python-dotenv==1.0.0
requests==2.31.0
Pillow==10.1.0
django-extensions==3.2.3
gunicorn==21.2.0
whitenoise==6.6.0
EOF
        print_status "Created Django requirements.txt"
    fi
    
    # ML requirements
    if [ ! -f "machine_learning/requirements.txt" ]; then
        cat > machine_learning/requirements.txt << EOF
fastapi==0.104.1
uvicorn[standard]==0.24.0
numpy==1.24.3
opencv-python==4.8.1.78
mediapipe==0.10.8
tensorflow==2.13.0
scikit-learn==1.3.2
pandas==2.0.3
matplotlib==3.7.2
seaborn==0.12.2
jupyter==1.0.0
jupyterlab==4.0.8
aiohttp==3.9.1
websockets==12.0
python-multipart==0.0.6
python-dotenv==1.0.0
Pillow==10.1.0
requests==2.31.0
EOF
        print_status "Created ML requirements.txt"
    fi
    
    # Frontend package.json
    if [ ! -f "frontend/package.json" ]; then
        cat > frontend/package.json << EOF
{
  "name": "yoja-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0",
    "react-router-dom": "^6.8.0",
    "@tailwindcss/forms": "^0.5.6"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@vitejs/plugin-react": "^4.1.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.53.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.4",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "vite": "^4.5.0"
  }
}
EOF
        print_status "Created frontend package.json"
    fi
}

# Create Docker healthcheck script
create_healthcheck() {
    print_header "Creating Health Check Scripts..."
    
    cat > healthcheck.sh << 'EOF'
#!/bin/bash
# Health check script for all services

echo "YoJa Services Health Check"
echo "================================"

check_service() {
    local service_name=$1
    local url=$2
    local expected_status=${3:-200}
    
    echo -n "Checking $service_name... "
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "$expected_status"; then
        echo "Healthy"
        return 0
    else
        echo "Unhealthy"
        return 1
    fi
}

# Check all services
services=(
    "Frontend:http://localhost:3000:200"
    "FastAPI:http://localhost:8000/health:200"
    "Django:http://localhost:8001/health/:200"
    "ML Service:http://localhost:8889/health:200"
    "Grafana:http://localhost:3001:200"
    "Jupyter:http://localhost:8888:200"
)

healthy_count=0
total_count=${#services[@]}

for service in "${services[@]}"; do
    IFS=':' read -r name url status <<< "$service"
    if check_service "$name" "$url" "$status"; then
        ((healthy_count++))
    fi
done

echo "================================"
echo "Health Summary: $healthy_count/$total_count services healthy"

if [ $healthy_count -eq $total_count ]; then
    echo "All services are healthy!"
    exit 0
else
    echo "Some services are unhealthy. Check the logs."
    exit 1
fi
EOF
    
    chmod +x healthcheck.sh
    print_status "Created healthcheck.sh script"
}

# Create service management scripts
create_management_scripts() {
    print_header "Creating Service Management Scripts..."
    
    # Start script
    cat > start.sh << 'EOF'
#!/bin/bash
echo "Starting YoJa Services..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Docker is not running. Please start Docker first."
    exit 1
fi

# Build and start services
echo "Building and starting services..."
if command -v docker-compose &> /dev/null; then
    docker-compose up -d --build
elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
    docker compose up -d --build
else
    echo "Docker Compose not found"
    exit 1
fi

echo "Waiting for services to be ready..."
sleep 30

# Run health check
if [ -f "healthcheck.sh" ]; then
    ./healthcheck.sh
fi

echo "YoJa services are starting up!"
echo "Access the application at: http://localhost:3000"
EOF
    
    chmod +x start.sh
    print_status "Created start.sh script"
    
    # Stop script
    cat > stop.sh << 'EOF'
#!/bin/bash
echo "Stopping YoJa Services..."

if command -v docker-compose &> /dev/null; then
    docker-compose down
elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
    docker compose down
else
    echo "Docker Compose not found"
    exit 1
fi

echo "YoJa services stopped"
EOF
    
    chmod +x stop.sh
    print_status "Created stop.sh script"
    
    # Restart script
    cat > restart.sh << 'EOF'
#!/bin/bash
echo "Restarting YoJa Services..."

./stop.sh
sleep 5
./start.sh
EOF
    
    chmod +x restart.sh
    print_status "Created restart.sh script"
    
    # Logs script
    cat > logs.sh << 'EOF'
#!/bin/bash
service=${1:-}

if [ -z "$service" ]; then
    echo "Showing logs for all services..."
    if command -v docker-compose &> /dev/null; then
        docker-compose logs -f
    elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
        docker compose logs -f
    fi
else
    echo "Showing logs for service: $service"
    if command -v docker-compose &> /dev/null; then
        docker-compose logs -f "$service"
    elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
        docker compose logs -f "$service"
    fi
fi
EOF
    
    chmod +x logs.sh
    print_status "Created logs.sh script"
}

# Create nginx configuration
create_nginx_config() {
    print_header "Creating Nginx Configuration..."
    
    mkdir -p nginx/conf.d
    
    cat > nginx/nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }
    
    upstream fastapi {
        server fastapi-service:8000;
    }
    
    upstream django {
        server django-service:8001;
    }
    
    upstream ml {
        server ml-service:8889;
    }

    server {
        listen 80;
        server_name localhost;

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # FastAPI
        location /api/v1/ {
            proxy_pass http://fastapi/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Django
        location /api/v2/ {
            proxy_pass http://django/api/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # ML Service
        location /ml/ {
            proxy_pass http://ml/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # WebSocket support
        location /ws {
            proxy_pass http://fastapi;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Health check
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
EOF
    
    print_status "Created nginx configuration"
}

# Create development vs production configurations
create_env_configs() {
    print_header "Creating Environment Configurations..."
    
    # Development environment
    cat > .env.development << 'EOF'
# Development Environment Configuration
NODE_ENV=development
DEBUG=true
DJANGO_DEBUG=True

# Database URLs (Development)
DATABASE_URL=postgresql+asyncpg://adminYoja:Yoja$#@98342@localhost:5432/yoja_main
DJANGO_DATABASE_URL=postgresql://adminYoja:Yoja$#@98342@localhost:5432/yoja_main

# Service URLs (Development - External Access)
REACT_APP_FASTAPI_URL=http://localhost:8000
REACT_APP_DJANGO_URL=http://localhost:8001
REACT_APP_ML_URL=http://localhost:8889
REACT_APP_WEBSOCKET_URL=ws://localhost:8000/ws

# Enable hot reloading
CHOKIDAR_USEPOLLING=true
WATCHPACK_POLLING=true
EOF
    
    # Production environment
    cat > .env.production << 'EOF'
# Production Environment Configuration
NODE_ENV=production
DEBUG=false
DJANGO_DEBUG=False

# Database URLs (Production)
DATABASE_URL=postgresql+asyncpg://adminYoja:Yoja$#@98342@postgres_main:5432/yoja_main
DJANGO_DATABASE_URL=postgresql://adminYoja:Yoja$#@98342@postgres_main:5432/yoja_main

# Service URLs (Production - Internal Network)
FASTAPI_SERVICE_URL=http://fastapi-service:8000
DJANGO_SERVICE_URL=http://django-service:8001
ML_SERVICE_URL=http://ml-service:8889

# Frontend URLs (Production - Through Nginx)
REACT_APP_FASTAPI_URL=/api/v1
REACT_APP_DJANGO_URL=/api/v2
REACT_APP_ML_URL=/ml
REACT_APP_WEBSOCKET_URL=ws://localhost/ws

# Security (Change these in production!)
JWT_SECRET_KEY=CHANGE-THIS-IN-PRODUCTION-TO-A-SECURE-KEY
POSTGRES_PASSWORD=CHANGE-THIS-IN-PRODUCTION
EOF
    
    print_status "Created environment configuration files"
}

# Main execution
main() {
    print_header "YoJa Project Integration Setup"
    echo "This script will set up the YoJa project for easy integration between all services."
    echo
    
    check_docker
    validate_compose
    setup_environment
    create_directories
    create_requirements
    create_healthcheck
    create_management_scripts
    create_nginx_config
    create_env_configs
    
    print_header "Integration Setup Complete!"
    echo
    print_status "Next steps:"
    echo "  1. Run './start.sh' to start all services"
    echo "  2. Run './healthcheck.sh' to verify all services are healthy"
    echo "  3. Access the application at http://localhost:3000"
    echo "  4. Use './logs.sh [service-name]' to view logs"
    echo "  5. Use './stop.sh' to stop all services"
    echo
    print_status "Service URLs:"
    echo "  • Frontend:        http://localhost:3000"
    echo "  • FastAPI:         http://localhost:8000"
    echo "  • Django:          http://localhost:8001"
    echo "  • ML Service:      http://localhost:8889"
    echo "  • Jupyter:         http://localhost:8888"
    echo "  • Grafana:         http://localhost:3001"
    echo "  • PostgreSQL:      localhost:5432"
    echo "  • Redis:           localhost:6379"
    echo
    print_status "Your YoJa project is ready for integrated development!"
}

# Run main function
main "$@"
