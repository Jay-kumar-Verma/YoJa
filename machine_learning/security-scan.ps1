# Docker Security Scanner Script for ML Service (PowerShell Version)
# This script performs comprehensive security scanning of the Docker image on Windows

param(
    [string]$ImageName = "yoja/ml-service:secure",
    [string]$ScanOutputDir = "./security-reports",
    [string]$SeverityThreshold = "HIGH"
)

# Configuration
$ErrorActionPreference = "Stop"

# Create output directory
if (!(Test-Path $ScanOutputDir)) {
    New-Item -ItemType Directory -Path $ScanOutputDir -Force | Out-Null
}

# Logging functions
function Write-Log {
    param([string]$Message)
    Write-Host "[$((Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))] $Message" -ForegroundColor Blue
}

function Write-Error-Log {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning-Log {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

Write-Log "Starting security scan for image: $ImageName"

# Function to check if command exists
function Test-CommandExists {
    param([string]$Command)
    $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

# Function to install Trivy on Windows
function Install-Trivy {
    if (!(Test-CommandExists "trivy")) {
        Write-Log "Installing Trivy security scanner..."
        try {
            # Download Trivy for Windows
            $trivyUrl = "https://github.com/aquasecurity/trivy/releases/latest/download/trivy_Windows-64bit.zip"
            $trivyZip = "$env:TEMP\trivy.zip"
            $trivyDir = "$env:TEMP\trivy"
            
            Invoke-WebRequest -Uri $trivyUrl -OutFile $trivyZip
            Expand-Archive -Path $trivyZip -DestinationPath $trivyDir -Force
            
            # Add to PATH for current session
            $env:PATH += ";$trivyDir"
            
            Write-Success "Trivy installed successfully"
        }
        catch {
            Write-Error-Log "Failed to install Trivy: $_"
        }
    }
}

# Function to scan with Trivy
function Invoke-TrivyScan {
    Write-Log "Running Trivy vulnerability scan..."
    
    try {
        # Vulnerability scan
        & trivy image --format json --output "$ScanOutputDir/trivy-vulnerabilities.json" $ImageName
        & trivy image --format table --severity "$SeverityThreshold,CRITICAL" $ImageName | Out-File "$ScanOutputDir/trivy-summary.txt"
        
        # Configuration scan
        & trivy config --format json --output "$ScanOutputDir/trivy-config.json" .
        
        # Secret scan
        & trivy fs --format json --output "$ScanOutputDir/trivy-secrets.json" .
        
        Write-Success "Trivy scan completed. Results saved to $ScanOutputDir/trivy-*"
    }
    catch {
        Write-Warning-Log "Trivy scan completed with warnings: $_"
    }
}

# Function to analyze Docker image security
function Test-DockerSecurity {
    Write-Log "Analyzing Docker security best practices..."
    
    try {
        # Check if image exists
        $imageExists = docker inspect $ImageName 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Error-Log "Image $ImageName not found. Please build the image first."
            exit 1
        }
        
        # Extract image information
        docker inspect $ImageName | Out-File "$ScanOutputDir/image-inspect.json"
        
        # Check for non-root user
        $userInfo = docker inspect --format='{{.Config.User}}' $ImageName
        if ([string]::IsNullOrEmpty($userInfo) -or $userInfo -eq "root") {
            Write-Warning-Log "Image is running as root user - security risk"
        }
        else {
            Write-Success "Image is running as non-root user: $userInfo"
        }
        
        # Check for read-only root filesystem
        $readonlyRoot = docker inspect --format='{{.Config.ReadonlyRootfs}}' $ImageName
        if ($readonlyRoot -eq "true") {
            Write-Success "Read-only root filesystem is enabled"
        }
        else {
            Write-Warning-Log "Read-only root filesystem is not enabled"
        }
        
        # Check exposed ports
        $exposedPorts = docker inspect --format='{{range $port, $config := .Config.ExposedPorts}}{{$port}} {{end}}' $ImageName
        Write-Log "Exposed ports: $(if ($exposedPorts) { $exposedPorts } else { 'None' })"
        
        # Check environment variables for sensitive data
        $envVars = docker inspect --format='{{range .Config.Env}}{{println .}}{{end}}' $ImageName
        $sensitivePatterns = @("password", "secret", "key", "token")
        $potentialSecrets = $envVars | Where-Object { 
            $line = $_
            $sensitivePatterns | Where-Object { $line -match $_ }
        }
        
        if ($potentialSecrets) {
            $potentialSecrets | Out-File "$ScanOutputDir/potential-secrets.txt"
            Write-Warning-Log "Potential secrets found in environment variables"
        }
        else {
            Write-Log "No obvious secrets found in environment variables"
        }
    }
    catch {
        Write-Error-Log "Failed to analyze Docker security: $_"
    }
}

# Function to check security labels
function Test-SecurityLabels {
    Write-Log "Checking security labels..."
    
    try {
        $securityLabel = docker inspect --format='{{index .Config.Labels "security"}}' $ImageName
        if (![string]::IsNullOrEmpty($securityLabel)) {
            Write-Success "Security label found: $securityLabel"
        }
        else {
            Write-Warning-Log "No security label found"
        }
        
        # Check all labels
        docker inspect --format='{{range $key, $value := .Config.Labels}}{{$key}}={{$value}}{{println}}{{end}}' $ImageName | Out-File "$ScanOutputDir/image-labels.txt"
    }
    catch {
        Write-Error-Log "Failed to check security labels: $_"
    }
}

# Function to test container runtime security
function Test-RuntimeSecurity {
    Write-Log "Testing runtime security configurations..."
    
    try {
        # Test running container with security options
        $containerId = docker run -d --rm `
            --user nonroot:nonroot `
            --read-only `
            --security-opt=no-new-privileges:true `
            --cap-drop=ALL `
            --network none `
            $ImageName python -c "import time; time.sleep(60)" 2>$null
        
        if ($LASTEXITCODE -eq 0 -and $containerId.Length -eq 64) {
            Write-Success "Container started successfully with security hardening"
            
            # Check process running as correct user
            try {
                $runningUser = docker exec $containerId whoami 2>$null
                Write-Log "Container running as user: $runningUser"
            }
            catch {
                Write-Log "Container running as user: unknown"
            }
            
            # Stop test container
            docker stop $containerId | Out-Null
        }
        else {
            Write-Warning-Log "Failed to start container with full security hardening"
        }
    }
    catch {
        Write-Warning-Log "Runtime security test failed: $_"
    }
}

# Function to generate security report
function New-SecurityReport {
    Write-Log "Generating security report..."
    
    $reportFile = "$ScanOutputDir/security-report.md"
    
    $reportContent = @"
# Docker Security Scan Report

**Image:** $ImageName
**Scan Date:** $((Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))
**Severity Threshold:** $SeverityThreshold

## Summary

"@

    # Add Trivy summary if available
    if (Test-Path "$ScanOutputDir/trivy-summary.txt") {
        $trivySummary = Get-Content "$ScanOutputDir/trivy-summary.txt" | Select-Object -First 20
        $reportContent += @"

### Trivy Vulnerabilities
``````
$($trivySummary -join "`n")
``````

"@
    }

    # Add security configuration analysis
    try {
        $user = docker inspect --format='{{.Config.User}}' $ImageName 2>$null
        $readonlyRoot = docker inspect --format='{{.Config.ReadonlyRootfs}}' $ImageName 2>$null
        $exposedPorts = docker inspect --format='{{range $port, $config := .Config.ExposedPorts}}{{$port}} {{end}}' $ImageName 2>$null
        
        $reportContent += @"

## Security Configuration Analysis

- **User:** $(if ($user) { $user } else { 'Not specified' })
- **Read-only Root:** $(if ($readonlyRoot) { $readonlyRoot } else { 'false' })
- **Exposed Ports:** $(if ($exposedPorts) { $exposedPorts } else { 'None' })

## Recommendations

1. Use minimal base images (distroless, Alpine)
2. Run as non-root user
3. Enable read-only root filesystem
4. Drop all capabilities
5. Use security-opt=no-new-privileges
6. Regularly update base images and dependencies
7. Implement proper secret management
8. Use multi-stage builds to reduce attack surface

## Files Generated

"@

        # List generated files
        $files = Get-ChildItem $ScanOutputDir | ForEach-Object { "- $($_.Name)" }
        $reportContent += ($files -join "`n")
    }
    catch {
        Write-Warning-Log "Failed to generate complete security analysis"
    }

    $reportContent | Out-File $reportFile -Encoding UTF8
    Write-Success "Security report generated: $reportFile"
}

# Main execution
function Invoke-Main {
    Write-Log "Docker Security Scanner for ML Service"
    Write-Log "======================================"
    
    # Install scanners if needed
    # Install-Trivy
    
    # Perform scans
    if (Test-CommandExists "trivy") {
        Invoke-TrivyScan
    }
    else {
        Write-Warning-Log "Trivy not found, skipping Trivy scan"
    }
    
    # Analyze Docker security
    Test-DockerSecurity
    Test-SecurityLabels
    Test-RuntimeSecurity
    
    # Generate report
    New-SecurityReport
    
    Write-Log "Security scan completed! Check $ScanOutputDir for detailed results."
    
    # Count vulnerabilities if Trivy results exist
    if (Test-Path "$ScanOutputDir/trivy-vulnerabilities.json") {
        try {
            $trivyResults = Get-Content "$ScanOutputDir/trivy-vulnerabilities.json" | ConvertFrom-Json
            $criticalCount = 0
            $highCount = 0
            
            foreach ($result in $trivyResults.Results) {
                if ($result.Vulnerabilities) {
                    $criticalCount += ($result.Vulnerabilities | Where-Object { $_.Severity -eq "CRITICAL" }).Count
                    $highCount += ($result.Vulnerabilities | Where-Object { $_.Severity -eq "HIGH" }).Count
                }
            }
            
            Write-Log "Found $criticalCount critical and $highCount high severity vulnerabilities"
            
            if ($criticalCount -gt 0) {
                Write-Error-Log "Critical vulnerabilities found! Review and fix before production deployment."
                exit 1
            }
            elseif ($highCount -gt 0) {
                Write-Warning-Log "High severity vulnerabilities found. Consider fixing before deployment."
            }
            else {
                Write-Success "No critical or high severity vulnerabilities found!"
            }
        }
        catch {
            Write-Warning-Log "Failed to parse Trivy results for vulnerability count"
        }
    }
}

# Run main function
Invoke-Main
