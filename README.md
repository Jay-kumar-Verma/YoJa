# YoJa - AI-Powered Yoga Assistant

[![CI/CD Pipeline](https://github.com/yourusername/YoJa/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/yourusername/YoJa/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![Python](https://img.shields.io/badge/Python-3.8%2B-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18.0-61DAFB.svg)](https://reactjs.org/)

An intelligent yoga platform that combines computer vision, real-time pose analysis, and personalized recommendations to enhance your yoga practice.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## Features

### Real-time AI Analysis
- **Live Pose Detection**: MediaPipe + OpenCV for accurate pose recognition
- **Real-time Corrections**: Instant feedback on posture and alignment
- **Progress Tracking**: Detailed analytics and improvement insights
- **Personalized Recommendations**: AI-driven yoga routine suggestions

### Professional Architecture
- **Dual Backend Strategy**: FastAPI for real-time ops, Django for heavy data
- **450+ Database Tables**: Enterprise-grade data architecture across 7 domains
- **Microservices Design**: Scalable, maintainable, production-ready
- **Cross-platform Support**: Works on Windows, Mac, and Linux

### Modern Tech Stack
- **Frontend**: React.js + Vite + Tailwind CSS
- **Real-time Backend**: FastAPI + WebSocket + Redis
- **Data Backend**: Django REST + PostgreSQL + Celery
- **AI/ML**: TensorFlow + OpenCV + MediaPipe
- **DevOps**: Docker + Docker Compose + CI/CD

## Architecture

YoJa features a **dual backend architecture** designed for optimal performance:

- **FastAPI Service**: Lightweight operations, real-time pose analysis, WebSocket connections
- **Django REST Service**: Heavy data processing, 450+ professional tables, complex business logic
- **React Frontend**: Modern UI with real-time video integration
- **ML Services**: TensorFlow + OpenCV for pose detection and analysis

## Quick Start

### Prerequisites

- **Docker Desktop** (Windows/Mac)
- **Git**
- **Python 3.8+** (optional, for local development)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/YoJa.git
   cd YoJa
   ```

2. **For Windows Users**:
   ```cmd
   docker-manager.bat start
   ```

3. **For Mac/Linux Users**:
   ```bash
   chmod +x docker-manager.sh
   ./docker-manager.sh start
   ```

### Access Services

After startup, access these URLs:

- **Frontend**: http://localhost:3000
- **FastAPI Service**: http://localhost:8000 (API Docs: /docs)
- **Django Service**: http://localhost:8001 (Admin: /admin)
- **ML Jupyter**: http://localhost:8888
- **Grafana**: http://localhost:3001 (admin/admin123)
- **MinIO Console**: http://localhost:9001 (minioadmin/minioadmin123)

## Management Commands

### Windows (docker-manager.bat)
```cmd
docker-manager.bat start      # Start all services
docker-manager.bat stop       # Stop all services
docker-manager.bat restart    # Restart all services
docker-manager.bat logs       # View logs
docker-manager.bat clean      # Clean Docker system
docker-manager.bat migrate    # Run database migrations
docker-manager.bat backup     # Backup databases
docker-manager.bat urls       # Show service URLs
```

### Mac/Linux (docker-manager.sh)
```bash
./docker-manager.sh start     # Start all services
./docker-manager.sh stop      # Stop all services
./docker-manager.sh restart   # Restart all services
./docker-manager.sh logs      # View logs
./docker-manager.sh clean     # Clean Docker system
./docker-manager.sh migrate   # Run database migrations
./docker-manager.sh backup    # Backup databases
## Enterprise Features

### Database Architecture
- **450+ Professional Tables** across 7 application domains
- **Dual Database Setup**: Main operations + Analytics
- **Automated Migrations** and backup systems
- **Redis Caching** for optimal performance

### Security & Authentication
- **JWT Authentication** across services
- **Role-based Access Control** (Student, Instructor, Admin, Super Admin)
- **OAuth Integration** for social login
- **Secure API Gateway** with rate limiting

### Real-time Features
- **Live Pose Analysis** with MediaPipe + OpenCV
- **WebRTC Video Streaming** for real-time classes
- **WebSocket Connections** for instant feedback
- **Real-time Progress Tracking**

### ML & AI Capabilities
- **Custom Pose Detection Models**
- **Personalized Recommendations**
- **Progress Analytics** and insights
- **Automated Pose Correction**

## Development Setup

### Local Development (Without Docker)

1. **Backend Services**:
   ```bash
   # FastAPI Service
   cd backend/fastapi_service
   pip install -r requirements.txt
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload

   # Django Service
   cd backend/django_service
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver 0.0.0.0:8001
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Machine Learning**:
   ```bash
   cd machine_learning
   pip install -r requirements.txt
   jupyter notebook
   ```

### Environment Variables

Create `.env` files in each service directory:

**backend/fastapi_service/.env**:
```env
DATABASE_URL=postgresql://yoja_user:yoja_pass@localhost:5432/yoja_main
REDIS_URL=redis://localhost:6379/0
JWT_SECRET_KEY=your-secret-key
```

**backend/django_service/.env**:
```env
DATABASE_URL=postgresql://yoja_user:yoja_pass@localhost:5432/yoja_main
ANALYTICS_DATABASE_URL=postgresql://yoja_user:yoja_pass@localhost:5433/yoja_analytics
REDIS_URL=redis://localhost:6379/1
SECRET_KEY=your-django-secret-key
```

## Monitoring & Analytics

- **Prometheus**: Metrics collection
- **Grafana**: Visualization dashboards
- **Structured Logging**: Centralized log management
- **Health Checks**: Automated service monitoring

## Testing

```bash
# Run all tests
docker-manager.sh test

# Run specific service tests
docker-compose exec fastapi-service pytest
docker-compose exec django-service python manage.py test
```

## Production Deployment

The Docker configurations are production-ready with:
- **Multi-stage builds** for optimized images
- **Health checks** for all services
- **Automatic restarts** and recovery
- **Volume persistence** for data
- **Load balancing** with Nginx

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Troubleshooting

### Common Issues

1. **Docker not starting**: Ensure Docker Desktop is running
2. **Port conflicts**: Check if ports 3000, 8000, 8001 are available
3. **Database connection**: Wait for PostgreSQL to fully initialize (30-60 seconds)
4. **Memory issues**: Allocate at least 4GB RAM to Docker

### Getting Help

- Check the logs: `docker-manager.sh logs`
- Review service status: `docker-manager.sh status`
- Clean and rebuild: `docker-manager.sh clean && docker-manager.sh start`

## Documentation

- [Architecture Documentation](docs/architecture-diagram.md)
- [API Documentation](docs/api-documentation.md)
- [Database Schema](docs/database-schema.md)
- [Deployment Guide](docs/deployment-guide.md)

---

**Built with care for the yoga community**

---

YoJa ProjectJa Project

## Overview
YoJa is a yoga posture monitoring application that utilizes machine learning, Convolutional Neural Networks (CNN), and OpenCV to identify and correct yoga postures in real-time. The application is designed to run on a local server using Ubuntu, leveraging Docker for containerization to ensure a consistent development environment.

## Project Structure
The project is organized into four main components:

- **Backend**: Built using FastAPI, it handles the application logic, including machine learning model interactions and API endpoints for yoga posture monitoring.
- **Frontend**: Developed using ReactJS, it provides an interactive user interface for users to interact with the yoga posture monitoring system.
- **Database**: PostgreSQL is used as the database to store user data, posture information, and other relevant details.
- **Machine Learning**: Includes scripts and models for training, validating, and deploying the yoga posture detection and correction system.

## Technologies Used
### Backend
- Python
- FastAPI
- OpenCV
- Machine Learning Libraries (e.g., TensorFlow, PyTorch)
- PostgreSQL (for data storage)

### Frontend
- ReactJS
- HTML, CSS, JavaScript

### Machine Learning
- TensorFlow
- OpenCV
- Scikit-learn
- Jupyter Notebooks

### Containerization
- Docker
- Docker Compose

## Setup Instructions

### Prerequisites
- Docker and Docker Compose installed on your local machine.
- Basic knowledge of Python, FastAPI, ReactJS, and Docker.

### Running the Application

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd YoJa
   ```

2. **Build and Run the Docker Containers**
   Navigate to the root directory of the project (where the main `docker-compose.yml` file is located) and run the following command:
   ```bash
   docker-compose up --build

3. **Access the Application**
   - **Backend API**: Available at `http://localhost:8000`.
   - **Frontend Application**: Accessible at `http://localhost:3000`.
   - **Database**: PostgreSQL can be accessed locally on the default port `5432` (or as configured in `docker-compose.yml`).
   - **Machine Learning Workspace**: 
     - Jupyter Notebook (if enabled) will be accessible at `http://localhost:8888`.
     - Trained models and scripts are located in the `machine_learning` directory.

### Development
- **Backend**: Modify the files in the `backend/app` directory. Use FastAPI for API development and integrate the machine learning models as needed.
- **Frontend**: Make changes in the `frontend/src` directory. Use ReactJS to enhance the user interface and ensure seamless interaction with the backend.
- **Database**: Update the database schema or initial data in the `database/init.sql` file. Use PostgreSQL for managing user and posture data.
- **Machine Learning**: Modify or add scripts in the `machine_learning/scripts` directory for training, validation, or preprocessing. Use Jupyter Notebooks in the `machine_learning/notebooks` directory for exploratory analysis and model development.

### Database Initialization
- The database schema and initial data can be set up by executing the SQL commands in `database/init.sql`.
- To initialize the database, follow these steps:
  1. Ensure the PostgreSQL container is running by starting the Docker containers:
     ```bash
     docker-compose up --build
     ```
  2. Access the PostgreSQL container:
     ```bash
     docker exec -it <database-container-name> psql -U <username> -d <database-name>
     ```
     Replace `<database-container-name>`, `<username>`, and `<database-name>` with the appropriate values from your `docker-compose.yml` file.
  3. Run the SQL commands in `init.sql` to set up the schema and initial data:
     ```sql
     \i /path/to/init.sql
     ```
     Replace `/path/to/init.sql` with the actual path to the `init.sql` file inside the container.

     
## Best Practices
- Use version control (e.g., Git) to manage changes to the codebase.
- Write unit tests for both backend and frontend components to ensure code quality.
- Document your code and maintain clear comments for better understanding.
- Regularly update dependencies and monitor for security vulnerabilities.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT ADT University License. See the LICENSE file for more details.
