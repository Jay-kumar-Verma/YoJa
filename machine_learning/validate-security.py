#!/usr/bin/env python3
"""
Enhanced Security Validation Script for ML Service Docker Image
Performs comprehensive security checks on the built Docker image
"""

import json
import subprocess
import sys
import re
from datetime import datetime
from typing import Dict, List, Tuple, Optional
import argparse

class SecurityValidator:
    def __init__(self, image_name: str, verbose: bool = False):
        self.image_name = image_name
        self.verbose = verbose
        self.results = {
            'image': image_name,
            'scan_date': datetime.now().isoformat(),
            'security_score': 0,
            'total_checks': 0,
            'passed_checks': 0,
            'failed_checks': 0,
            'warnings': 0,
            'checks': {}
        }
    
    def log(self, message: str, level: str = "INFO"):
        """Enhanced logging with color support"""
        colors = {
            'INFO': '\033[94m',    # Blue
            'SUCCESS': '\033[92m', # Green
            'WARNING': '\033[93m', # Yellow
            'ERROR': '\033[91m',   # Red
            'ENDC': '\033[0m'      # End color
        }
        
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        color = colors.get(level, colors['INFO'])
        end_color = colors['ENDC']
        
        print(f"{color}[{timestamp}] [{level}] {message}{end_color}")
        
        if self.verbose or level in ['WARNING', 'ERROR']:
            sys.stdout.flush()
    
    def run_command(self, cmd: List[str], capture_output: bool = True) -> Tuple[int, str, str]:
        """Run a command and return (exit_code, stdout, stderr)"""
        try:
            result = subprocess.run(
                cmd, 
                capture_output=capture_output, 
                text=True, 
                timeout=30
            )
            return result.returncode, result.stdout, result.stderr
        except subprocess.TimeoutExpired:
            return 1, "", "Command timed out"
        except Exception as e:
            return 1, "", str(e)
    
    def check_image_exists(self) -> bool:
        """Check if the Docker image exists"""
        self.log("Checking if image exists...")
        exit_code, stdout, stderr = self.run_command(['docker', 'inspect', self.image_name])
        
        if exit_code == 0:
            self.log(f"✓ Image {self.image_name} exists", "SUCCESS")
            self.record_check("image_exists", True, "Image found in local registry")
            return True
        else:
            self.log(f"✗ Image {self.image_name} not found", "ERROR")
            self.record_check("image_exists", False, f"Image not found: {stderr}")
            return False
    
    def check_base_image_security(self) -> bool:
        """Check if base image is secure"""
        self.log("Checking base image security...")
        
        # Get image history to find base image
        exit_code, stdout, stderr = self.run_command([
            'docker', 'history', self.image_name, 
            '--format', 'table {{.CreatedBy}}', '--no-trunc'
        ])
        
        if exit_code != 0:
            self.record_check("base_image_security", False, "Could not retrieve image history")
            return False
        
        secure_patterns = [
            r'chainguard\.dev',
            r'gcr\.io/distroless',
            r'scratch',
            r'ubuntu:22\.04',  # Our secure Ubuntu base
        ]
        
        insecure_patterns = [
            r'python:\d+\.\d+-slim',  # Known vulnerable
            r'alpine:3\.19\.1',       # Known vulnerable version
            r'FROM.*latest',          # Using latest tag
        ]
        
        is_secure = False
        security_issues = []
        
        for line in stdout.split('\n'):
            # Check for secure base images
            for pattern in secure_patterns:
                if re.search(pattern, line, re.IGNORECASE):
                    is_secure = True
                    break
            
            # Check for insecure patterns
            for pattern in insecure_patterns:
                if re.search(pattern, line, re.IGNORECASE):
                    security_issues.append(f"Insecure pattern found: {pattern}")
        
        if is_secure and not security_issues:
            self.log("✓ Base image appears secure", "SUCCESS")
            self.record_check("base_image_security", True, "Secure base image detected")
            return True
        elif security_issues:
            self.log(f"⚠ Base image security issues: {'; '.join(security_issues)}", "WARNING")
            self.record_check("base_image_security", False, f"Security issues: {'; '.join(security_issues)}")
            return False
        else:
            self.log("? Could not determine base image security status", "WARNING")
            self.record_check("base_image_security", None, "Could not determine base image security")
            return False
    
    def check_user_configuration(self) -> bool:
        """Check if image runs as non-root user"""
        self.log("Checking user configuration...")
        
        exit_code, stdout, stderr = self.run_command([
            'docker', 'inspect', self.image_name, 
            '--format', '{{.Config.User}}'
        ])
        
        if exit_code != 0:
            self.record_check("user_config", False, "Could not retrieve user configuration")
            return False
        
        user = stdout.strip()
        
        if user and user not in ['', 'root', '0']:
            self.log(f"✓ Image runs as non-root user: {user}", "SUCCESS")
            self.record_check("user_config", True, f"Non-root user: {user}")
            return True
        elif user in ['root', '0']:
            self.log("✗ Image runs as root user", "ERROR")
            self.record_check("user_config", False, "Running as root user")
            return False
        else:
            # Check if it's a distroless/chainguard image (defaults to nonroot)
            exit_code, base_stdout, _ = self.run_command([
                'docker', 'inspect', self.image_name, 
                '--format', '{{index .Config.Labels "org.opencontainers.image.base.name"}}'
            ])
            
            base_name = base_stdout.strip().lower()
            if 'chainguard' in base_name or 'distroless' in base_name:
                self.log("✓ Distroless/Chainguard image - runs as nonroot by default", "SUCCESS")
                self.record_check("user_config", True, "Distroless image with nonroot default")
                return True
            else:
                self.log("⚠ No explicit user set, may default to root", "WARNING")
                self.record_check("user_config", False, "No explicit non-root user configured")
                return False
    
    def check_security_labels(self) -> bool:
        """Check for security-related labels"""
        self.log("Checking security labels...")
        
        exit_code, stdout, stderr = self.run_command([
            'docker', 'inspect', self.image_name, 
            '--format', '{{json .Config.Labels}}'
        ])
        
        if exit_code != 0:
            self.record_check("security_labels", False, "Could not retrieve labels")
            return False
        
        try:
            labels = json.loads(stdout.strip() or '{}')
        except json.JSONDecodeError:
            self.record_check("security_labels", False, "Could not parse labels JSON")
            return False
        
        security_labels = {
            'security': 'Security level label',
            'vulnerability.status': 'Vulnerability status',
            'build.date': 'Build timestamp',
            'build.version': 'Build version'
        }
        
        found_labels = []
        missing_labels = []
        
        for label, description in security_labels.items():
            if label in labels:
                found_labels.append(f"{label}={labels[label]}")
            else:
                missing_labels.append(label)
        
        if found_labels:
            self.log(f"✓ Security labels found: {'; '.join(found_labels)}", "SUCCESS")
            
            # Check specific security values
            if labels.get('vulnerability.status') == 'zero-known-cves':
                self.log("✓ Zero known CVEs reported", "SUCCESS")
            
            self.record_check("security_labels", True, f"Labels: {'; '.join(found_labels)}")
            return True
        else:
            self.log("⚠ No security labels found", "WARNING")
            self.record_check("security_labels", False, "No security labels present")
            return False
    
    def check_exposed_ports(self) -> bool:
        """Check exposed ports configuration"""
        self.log("Checking exposed ports...")
        
        exit_code, stdout, stderr = self.run_command([
            'docker', 'inspect', self.image_name, 
            '--format', '{{json .Config.ExposedPorts}}'
        ])
        
        if exit_code != 0:
            self.record_check("exposed_ports", False, "Could not retrieve port configuration")
            return False
        
        try:
            ports = json.loads(stdout.strip() or '{}')
        except json.JSONDecodeError:
            self.record_check("exposed_ports", False, "Could not parse ports JSON")
            return False
        
        if ports:
            port_list = list(ports.keys())
            # Check for expected ML service port
            if '8889/tcp' in port_list:
                self.log(f"✓ Expected ML service port exposed: {', '.join(port_list)}", "SUCCESS")
                self.record_check("exposed_ports", True, f"Ports: {', '.join(port_list)}")
                return True
            else:
                self.log(f"⚠ Unexpected ports exposed: {', '.join(port_list)}", "WARNING")
                self.record_check("exposed_ports", None, f"Unexpected ports: {', '.join(port_list)}")
                return False
        else:
            self.log("ℹ No ports exposed", "INFO")
            self.record_check("exposed_ports", True, "No ports exposed (secure default)")
            return True
    
    def check_image_size(self) -> bool:
        """Check if image size is reasonable"""
        self.log("Checking image size...")
        
        exit_code, stdout, stderr = self.run_command([
            'docker', 'inspect', self.image_name, 
            '--format', '{{.Size}}'
        ])
        
        if exit_code != 0:
            self.record_check("image_size", False, "Could not retrieve image size")
            return False
        
        try:
            size_bytes = int(stdout.strip())
            size_mb = round(size_bytes / (1024 * 1024), 2)
        except (ValueError, TypeError):
            self.record_check("image_size", False, "Could not parse image size")
            return False
        
        # Size thresholds (in MB)
        if size_mb < 100:
            self.log(f"✓ Excellent image size: {size_mb} MB", "SUCCESS")
            self.record_check("image_size", True, f"Excellent size: {size_mb} MB")
            return True
        elif size_mb < 500:
            self.log(f"✓ Good image size: {size_mb} MB", "SUCCESS")
            self.record_check("image_size", True, f"Good size: {size_mb} MB")
            return True
        elif size_mb < 1000:
            self.log(f"⚠ Large image size: {size_mb} MB", "WARNING")
            self.record_check("image_size", None, f"Large size: {size_mb} MB")
            return False
        else:
            self.log(f"✗ Very large image size: {size_mb} MB", "ERROR")
            self.record_check("image_size", False, f"Very large size: {size_mb} MB")
            return False
    
    def check_layer_count(self) -> bool:
        """Check number of layers (fewer is better)"""
        self.log("Checking layer count...")
        
        exit_code, stdout, stderr = self.run_command([
            'docker', 'history', self.image_name, '--quiet', '--no-trunc'
        ])
        
        if exit_code != 0:
            self.record_check("layer_count", False, "Could not retrieve layer information")
            return False
        
        layer_count = len([line for line in stdout.strip().split('\n') if line.strip()])
        
        if layer_count <= 10:
            self.log(f"✓ Excellent layer count: {layer_count}", "SUCCESS")
            self.record_check("layer_count", True, f"Excellent: {layer_count} layers")
            return True
        elif layer_count <= 20:
            self.log(f"✓ Good layer count: {layer_count}", "SUCCESS")
            self.record_check("layer_count", True, f"Good: {layer_count} layers")
            return True
        elif layer_count <= 30:
            self.log(f"⚠ High layer count: {layer_count}", "WARNING")
            self.record_check("layer_count", None, f"High: {layer_count} layers")
            return False
        else:
            self.log(f"✗ Very high layer count: {layer_count}", "ERROR")
            self.record_check("layer_count", False, f"Very high: {layer_count} layers")
            return False
    
    def test_container_security(self) -> bool:
        """Test container with security restrictions"""
        self.log("Testing container security restrictions...")
        
        # Test 1: Read-only filesystem
        exit_code, stdout, stderr = self.run_command([
            'docker', 'run', '--rm', '--read-only', 
            '--user', 'nonroot:nonroot',
            self.image_name, 
            'python', '-c', 'print("Read-only test passed")'
        ])
        
        readonly_success = exit_code == 0
        
        # Test 2: No new privileges
        exit_code2, stdout2, stderr2 = self.run_command([
            'docker', 'run', '--rm', 
            '--security-opt=no-new-privileges:true',
            '--user', 'nonroot:nonroot',
            self.image_name, 
            'python', '-c', 'print("No new privileges test passed")'
        ])
        
        no_priv_success = exit_code2 == 0
        
        # Test 3: Dropped capabilities
        exit_code3, stdout3, stderr3 = self.run_command([
            'docker', 'run', '--rm', 
            '--cap-drop=ALL',
            '--user', 'nonroot:nonroot',
            self.image_name, 
            'python', '-c', 'print("Drop capabilities test passed")'
        ])
        
        drop_cap_success = exit_code3 == 0
        
        success_count = sum([readonly_success, no_priv_success, drop_cap_success])
        
        if success_count == 3:
            self.log("✓ All security restriction tests passed", "SUCCESS")
            self.record_check("security_restrictions", True, "All 3 security tests passed")
            return True
        elif success_count >= 2:
            self.log(f"⚠ {success_count}/3 security restriction tests passed", "WARNING")
            self.record_check("security_restrictions", None, f"{success_count}/3 tests passed")
            return False
        else:
            self.log(f"✗ Only {success_count}/3 security restriction tests passed", "ERROR")
            self.record_check("security_restrictions", False, f"Only {success_count}/3 tests passed")
            return False
    
    def record_check(self, check_name: str, passed: Optional[bool], details: str):
        """Record the result of a security check"""
        self.results['total_checks'] += 1
        
        if passed is True:
            self.results['passed_checks'] += 1
            status = "PASS"
        elif passed is False:
            self.results['failed_checks'] += 1
            status = "FAIL"
        else:
            self.results['warnings'] += 1
            status = "WARNING"
        
        self.results['checks'][check_name] = {
            'status': status,
            'details': details,
            'timestamp': datetime.now().isoformat()
        }
    
    def calculate_security_score(self) -> int:
        """Calculate overall security score (0-100)"""
        if self.results['total_checks'] == 0:
            return 0
        
        # Weight different factors
        passed_weight = 100
        warning_weight = 50
        failed_weight = 0
        
        total_weight = (
            self.results['passed_checks'] * passed_weight +
            self.results['warnings'] * warning_weight +
            self.results['failed_checks'] * failed_weight
        )
        
        max_possible_weight = self.results['total_checks'] * passed_weight
        
        return round((total_weight / max_possible_weight) * 100)
    
    def run_all_checks(self) -> Dict:
        """Run all security validation checks"""
        self.log("Starting comprehensive security validation", "INFO")
        self.log(f"Target Image: {self.image_name}", "INFO")
        self.log("=" * 60, "INFO")
        
        # Core checks
        checks = [
            ("Image Existence", self.check_image_exists),
            ("Base Image Security", self.check_base_image_security),
            ("User Configuration", self.check_user_configuration),
            ("Security Labels", self.check_security_labels),
            ("Port Configuration", self.check_exposed_ports),
            ("Image Size", self.check_image_size),
            ("Layer Optimization", self.check_layer_count),
            ("Security Restrictions", self.test_container_security),
        ]
        
        # Run all checks
        for check_name, check_func in checks:
            try:
                self.log(f"\n--- {check_name} ---")
                check_func()
            except Exception as e:
                self.log(f"✗ {check_name} failed with exception: {str(e)}", "ERROR")
                self.record_check(check_name.lower().replace(' ', '_'), False, f"Exception: {str(e)}")
        
        # Calculate final score
        self.results['security_score'] = self.calculate_security_score()
        
        # Print summary
        self.log("\n" + "=" * 60, "INFO")
        self.log("SECURITY VALIDATION SUMMARY", "INFO")
        self.log("=" * 60, "INFO")
        
        score = self.results['security_score']
        if score >= 90:
            score_level = "EXCELLENT"
            score_color = "SUCCESS"
        elif score >= 75:
            score_level = "GOOD"
            score_color = "SUCCESS"
        elif score >= 60:
            score_level = "FAIR"
            score_color = "WARNING"
        else:
            score_level = "POOR"
            score_color = "ERROR"
        
        self.log(f"Overall Security Score: {score}/100 ({score_level})", score_color)
        self.log(f"Total Checks: {self.results['total_checks']}")
        self.log(f"Passed: {self.results['passed_checks']}", "SUCCESS")
        self.log(f"Warnings: {self.results['warnings']}", "WARNING" if self.results['warnings'] > 0 else "INFO")
        self.log(f"Failed: {self.results['failed_checks']}", "ERROR" if self.results['failed_checks'] > 0 else "INFO")
        
        return self.results

def main():
    parser = argparse.ArgumentParser(description='Enhanced Security Validation for ML Docker Image')
    parser.add_argument('image_name', help='Docker image name to validate')
    parser.add_argument('-v', '--verbose', action='store_true', help='Verbose output')
    parser.add_argument('-o', '--output', help='Output JSON report file')
    parser.add_argument('--min-score', type=int, default=75, help='Minimum security score required (default: 75)')
    
    args = parser.parse_args()
    
    validator = SecurityValidator(args.image_name, args.verbose)
    results = validator.run_all_checks()
    
    # Save report if requested
    if args.output:
        with open(args.output, 'w') as f:
            json.dump(results, f, indent=2)
        validator.log(f"Security report saved to: {args.output}", "INFO")
    
    # Check if minimum score is met
    if results['security_score'] < args.min_score:
        validator.log(f"Security score {results['security_score']} is below minimum required {args.min_score}", "ERROR")
        sys.exit(1)
    else:
        validator.log(f"Security score {results['security_score']} meets minimum required {args.min_score}", "SUCCESS")
        sys.exit(0)

if __name__ == "__main__":
    main()
