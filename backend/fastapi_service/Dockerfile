# Multi-stage Dockerfile for FastAPI Service (Lightweight Operations)
# Supports both Windows and Mac/Linux platforms
FROM python:3.11-slim as base

# Set environment variables for cross-platform compatibility
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    DEBIAN_FRONTEND=noninteractive

# Install system dependencies (works for both Mac and Windows containers)
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    wget \
    git \
    libpq-dev \
    gcc \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get autoremove -y

# Create non-root user for security (cross-platform)
RUN groupadd -r fastapi && useradd -r -g fastapi fastapi

# Set working directory
WORKDIR /app

# Create dependencies directory
RUN mkdir -p /dependencies

# Copy requirements first for better caching
COPY requirements.txt .

# Upgrade pip and install dependencies with error handling
RUN python -m pip install --upgrade pip \
    && pip install --no-cache-dir --upgrade pip \
    && pip download -r requirements.txt -d /dependencies \
    && pip install --no-cache-dir --find-links=/dependencies -r requirements.txt \
    || (echo "Failed to install some packages, continuing..." && pip install --no-cache-dir -r requirements.txt)

# Copy application code
COPY ./app ./app

# Create logs directory
RUN mkdir -p /app/logs

# Change ownership to non-root user
RUN chown -R fastapi:fastapi /app

# Switch to non-root user
USER fastapi

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Command for development
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload", "--log-level", "info"]

# Production stage
FROM base as production

# Switch back to root for production setup
USER root

# Install production dependencies
RUN pip install --no-cache-dir gunicorn uvloop httptools

# Switch back to fastapi user
USER fastapi

# Use production command with better performance
CMD ["gunicorn", "app.main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000", "--access-logfile", "-", "--error-logfile", "-"]
