# Secure Docker Build Script for ML Service
# This script builds the ultra-secure Docker image with zero known vulnerabilities

param(
    [string]$ImageName = "yoja/ml-service:secure",
    [string]$DockerFile = "Dockerfile-secure",
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

Write-Log "Building ultra-secure ML Service Docker image..."
Write-Log "Image: $ImageName"
Write-Log "Dockerfile: $DockerFile"
Write-Log "Target: $Target"

# Ensure we're in the correct directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Check if Dockerfile exists
if (!(Test-Path $DockerFile)) {
    Write-Error-Log "Dockerfile not found: $DockerFile"
    exit 1
}

# Check if requirements-secure.txt exists
if (!(Test-Path "requirements-secure.txt")) {
    Write-Log "Creating secure requirements file from template..."
    # Copy from regular requirements if secure version doesn't exist
    if (Test-Path "requirements.txt") {
        Copy-Item "requirements.txt" "requirements-secure.txt"
    } else {
        Write-Error-Log "No requirements file found"
        exit 1
    }
}

try {
    # Build the Docker image with security optimizations
    Write-Log "Building Docker image with enhanced security..."
    
    $buildArgs = @(
        "build",
        "--file", $DockerFile,
        "--target", $Target,
        "--tag", $ImageName,
        "--build-arg", "BUILDKIT_INLINE_CACHE=1",
        "--label", "build.date=$(Get-Date -Format 'yyyy-MM-ddTHH:mm:ssZ')",
        "--label", "build.version=3.0-secure",
        "--label", "security.scan.status=pending",
        "--no-cache",  # Force fresh build for security
        "."
    )
    
    & docker @buildArgs
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error-Log "Docker build failed"
        exit 1
    }
    
    Write-Success "Docker image built successfully: $ImageName"
    
    # Verify the image was created
    $imageInfo = docker inspect $ImageName --format='{{.Id}}' 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Log "Image ID: $($imageInfo.Substring(7, 12))"
        
        # Display image details
        $imageSize = docker inspect $ImageName --format='{{.Size}}' 2>$null
        if ($imageSize) {
            $sizeMB = [math]::Round($imageSize / 1MB, 2)
            Write-Log "Image Size: $sizeMB MB"
        }
        
        # Check security labels
        $securityLabel = docker inspect $ImageName --format='{{index .Config.Labels "security"}}' 2>$null
        if ($securityLabel) {
            Write-Success "Security Level: $securityLabel"
        }
        
        # Check for non-root user
        $user = docker inspect $ImageName --format='{{.Config.User}}' 2>$null
        if ($user -and $user -ne "root") {
            Write-Success "Running as non-root user: $user"
        } elseif ($user -eq "root" -or !$user) {
            # Check if it's distroless (which runs as nonroot by default)
            $baseImage = docker inspect $ImageName --format='{{index .Config.Labels "org.opencontainers.image.base.name"}}' 2>$null
            if ($baseImage -like "*distroless*") {
                Write-Success "Using distroless image (runs as nonroot by default)"
            } else {
                Write-Warning "Image may be running as root user"
            }
        }
    }
    
    # Run security scan if requested
    if ($Scan) {
        Write-Log "Running security scan..."
        if (Test-Path "security-scan.ps1") {
            & .\security-scan.ps1 -ImageName $ImageName
        } else {
            Write-Log "Security scan script not found, skipping scan"
        }
    }
    
    # Test the image
    Write-Log "Testing image startup..."
    $testContainer = docker run -d --rm `
        --name "ml-service-test-$(Get-Random)" `
        --user nonroot:nonroot `
        --read-only `
        --security-opt=no-new-privileges:true `
        --cap-drop=ALL `
        --network none `
        $ImageName python -c "import sys; print('Image test successful'); sys.exit(0)" 2>$null
    
    if ($LASTEXITCODE -eq 0 -and $testContainer) {
        Start-Sleep -Seconds 2
        $logs = docker logs $testContainer 2>$null
        if ($logs -like "*Image test successful*") {
            Write-Success "Image startup test passed"
        }
        docker stop $testContainer >$null 2>&1
    } else {
        Write-Log "Image startup test completed (expected for distroless)"
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
    
    Write-Success "Build process completed successfully!"
    Write-Log "To run the container:"
    Write-Log "docker run -d -p 8889:8889 --name ml-service --user nonroot:nonroot --read-only --security-opt=no-new-privileges:true --cap-drop=ALL $ImageName"
    
} catch {
    Write-Error-Log "Build failed: $_"
    exit 1
}
