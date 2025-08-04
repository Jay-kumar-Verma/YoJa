#!/bin/bash
# YoJa Docker Management Script
# Works on Mac, Linux, and Windows (with Git Bash or WSL)

set -e

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
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to check if Docker Compose is available
check_docker_compose() {
    if docker compose version > /dev/null 2>&1; then
        DOCKER_COMPOSE="docker compose"
    elif docker-compose --version > /dev/null 2>&1; then
        DOCKER_COMPOSE="docker-compose"
    else
        print_error "Docker Compose is not available. Please install Docker Compose."
        exit 1
    fi
}

# Function to upgrade pip and download dependencies
prepare_dependencies() {
    print_header "Preparing Dependencies"
    
    # Check if requirements.txt exists in backend directories
    for backend_dir in "backend/fastapi_service" "backend/django_service" "machine_learning"; do
        if [ -f "$backend_dir/requirements.txt" ]; then
            print_status "Upgrading pip and downloading dependencies for $backend_dir"
            
            # Create dependencies directory
            mkdir -p "$backend_dir/dependencies"
            
            # Use system Python to download dependencies (cross-platform)
            if command -v python3 &> /dev/null; then
                PYTHON_CMD="python3"
            elif command -v python &> /dev/null; then
                PYTHON_CMD="python"
            else
                print_warning "Python not found in PATH. Dependencies will be downloaded during Docker build."
                continue
            fi
            
            print_status "Using Python command: $PYTHON_CMD"
            
            # Upgrade pip
            $PYTHON_CMD -m pip install --upgrade pip || print_warning "Failed to upgrade pip"
            
            # Download dependencies
            cd "$backend_dir"
            $PYTHON_CMD -m pip download -r requirements.txt -d ./dependencies || print_warning "Failed to download dependencies for $backend_dir"
            cd - > /dev/null
        else
            print_warning "requirements.txt not found in $backend_dir"
        fi
    done
}

# Function to clean Docker system
clean_docker() {
    print_header "Cleaning Docker System"
    
    print_status "Pruning Docker builder cache..."
    docker builder prune -f
    
    print_status "Removing unused Docker images..."
    docker image prune -f
    
    print_status "Removing unused Docker volumes..."
    docker volume prune -f
    
    print_status "Removing unused Docker networks..."
    docker network prune -f
    
    print_status "Docker system cleanup completed"
}

# Function to build and start services
build_and_start() {
    print_header "Building and Starting YoJa Services"
    
    print_status "Building Docker images..."
    $DOCKER_COMPOSE build --no-cache
    
    print_status "Starting services..."
    $DOCKER_COMPOSE up -d
    
    print_status "Waiting for services to be ready..."
    sleep 30
    
    # Check service health
    check_services_health
}

# Function to check services health
check_services_health() {
    print_header "Checking Services Health"
    
    services=("fastapi-service:8000" "django-service:8001" "db:5432" "redis:6379")
    
    for service in "${services[@]}"; do
        IFS=':' read -r name port <<< "$service"
        print_status "Checking $name on port $port..."
        
        # Wait for service to be ready (with timeout)
        timeout=60
        count=0
        while [ $count -lt $timeout ]; do
            if docker compose ps | grep -q "$name.*Up"; then
                print_status "$name is running"
                break
            fi
            sleep 1
            ((count++))
        done
        
        if [ $count -eq $timeout ]; then
            print_warning "$name may not be ready yet"
        fi
    done
}

# Function to show logs
show_logs() {
    local service=${1:-}
    
    if [ -z "$service" ]; then
        print_status "Showing logs for all services..."
        $DOCKER_COMPOSE logs -f
    else
        print_status "Showing logs for $service..."
        $DOCKER_COMPOSE logs -f "$service"
    fi
}

# Function to stop services
stop_services() {
    print_header "Stopping YoJa Services"
    
    print_status "Stopping all services..."
    $DOCKER_COMPOSE down
    
    print_status "Services stopped"
}

