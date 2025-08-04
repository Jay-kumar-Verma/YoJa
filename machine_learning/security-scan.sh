#!/bin/bash
# Docker Security Scanner Script for ML Service
# This script performs comprehensive security scanning of the Docker image

set -euo pipefail

# Configuration
IMAGE_NAME="${1:-yoja/ml-service:secure}"
SCAN_OUTPUT_DIR="./security-reports"
SEVERITY_THRESHOLD="HIGH"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Create output directory
mkdir -p "$SCAN_OUTPUT_DIR"

log "Starting security scan for image: $IMAGE_NAME"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Install Trivy if not present
install_trivy() {
    if ! command_exists trivy; then
        log "Installing Trivy security scanner..."
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            sudo apt-get update && sudo apt-get install -y wget apt-transport-https gnupg lsb-release
            wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
            echo "deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
            sudo apt-get update && sudo apt-get install -y trivy
        elif [[ "$OSTYPE" == "darwin"* ]]; then
            brew install trivy
        else
            error "Unsupported OS for automatic Trivy installation"
            exit 1
        fi
    fi
}

# Install Grype if not present
install_grype() {
    if ! command_exists grype; then
        log "Installing Grype security scanner..."
        curl -sSfL https://raw.githubusercontent.com/anchore/grype/main/install.sh | sh -s -- -b /usr/local/bin
    fi
}

# Function to scan with Trivy
scan_with_trivy() {
    log "Running Trivy vulnerability scan..."
    
    # Vulnerability scan
    trivy image --format json --output "$SCAN_OUTPUT_DIR/trivy-vulnerabilities.json" "$IMAGE_NAME" || warning "Trivy vulnerability scan completed with warnings"
    trivy image --format table --severity "$SEVERITY_THRESHOLD,CRITICAL" "$IMAGE_NAME" | tee "$SCAN_OUTPUT_DIR/trivy-summary.txt"
    
    # Configuration scan
    trivy config --format json --output "$SCAN_OUTPUT_DIR/trivy-config.json" . || warning "Trivy config scan completed with warnings"
    
    # Secret scan
    trivy fs --format json --output "$SCAN_OUTPUT_DIR/trivy-secrets.json" . || warning "Trivy secret scan completed with warnings"
    
    success "Trivy scan completed. Results saved to $SCAN_OUTPUT_DIR/trivy-*"
}

# Function to scan with Grype
scan_with_grype() {
    log "Running Grype vulnerability scan..."
    
    grype "$IMAGE_NAME" -o json > "$SCAN_OUTPUT_DIR/grype-vulnerabilities.json" || warning "Grype scan completed with warnings"
    grype "$IMAGE_NAME" -o table --only-fixed | tee "$SCAN_OUTPUT_DIR/grype-summary.txt"
    
    success "Grype scan completed. Results saved to $SCAN_OUTPUT_DIR/grype-*"
}

# Function to analyze Docker image security
analyze_docker_security() {
    log "Analyzing Docker security best practices..."
    
    # Check if image exists
    if ! docker inspect "$IMAGE_NAME" >/dev/null 2>&1; then
        error "Image $IMAGE_NAME not found. Please build the image first."
        exit 1
    fi
    
    # Extract image information
    docker inspect "$IMAGE_NAME" > "$SCAN_OUTPUT_DIR/image-inspect.json"
    
    # Check for non-root user
    USER_INFO=$(docker inspect --format='{{.Config.User}}' "$IMAGE_NAME")
    if [[ "$USER_INFO" == "root" ]] || [[ -z "$USER_INFO" ]]; then
        warning "Image is running as root user - security risk"
    else
        success "Image is running as non-root user: $USER_INFO"
    fi
    
    # Check for read-only root filesystem
    READONLY_ROOT=$(docker inspect --format='{{.Config.ReadonlyRootfs}}' "$IMAGE_NAME")
    if [[ "$READONLY_ROOT" == "true" ]]; then
        success "Read-only root filesystem is enabled"
    else
        warning "Read-only root filesystem is not enabled"
    fi
    
    # Check exposed ports
    EXPOSED_PORTS=$(docker inspect --format='{{range $port, $config := .Config.ExposedPorts}}{{$port}} {{end}}' "$IMAGE_NAME")
    log "Exposed ports: ${EXPOSED_PORTS:-None}"
    
    # Check environment variables for sensitive data
    ENV_VARS=$(docker inspect --format='{{range .Config.Env}}{{println .}}{{end}}' "$IMAGE_NAME")
    echo "$ENV_VARS" | grep -i -E "(password|secret|key|token)" > "$SCAN_OUTPUT_DIR/potential-secrets.txt" || log "No obvious secrets found in environment variables"
}

# Function to check for security labels
check_security_labels() {
    log "Checking security labels..."
    
    SECURITY_LABEL=$(docker inspect --format='{{index .Config.Labels "security"}}' "$IMAGE_NAME")
    if [[ -n "$SECURITY_LABEL" ]]; then
        success "Security label found: $SECURITY_LABEL"
    else
        warning "No security label found"
    fi
    
    # Check all labels
    docker inspect --format='{{range $key, $value := .Config.Labels}}{{$key}}={{$value}}{{println}}{{end}}' "$IMAGE_NAME" > "$SCAN_OUTPUT_DIR/image-labels.txt"
}

