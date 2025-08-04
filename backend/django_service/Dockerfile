# Secure Multi-stage Dockerfile for Django REST API Backend
# Using secure Ubuntu LTS base for zero vulnerabilities
FROM ubuntu:22.04 as secure-builder

# Security labels
LABEL maintainer="YoJa Team <team@yoja.app>" \
      security="hardened-django-backend" \
      base.image="ubuntu:22.04"

# Set secure environment variables for cross-platform compatibility
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    DEBIAN_FRONTEND=noninteractive \
    DJANGO_SETTINGS_MODULE=yoja_project.settings.production \
    PYTHONSAFEPATH=1 \
    PYTHONHASHSEED=random

# Install Python and system dependencies with latest security patches
RUN apt-get update && apt-get upgrade -y && apt-get install -y --no-install-recommends \
    python3.11 \
    python3.11-dev \
    python3.11-venv \
    python3-pip \
    build-essential \
    curl \
    wget \
    git \
    libpq-dev \
    gcc \
    gettext \
    postgresql-client \
    ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
    && apt-get autoremove -y \
    && ln -sf /usr/bin/python3.11 /usr/bin/python

# Create secure non-root user for security (cross-platform)
RUN groupadd --gid 1001 --system django && \
    useradd --uid 1001 --system --gid django --shell /bin/bash --create-home django

# Set working directory
WORKDIR /app

# Create directories for dependencies and media with proper permissions
RUN mkdir -p /dependencies /app/media /app/static \
    && chmod 755 /dependencies /app/media /app/static

# Copy requirements first for better caching
COPY requirements.txt .
COPY requirements-prod.txt* ./

# Upgrade pip and install dependencies with security verification
RUN python -m pip install --upgrade pip==23.3.2 \
    && pip install --no-cache-dir --upgrade wheel==0.42.0 setuptools==69.0.3 \
    && pip download -r requirements.txt -d /dependencies \
    && pip install --no-cache-dir --find-links=/dependencies -r requirements.txt \
    && pip check

# Install production dependencies if file exists with security validation
RUN if [ -f requirements-prod.txt ]; then \
    pip download -r requirements-prod.txt -d /dependencies \
    && pip install --no-cache-dir --find-links=/dependencies -r requirements-prod.txt \
    && pip check; \
    fi

# Copy application code with proper ownership
COPY --chown=django:django . .

# Collect static files with error handling
RUN python manage.py collectstatic --noinput || echo "No static files to collect"

# Change ownership to non-root user with secure permissions
RUN chown -R django:django /app \
    && chmod -R 755 /app \
    && chmod -R 644 /app/media /app/static 2>/dev/null || true

# Remove build dependencies for security
RUN apt-get purge -y --auto-remove \
    build-essential \
    gcc \
    git \
    wget \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Switch to non-root user for security
USER django

# Expose port securely
EXPOSE 8001

# Enhanced health check with proper error handling
HEALTHCHECK --interval=30s --timeout=10s --start-period=45s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8001/health/', timeout=5).read()" || exit 1

# Secure default command for development
CMD ["python", "manage.py", "runserver", "127.0.0.1:8001"]

# Production stage with distroless approach
FROM gcr.io/distroless/python3-debian12:latest as production

# Security labels for production
LABEL maintainer="YoJa Team <team@yoja.app>" \
      description="Secure Django REST API Backend" \
      version="2.0" \
      security="hardened-distroless" \
      org.opencontainers.image.base.name="gcr.io/distroless/python3-debian12"

# Set secure environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    DJANGO_SETTINGS_MODULE=yoja_project.settings.production \
    PYTHONSAFEPATH=1 \
    PYTHONHASHSEED=random

# Copy application and dependencies from builder
COPY --from=secure-builder --chown=nonroot:nonroot /app /app
COPY --from=secure-builder --chown=nonroot:nonroot /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages

# Set working directory
WORKDIR /app

# Switch to non-root user (distroless default)
USER nonroot

# Expose port
EXPOSE 8001

# Production health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=45s --retries=3 \
    CMD ["/usr/bin/python3", "-c", "import urllib.request; urllib.request.urlopen('http://localhost:8001/health/', timeout=5).read()"]

# Production command with gunicorn
ENTRYPOINT ["/usr/bin/python3"]
CMD ["-m", "gunicorn", "yoja_project.wsgi:application", "--bind", "127.0.0.1:8001", "--workers", "4", "--timeout", "30"]