# Function to restart services
restart_services() {
    print_header "Restarting YoJa Services"
    
    stop_services
    sleep 5
    build_and_start
}

# Function to run database migrations
run_migrations() {
    print_header "Running Database Migrations"
    
    print_status "Running Django migrations..."
    $DOCKER_COMPOSE exec django-service python manage.py migrate
    
    print_status "Creating Django superuser (if needed)..."
    $DOCKER_COMPOSE exec django-service python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@yoja.com', 'admin123')
    print('Superuser created: admin/admin123')
else:
    print('Superuser already exists')
"
}

# Function to backup data
backup_data() {
    print_header "Backing Up Data"
    
    backup_dir="backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$backup_dir"
    
    print_status "Backing up main database..."
    $DOCKER_COMPOSE exec db pg_dump -U yoja_user yoja_main > "$backup_dir/yoja_main.sql"
    
    print_status "Backing up analytics database..."
    $DOCKER_COMPOSE exec analytics-db pg_dump -U yoja_user yoja_analytics > "$backup_dir/yoja_analytics.sql"
    
    print_status "Backup completed in $backup_dir"
}

# Function to show service URLs
show_urls() {
    print_header "YoJa Service URLs"
    echo
    echo -e "${GREEN}Frontend:${NC}          http://localhost:3000"
    echo -e "${GREEN}FastAPI Service:${NC}   http://localhost:8000"
    echo -e "${GREEN}Django Service:${NC}    http://localhost:8001"
    echo -e "${GREEN}ML Jupyter:${NC}        http://localhost:8888"
    echo -e "${GREEN}Grafana:${NC}           http://localhost:3001 (admin/admin123)"
    echo -e "${GREEN}Prometheus:${NC}        http://localhost:9090"
    echo -e "${GREEN}MinIO Console:${NC}     http://localhost:9001 (minioadmin/minioadmin123)"
    echo
    echo -e "${GREEN}API Documentation:${NC}"
    echo -e "  FastAPI Docs:     http://localhost:8000/docs"
    echo -e "  Django Admin:     http://localhost:8001/admin"
    echo
}

# Main script logic
main() {
    check_docker
    check_docker_compose
    
    case "${1:-}" in
        "start"|"up")
            prepare_dependencies
            build_and_start
            show_urls
            ;;
        "stop"|"down")
            stop_services
            ;;
        "restart")
            restart_services
            show_urls
            ;;
        "build")
            prepare_dependencies
            clean_docker
            $DOCKER_COMPOSE build --no-cache
            ;;
        "logs")
            show_logs "${2:-}"
            ;;
        "clean")
            stop_services
            clean_docker
            ;;
        "migrate")
            run_migrations
            ;;
        "backup")
            backup_data
            ;;
        "urls")
            show_urls
            ;;
        "status")
            $DOCKER_COMPOSE ps
            ;;
        "shell")
            service=${2:-django-service}
            print_status "Opening shell in $service..."
            $DOCKER_COMPOSE exec "$service" /bin/bash
            ;;
        *)
            echo "YoJa Docker Management Script"
            echo
            echo "Usage: $0 [COMMAND] [OPTIONS]"
            echo
            echo "Commands:"
            echo "  start, up     - Build and start all services"
            echo "  stop, down    - Stop all services"
            echo "  restart       - Restart all services"
            echo "  build         - Build Docker images"
            echo "  logs [service]- Show logs (all or specific service)"
            echo "  clean         - Clean Docker system"
            echo "  migrate       - Run database migrations"
            echo "  backup        - Backup databases"
            echo "  urls          - Show service URLs"
            echo "  status        - Show service status"
            echo "  shell [service] - Open shell in service"
            echo
            echo "Examples:"
            echo "  $0 start                 # Start all services"
            echo "  $0 logs fastapi-service  # Show FastAPI logs"
            echo "  $0 shell django-service  # Open Django shell"
            echo
            ;;
    esac
}

# Run main function with all arguments
main "$@"
