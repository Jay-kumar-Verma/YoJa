# YoJa Project Integration Setup Script (PowerShell)
# This script ensures all services are properly integrated and can communicate

Write-Host "YoJa Integration Setup Starting..." -ForegroundColor Blue

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARN] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Write-Header {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Cyan
}

# Check if Docker is installed
function Test-Docker {
    Write-Header "Checking Docker Installation..."
    
    try {
        $dockerVersion = docker --version
        Write-Status "Docker is installed: $dockerVersion"
    }
    catch {
        Write-Error "Docker is not installed. Please install Docker Desktop first."
        exit 1
    }
    
    try {
        $composeVersion = docker-compose --version
        Write-Status "Docker Compose is installed: $composeVersion"
    }
    catch {
        try {
            $composeVersion = docker compose version
            Write-Status "Docker Compose (plugin) is available: $composeVersion"
        }
        catch {
            Write-Error "Docker Compose is not available. Please install Docker Compose."
            exit 1
        }
    }
}

# Validate docker-compose.yml
function Test-ComposeConfig {
    Write-Header "Validating Docker Compose Configuration..."
    
    if (Test-Path "docker-compose.yml") {
        Write-Status "docker-compose.yml found"
        
        try {
            docker-compose config --quiet 2>$null
            Write-Status "Docker Compose configuration is valid"
        }
        catch {
            try {
                docker compose config --quiet 2>$null
                Write-Status "Docker Compose configuration is valid"
            }
            catch {
                Write-Warning "Docker Compose configuration validation failed, but continuing..."
            }
        }
    }
    else {
        Write-Error "docker-compose.yml not found in current directory"
        exit 1
    }
}

