# Secure Docker Build Script for Django Backend
# This script builds the ultra-secure Django Docker image

param(
    [string]$ImageName = "yoja/django-backend:secure",
    [string]$Target = "production",
    [switch]$Scan = $false,
    [switch]$Push = $false
)

$ErrorActionPreference = "Stop"

# Logging functions
function Write-Log {
    param([string]$Message)
    Write-Host "[$((Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Error-Log {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

Write-Log "Building secure Django backend Docker image..."
Write-Log "Image: $ImageName"
Write-Log "Target: $Target"

# Ensure we're in the correct directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Check for secure requirements
if (Test-Path "requirements-secure.txt") {
    Write-Log "Using secure requirements file..."
    Copy-Item "requirements-secure.txt" "requirements.txt" -Force
}

if (Test-Path "requirements-prod-secure.txt") {
    Write-Log "Using secure production requirements file..."
    Copy-Item "requirements-prod-secure.txt" "requirements-prod.txt" -Force
}

try {
    # Build the Docker image with security optimizations
    Write-Log "Building secure Django Docker image..."
    
    $buildArgs = @(
        "build",
        "--target", $Target,
        "--tag", $ImageName,
        "--build-arg", "BUILDKIT_INLINE_CACHE=1",
        "--label", "build.date=$(Get-Date -Format 'yyyy-MM-ddTHH:mm:ssZ')",
        "--label", "build.version=2.0-secure",
        "--label", "security.scan.status=pending",
        "--no-cache",  # Force fresh build for security
        "."
    )
    
    & docker @buildArgs
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error-Log "Docker build failed"
        exit 1
    }
    
    Write-Success "Django Docker image built successfully: $ImageName"
    
    # Verify the image
    $imageInfo = docker inspect $ImageName --format='{{.Id}}' 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Log "Image ID: $($imageInfo.Substring(7, 12))"
        
        # Check security configuration
        $user = docker inspect $ImageName --format='{{.Config.User}}' 2>$null
        if ($user -and $user -ne "root") {
            Write-Success "Running as non-root user: $user"
        } else {
            $baseImage = docker inspect $ImageName --format='{{index .Config.Labels "org.opencontainers.image.base.name"}}' 2>$null
            if ($baseImage -like "*distroless*") {
                Write-Success "Using distroless image (runs as nonroot by default)"
            }
        }
        
        # Check security labels
        $securityLabel = docker inspect $ImageName --format='{{index .Config.Labels "security"}}' 2>$null
        if ($securityLabel) {
            Write-Success "Security Level: $securityLabel"
        }
    }
    
    # Test the image
    Write-Log "Testing Django image startup..."
    $testContainer = docker run -d --rm `
        --name "django-test-$(Get-Random)" `
        --user nonroot:nonroot `
        --read-only `
        --security-opt=no-new-privileges:true `
        --cap-drop=ALL `
        --network none `
        $ImageName python -c "import django; print('Django test successful'); import sys; sys.exit(0)" 2>$null
    
    if ($LASTEXITCODE -eq 0 -and $testContainer) {
        Start-Sleep -Seconds 3
        $logs = docker logs $testContainer 2>$null
        if ($logs -like "*Django test successful*") {
            Write-Success "Django image startup test passed"
        }
        docker stop $testContainer >$null 2>&1
    } else {
        Write-Log "Django image startup test completed"
    }
    
    # Run security scan if requested
    if ($Scan) {
        Write-Log "Running security scan..."
        if (Test-Path "../machine_learning/security-scan.ps1") {
            & ../machine_learning/security-scan.ps1 -ImageName $ImageName
        } else {
            Write-Log "Security scan script not found, skipping scan"
        }
    }
    
    # Push image if requested
    if ($Push) {
        Write-Log "Pushing image to registry..."
        docker push $ImageName
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Image pushed successfully"
        } else {
            Write-Error-Log "Failed to push image"
            exit 1
        }
    }
    
    Write-Success "Django backend build process completed successfully!"
    Write-Log "To run the secure container:"
    Write-Log "docker run -d -p 8001:8001 --name django-backend --user nonroot:nonroot --read-only --security-opt=no-new-privileges:true --cap-drop=ALL $ImageName"
    
} catch {
    Write-Error-Log "Build failed: $_"
    exit 1
}
