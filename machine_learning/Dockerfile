FROM python:3.9-slim

WORKDIR /ml

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libopencv-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the ML scripts and data
COPY ./scripts ./scripts
COPY ./data ./data

# Set default working directory and command
WORKDIR /ml
CMD ["python", "./scripts/train.py"]