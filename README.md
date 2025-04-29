# YoJa Project

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
This project is licensed under the MIT License. See the LICENSE file for more details.