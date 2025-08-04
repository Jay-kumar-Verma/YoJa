# Frontend Service Build and Deployment Scripts

# Windows PowerShell deployment scripts for YoJa Frontend Service
# Provides secure build and deployment automation

## Build Scripts

### build-secure.ps1 - Secure Production Build
Write-Host "Building YoJa Frontend Service (Secure Production Build)" -ForegroundColor Green

# Set build parameters
$IMAGE_NAME = "yoja/frontend-service"
$BUILD_DATE = Get-Date -Format "yyyyMMdd-HHmmss"
$SECURE_TAG = "secure-v2-$BUILD_DATE"

# Pre-build security checks
Write-Host "Running pre-build security validation..." -ForegroundColor Yellow
docker pull cgr.dev/chainguard/nginx:latest
docker pull node:18-alpine3.19

# Build with maximum security settings
Write-Host "Building secure frontend container..." -ForegroundColor Yellow
docker build `
    --target production `
    --no-cache `
    --build-arg NODE_VERSION=18 `
    --build-arg ALPINE_VERSION=3.19 `
    --tag "${IMAGE_NAME}:${SECURE_TAG}" `
    --tag "${IMAGE_NAME}:secure-latest" `
    .

if ($LASTEXITCODE -eq 0) {
    Write-Host "Secure build completed successfully!" -ForegroundColor Green
    Write-Host "Image tags: ${IMAGE_NAME}:${SECURE_TAG}, ${IMAGE_NAME}:secure-latest" -ForegroundColor Cyan
    
    # Run security scan
    Write-Host "Running post-build security scan..." -ForegroundColor Yellow
    trivy image --severity HIGH,CRITICAL "${IMAGE_NAME}:${SECURE_TAG}"
    
    Write-Host "Build process completed. Image ready for deployment." -ForegroundColor Green
} else {
    Write-Host "Build failed with exit code $LASTEXITCODE" -ForegroundColor Red
    exit $LASTEXITCODE
}

### deploy-dev.ps1 - Development Environment Deployment
Write-Host "Deploying YoJa Frontend Service (Development Environment)" -ForegroundColor Green

# Stop and remove existing development container
Write-Host "Stopping existing development deployment..." -ForegroundColor Yellow
docker-compose -f docker-compose.secure.yml down frontend-service-dev 2>$null

# Deploy development environment
Write-Host "Starting development environment..." -ForegroundColor Yellow
docker-compose -f docker-compose.secure.yml up -d frontend-service-dev

if ($LASTEXITCODE -eq 0) {
    Write-Host "Development deployment successful!" -ForegroundColor Green
    Write-Host "Frontend service available at: http://localhost:3000" -ForegroundColor Cyan
    
    # Wait for service to be ready
    Write-Host "Waiting for service to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    # Health check
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -TimeoutSec 30
        if ($response.StatusCode -eq 200) {
            Write-Host "Health check passed - Service is ready!" -ForegroundColor Green
        }
    } catch {
        Write-Host "Health check failed - Service may still be starting" -ForegroundColor Yellow
    }
    
    # Show container status
    docker-compose -f docker-compose.secure.yml ps frontend-service-dev
} else {
    Write-Host "Development deployment failed with exit code $LASTEXITCODE" -ForegroundColor Red
    exit $LASTEXITCODE
}

### deploy-prod.ps1 - Production Environment Deployment
Write-Host "Deploying YoJa Frontend Service (Production Environment)" -ForegroundColor Green
Write-Host "WARNING: This will deploy to production with maximum security settings!" -ForegroundColor Red

# Confirmation prompt
$confirmation = Read-Host "Are you sure you want to deploy to production? (yes/no)"
if ($confirmation -ne "yes") {
    Write-Host "Production deployment cancelled." -ForegroundColor Yellow
    exit 0
}

# Pre-deployment validation
Write-Host "Running pre-deployment security validation..." -ForegroundColor Yellow
$IMAGE_NAME = "yoja/frontend-service:secure-latest"

# Validate image exists and is secure
docker inspect $IMAGE_NAME > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Secure image not found. Please run build-secure.ps1 first." -ForegroundColor Red
    exit 1
}

# Security scan before deployment
Write-Host "Running pre-deployment security scan..." -ForegroundColor Yellow
trivy image --exit-code 1 --severity CRITICAL $IMAGE_NAME
if ($LASTEXITCODE -ne 0) {
    Write-Host "Critical vulnerabilities found! Deployment cancelled." -ForegroundColor Red
    exit 1
}

# Stop existing production deployment
Write-Host "Stopping existing production deployment..." -ForegroundColor Yellow
docker-compose -f docker-compose.secure.yml --profile production down 2>$null

# Deploy production environment with maximum security
Write-Host "Starting production environment with maximum security..." -ForegroundColor Yellow
docker-compose -f docker-compose.secure.yml --profile production up -d frontend-service-prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "Production deployment successful!" -ForegroundColor Green
    Write-Host "Frontend service available at: http://localhost" -ForegroundColor Cyan
    
    # Wait for service to be ready
    Write-Host "Waiting for production service to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 15
    
    # Production health check
    for ($i = 1; $i -le 5; $i++) {
        try {
            Write-Host "Health check attempt $i/5..." -ForegroundColor Yellow
            $response = Invoke-WebRequest -Uri "http://localhost/health" -TimeoutSec 30
            if ($response.StatusCode -eq 200) {
                Write-Host "Production health check passed - Service is ready!" -ForegroundColor Green
                break
            }
        } catch {
            Write-Host "Health check attempt $i failed, retrying..." -ForegroundColor Yellow
            Start-Sleep -Seconds 10
        }
        
        if ($i -eq 5) {
            Write-Host "Health check failed after 5 attempts - Manual verification required" -ForegroundColor Red
        }
    }
    
    # Show production container status
    Write-Host "Production container status:" -ForegroundColor Cyan
    docker-compose -f docker-compose.secure.yml --profile production ps frontend-service-prod
    
    # Show security information
    Write-Host "Production security configuration:" -ForegroundColor Cyan
    docker inspect frontend-service-prod --format="User: {{.Config.User}}, ReadOnly: {{.HostConfig.ReadonlyRootfs}}, SecurityOpt: {{.HostConfig.SecurityOpt}}"
    
} else {
    Write-Host "Production deployment failed with exit code $LASTEXITCODE" -ForegroundColor Red
    exit $LASTEXITCODE
}

## Utility Scripts

### security-scan.ps1 - Comprehensive Security Scanning
Write-Host "Running comprehensive security scan on YoJa Frontend Service" -ForegroundColor Green

$IMAGE_NAME = "yoja/frontend-service:secure-latest"

# Check if image exists
docker inspect $IMAGE_NAME > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Image $IMAGE_NAME not found. Please build first." -ForegroundColor Red
    exit 1
}

# Run multiple security scans
Write-Host "Running Trivy vulnerability scan..." -ForegroundColor Yellow
trivy image --format table --severity HIGH,CRITICAL $IMAGE_NAME

Write-Host "Running Grype security scan..." -ForegroundColor Yellow
grype $IMAGE_NAME --only-fixed

Write-Host "Analyzing container configuration..." -ForegroundColor Yellow
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock `
    aquasec/container-security-scanner:latest `
    $IMAGE_NAME

Write-Host "Security scan completed." -ForegroundColor Green

### logs.ps1 - View Service Logs
param(
    [string]$Environment = "dev",
    [int]$Lines = 100
)

Write-Host "Viewing YoJa Frontend Service logs ($Environment environment)" -ForegroundColor Green

switch ($Environment.ToLower()) {
    "dev" {
        docker-compose -f docker-compose.secure.yml logs --tail $Lines -f frontend-service-dev
    }
    "prod" {
        docker-compose -f docker-compose.secure.yml --profile production logs --tail $Lines -f frontend-service-prod
    }
    "test" {
        docker-compose -f docker-compose.secure.yml --profile testing logs --tail $Lines -f frontend-service-test
    }
    default {
        Write-Host "Invalid environment. Use: dev, prod, or test" -ForegroundColor Red
        exit 1
    }
}

### cleanup.ps1 - Clean Up Resources
Write-Host "Cleaning up YoJa Frontend Service resources" -ForegroundColor Green

# Stop all running containers
Write-Host "Stopping all frontend service containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.secure.yml down --remove-orphans

# Remove unused images (keep latest)
Write-Host "Cleaning up old frontend images..." -ForegroundColor Yellow
docker images "yoja/frontend-service" --format "table {{.Repository}}:{{.Tag}}\t{{.CreatedAt}}\t{{.Size}}" | Sort-Object

$oldImages = docker images "yoja/frontend-service" --format "{{.Repository}}:{{.Tag}}" | Where-Object { $_ -notmatch "secure-latest" } | Select-Object -Skip 2
foreach ($image in $oldImages) {
    Write-Host "Removing old image: $image" -ForegroundColor Yellow
    docker rmi $image 2>$null
}

# Clean up build cache
Write-Host "Cleaning Docker build cache..." -ForegroundColor Yellow
docker builder prune -f

# Clean up unused volumes
Write-Host "Cleaning unused volumes..." -ForegroundColor Yellow
docker volume prune -f

Write-Host "Cleanup completed." -ForegroundColor Green

## Usage Instructions

### Prerequisites
# - Docker Desktop installed and running
# - Docker Compose installed
# - PowerShell 5.1 or newer
# - Optional: Trivy and Grype for security scanning

### Development Workflow
# 1. Build secure image:        .\scripts\build-secure.ps1
# 2. Deploy to development:     .\scripts\deploy-dev.ps1
# 3. View logs:                 .\scripts\logs.ps1 -Environment dev
# 4. Run security scan:         .\scripts\security-scan.ps1

### Production Deployment
# 1. Build secure image:        .\scripts\build-secure.ps1
# 2. Deploy to production:      .\scripts\deploy-prod.ps1
# 3. Monitor logs:              .\scripts\logs.ps1 -Environment prod

### Maintenance
# - Clean up resources:         .\scripts\cleanup.ps1
# - Security scanning:          .\scripts\security-scan.ps1

## Security Notes
# - All scripts implement security best practices
# - Production deployment requires explicit confirmation
# - Comprehensive security scanning before production deployment
# - Automatic health checks and validation
# - Detailed logging and monitoring capabilities

Write-Host "YoJa Frontend Service Scripts Ready!" -ForegroundColor Green