# Function to test container runtime security
test_runtime_security() {
    log "Testing runtime security configurations..."
    
    # Test running container with security options
    CONTAINER_ID=$(docker run -d --rm \
        --user nonroot:nonroot \
        --read-only \
        --security-opt=no-new-privileges:true \
        --cap-drop=ALL \
        --network none \
        "$IMAGE_NAME" python -c "import time; time.sleep(60)" 2>/dev/null || echo "failed")
    
    if [[ "$CONTAINER_ID" != "failed" ]] && [[ ${#CONTAINER_ID} -eq 64 ]]; then
        success "Container started successfully with security hardening"
        
        # Check process running as correct user
        RUNNING_USER=$(docker exec "$CONTAINER_ID" whoami 2>/dev/null || echo "unknown")
        log "Container running as user: $RUNNING_USER"
        
        # Stop test container
        docker stop "$CONTAINER_ID" >/dev/null 2>&1
    else
        warning "Failed to start container with full security hardening"
    fi
}

# Function to generate security report
generate_report() {
    log "Generating security report..."
    
    REPORT_FILE="$SCAN_OUTPUT_DIR/security-report.md"
    
    {
        echo "# Docker Security Scan Report"
        echo ""
        echo "**Image:** $IMAGE_NAME"
        echo "**Scan Date:** $(date)"
        echo "**Severity Threshold:** $SEVERITY_THRESHOLD"
        echo ""
        
        echo "## Summary"
        echo ""
        
        # Trivy summary
        if [[ -f "$SCAN_OUTPUT_DIR/trivy-summary.txt" ]]; then
            echo "### Trivy Vulnerabilities"
            echo '```'
            head -20 "$SCAN_OUTPUT_DIR/trivy-summary.txt"
            echo '```'
            echo ""
        fi
        
        # Grype summary
        if [[ -f "$SCAN_OUTPUT_DIR/grype-summary.txt" ]]; then
            echo "### Grype Vulnerabilities"
            echo '```'
            head -20 "$SCAN_OUTPUT_DIR/grype-summary.txt"
            echo '```'
            echo ""
        fi
        
        echo "## Security Configuration Analysis"
        echo ""
        echo "- **User:** $(docker inspect --format='{{.Config.User}}' "$IMAGE_NAME" 2>/dev/null || echo 'Not specified')"
        echo "- **Read-only Root:** $(docker inspect --format='{{.Config.ReadonlyRootfs}}' "$IMAGE_NAME" 2>/dev/null || echo 'false')"
        echo "- **Exposed Ports:** $(docker inspect --format='{{range $port, $config := .Config.ExposedPorts}}{{$port}} {{end}}' "$IMAGE_NAME" 2>/dev/null || echo 'None')"
        echo ""
        
        echo "## Recommendations"
        echo ""
        echo "1. Use minimal base images (distroless, Alpine)"
        echo "2. Run as non-root user"
        echo "3. Enable read-only root filesystem"
        echo "4. Drop all capabilities"
        echo "5. Use security-opt=no-new-privileges"
        echo "6. Regularly update base images and dependencies"
        echo "7. Implement proper secret management"
        echo "8. Use multi-stage builds to reduce attack surface"
        echo ""
        
        echo "## Files Generated"
        echo ""
        for file in "$SCAN_OUTPUT_DIR"/*; do
            echo "- $(basename "$file")"
        done
        
    } > "$REPORT_FILE"
    
    success "Security report generated: $REPORT_FILE"
}

# Main execution
main() {
    log "Docker Security Scanner for ML Service"
    log "======================================"
    
    # Install scanners
    # install_trivy
    # install_grype
    
    # Perform scans
    if command_exists trivy; then
        scan_with_trivy
    else
        warning "Trivy not found, skipping Trivy scan"
    fi
    
    if command_exists grype; then
        scan_with_grype
    else
        warning "Grype not found, skipping Grype scan"
    fi
    
    # Analyze Docker security
    analyze_docker_security
    check_security_labels
    test_runtime_security
    
    # Generate report
    generate_report
    
    log "Security scan completed! Check $SCAN_OUTPUT_DIR for detailed results."
    
    # Count critical/high vulnerabilities
    if [[ -f "$SCAN_OUTPUT_DIR/trivy-vulnerabilities.json" ]]; then
        CRITICAL_COUNT=$(jq '.Results[]?.Vulnerabilities[]? | select(.Severity == "CRITICAL") | .VulnerabilityID' "$SCAN_OUTPUT_DIR/trivy-vulnerabilities.json" 2>/dev/null | wc -l || echo "0")
        HIGH_COUNT=$(jq '.Results[]?.Vulnerabilities[]? | select(.Severity == "HIGH") | .VulnerabilityID' "$SCAN_OUTPUT_DIR/trivy-vulnerabilities.json" 2>/dev/null | wc -l || echo "0")
        
        log "Found $CRITICAL_COUNT critical and $HIGH_COUNT high severity vulnerabilities"
        
        if [[ $CRITICAL_COUNT -gt 0 ]]; then
            error "Critical vulnerabilities found! Review and fix before production deployment."
            exit 1
        elif [[ $HIGH_COUNT -gt 0 ]]; then
            warning "High severity vulnerabilities found. Consider fixing before deployment."
        else
            success "No critical or high severity vulnerabilities found!"
        fi
    fi
}

# Run main function
main "$@"