# Setup environment configuration
function Initialize-Environment {
    Write-Header "Setting up Environment Configuration..."
    
    if (-not (Test-Path ".env")) {
        Write-Status "Creating .env file with default values..."
        
        $envContent = @"
# Database Configuration
POSTGRES_USER=adminYoja
POSTGRES_PASSWORD=Yoja`$#@98342
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
"@
        
        $envContent | Out-File -FilePath ".env" -Encoding UTF8
        Write-Status ".env file created successfully"
    }
    else {
        Write-Status ".env file already exists"
    }
}

# Create necessary directories
function New-RequiredDirectories {
    Write-Header "Creating Required Directories..."
    
    $directories = @(
        "backend\fastapi_service",
        "backend\django_service",
        "machine_learning\models",
        "machine_learning\data",
        "machine_learning\logs",
        "database\backups",
        "frontend\src\services",
        "nginx\conf.d",
        "ssl",
        "monitoring",
        "logs"
    )
    
    foreach ($dir in $directories) {
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
            Write-Status "Created directory: $dir"
        }
        else {
            Write-Status "Directory exists: $dir"
        }
    }
}

# Create requirements files
function New-RequirementsFiles {
    Write-Header "Setting up Requirements Files..."
    
    # FastAPI requirements
    if (-not (Test-Path "backend\fastapi_service\requirements.txt")) {
        $fastapiReqs = @"
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
Pillow==10.1.0
requests==2.31.0
websockets==12.0
"@
        $fastapiReqs | Out-File -FilePath "backend\fastapi_service\requirements.txt" -Encoding UTF8
        Write-Status "Created FastAPI requirements.txt"
    }
    
    # Django requirements
    if (-not (Test-Path "backend\django_service\requirements.txt")) {
        $djangoReqs = @"
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
"@
        $djangoReqs | Out-File -FilePath "backend\django_service\requirements.txt" -Encoding UTF8
        Write-Status "Created Django requirements.txt"
    }
    
    # ML requirements
    if (-not (Test-Path "machine_learning\requirements.txt")) {
        $mlReqs = @"
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
"@
        $mlReqs | Out-File -FilePath "machine_learning\requirements.txt" -Encoding UTF8
        Write-Status "Created ML requirements.txt"
    }
    
    # Frontend package.json
    if (-not (Test-Path "frontend\package.json")) {
        $packageJson = @"
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
"@
        $packageJson | Out-File -FilePath "frontend\package.json" -Encoding UTF8
        Write-Status "Created frontend package.json"
    }
}

# Create management scripts
function New-ManagementScripts {
    Write-Header "Creating Service Management Scripts..."
    
    # Start script
    $startScript = @"
# YoJa Services Start Script
Write-Host "Starting YoJa Services..." -ForegroundColor Blue

# Check if Docker is running
try {
    docker info | Out-Null
}
catch {
    Write-Host "Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Build and start services
Write-Host "Building and starting services..." -ForegroundColor Yellow
try {
    docker-compose up -d --build
}
catch {
    try {
        docker compose up -d --build
    }
    catch {
        Write-Host "Docker Compose not found" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

Write-Host "YoJa services are starting up!" -ForegroundColor Green
Write-Host "Access the application at: http://localhost:3000" -ForegroundColor Cyan
"@
    
    $startScript | Out-File -FilePath "start.ps1" -Encoding UTF8
    Write-Status "Created start.ps1 script"
    
    # Stop script
    $stopScript = @"
# YoJa Services Stop Script
Write-Host "Stopping YoJa Services..." -ForegroundColor Yellow

try {
    docker-compose down
}
catch {
    try {
        docker compose down
    }
    catch {
        Write-Host "Docker Compose not found" -ForegroundColor Red
        exit 1
    }
}

Write-Host "YoJa services stopped" -ForegroundColor Green
"@
    
    $stopScript | Out-File -FilePath "stop.ps1" -Encoding UTF8
    Write-Status "Created stop.ps1 script"
    
    # Health check script
    $healthScript = @"
# YoJa Services Health Check Script
Write-Host "YoJa Services Health Check" -ForegroundColor Blue
Write-Host "================================" -ForegroundColor Blue

function Test-Service {
    param(
        [string]`$ServiceName,
        [string]`$Url,
        [int]`$ExpectedStatus = 200
    )
    
    Write-Host "Checking `$ServiceName... " -NoNewline
    
    try {
        `$response = Invoke-WebRequest -Uri `$Url -Method GET -TimeoutSec 5 -UseBasicParsing
        if (`$response.StatusCode -eq `$ExpectedStatus) {
            Write-Host "Healthy" -ForegroundColor Green
            return `$true
        }
        else {
            Write-Host "Unhealthy (Status: `$(`$response.StatusCode))" -ForegroundColor Red
            return `$false
        }
    }
    catch {
        Write-Host "Unhealthy (Error: `$(`$_.Exception.Message))" -ForegroundColor Red
        return `$false
    }
}

# Check all services
`$services = @(
    @{Name="Frontend"; Url="http://localhost:3000"},
    @{Name="FastAPI"; Url="http://localhost:8000/health"},
    @{Name="Django"; Url="http://localhost:8001/health/"},
    @{Name="ML Service"; Url="http://localhost:8889/health"},
    @{Name="Grafana"; Url="http://localhost:3001"},
    @{Name="Jupyter"; Url="http://localhost:8888"}
)

`$healthyCount = 0
`$totalCount = `$services.Count

foreach (`$service in `$services) {
    if (Test-Service -ServiceName `$service.Name -Url `$service.Url) {
        `$healthyCount++
    }
}

Write-Host "================================" -ForegroundColor Blue
Write-Host "Health Summary: `$healthyCount/`$totalCount services healthy"

if (`$healthyCount -eq `$totalCount) {
    Write-Host "All services are healthy!" -ForegroundColor Green
    exit 0
}
else {
    Write-Host "Some services are unhealthy. Check the logs." -ForegroundColor Yellow
    exit 1
}
"@
    
    $healthScript | Out-File -FilePath "healthcheck.ps1" -Encoding UTF8
    Write-Status "Created healthcheck.ps1 script"
}

# Main execution
function Main {
    Write-Header "YoJa Project Integration Setup"
    Write-Host "This script will set up the YoJa project for easy integration between all services." -ForegroundColor White
    Write-Host ""
    
    Test-Docker
    Test-ComposeConfig
    Initialize-Environment
    New-RequiredDirectories
    New-RequirementsFiles
    New-ManagementScripts
    
    Write-Header "Integration Setup Complete!"
    Write-Host ""
    Write-Status "Next steps:"
    Write-Host "  1. Run '.\start.ps1' to start all services"
    Write-Host "  2. Run '.\healthcheck.ps1' to verify all services are healthy"
    Write-Host "  3. Access the application at http://localhost:3000"
    Write-Host "  4. Use 'docker-compose logs -f [service-name]' to view logs"
    Write-Host "  5. Run '.\stop.ps1' to stop all services"
    Write-Host ""
    Write-Status "Service URLs:"
    Write-Host "  • Frontend:        http://localhost:3000"
    Write-Host "  • FastAPI:         http://localhost:8000"
    Write-Host "  • Django:          http://localhost:8001"
    Write-Host "  • ML Service:      http://localhost:8889"
    Write-Host "  • Jupyter:         http://localhost:8888"
    Write-Host "  • Grafana:         http://localhost:3001"
    Write-Host "  • PostgreSQL:      localhost:5432"
    Write-Host "  • Redis:           localhost:6379"
    Write-Host ""
    Write-Status "Your YoJa project is ready for integrated development!"
}

# Run main function
Main
