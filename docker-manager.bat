@echo off
REM YoJa Docker Management Script for Windows
REM Works on Windows with Docker Desktop

setlocal enabledelayedexpansion

REM Colors for output (Windows compatible)
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM Function to print colored output
:print_status
echo %GREEN%[INFO]%NC% %~1
goto :eof

:print_warning
echo %YELLOW%[WARNING]%NC% %~1
goto :eof

:print_error
echo %RED%[ERROR]%NC% %~1
goto :eof

:print_header
echo %BLUE%================================%NC%
echo %BLUE%%~1%NC%
echo %BLUE%================================%NC%
goto :eof

REM Function to check if Docker is running
:check_docker
docker info >nul 2>&1
if errorlevel 1 (
    call :print_error "Docker is not running. Please start Docker Desktop and try again."
    exit /b 1
)
goto :eof

REM Function to check if Docker Compose is available
:check_docker_compose
docker compose version >nul 2>&1
if not errorlevel 1 (
    set "DOCKER_COMPOSE=docker compose"
    goto :eof
)

docker-compose --version >nul 2>&1
if not errorlevel 1 (
    set "DOCKER_COMPOSE=docker-compose"
    goto :eof
)

call :print_error "Docker Compose is not available. Please install Docker Compose."
exit /b 1

REM Function to upgrade pip and download dependencies
:prepare_dependencies
call :print_header "Preparing Dependencies"

REM Check backend directories
set "backend_dirs=backend\fastapi_service backend\django_service machine_learning"

for %%d in (%backend_dirs%) do (
    if exist "%%d\requirements.txt" (
        call :print_status "Upgrading pip and downloading dependencies for %%d"
        
        REM Create dependencies directory
        if not exist "%%d\dependencies" mkdir "%%d\dependencies"
        
        REM Use system Python to download dependencies
        where python.exe >nul 2>&1
        if not errorlevel 1 (
            set "PYTHON_CMD=python.exe"
        ) else (
            where python >nul 2>&1
            if not errorlevel 1 (
                set "PYTHON_CMD=python"
            ) else (
                call :print_warning "Python not found in PATH. Dependencies will be downloaded during Docker build."
                goto :continue_deps
            )
        )
        
        call :print_status "Using Python command: !PYTHON_CMD!"
        
        REM Upgrade pip
        !PYTHON_CMD! -m pip install --upgrade pip
        if errorlevel 1 call :print_warning "Failed to upgrade pip"
        
        REM Download dependencies
        pushd "%%d"
        !PYTHON_CMD! -m pip download -r requirements.txt -d .\dependencies
        if errorlevel 1 call :print_warning "Failed to download dependencies for %%d"
        popd
        
        :continue_deps
    ) else (
        call :print_warning "requirements.txt not found in %%d"
    )
)
goto :eof

REM Function to clean Docker system
:clean_docker
call :print_header "Cleaning Docker System"

call :print_status "Pruning Docker builder cache..."
docker builder prune -f

call :print_status "Removing unused Docker images..."
docker image prune -f

call :print_status "Removing unused Docker volumes..."
docker volume prune -f

call :print_status "Removing unused Docker networks..."
docker network prune -f

call :print_status "Docker system cleanup completed"
goto :eof

REM Function to build and start services
:build_and_start
call :print_header "Building and Starting YoJa Services"

call :print_status "Building Docker images..."
%DOCKER_COMPOSE% build --no-cache

call :print_status "Starting services..."
%DOCKER_COMPOSE% up -d

call :print_status "Waiting for services to be ready..."
timeout /t 30 /nobreak >nul

REM Check service health
call :check_services_health
goto :eof

REM Function to check services health
:check_services_health
call :print_header "Checking Services Health"

set "services=fastapi-service django-service db redis"

for %%s in (%services%) do (
    call :print_status "Checking %%s..."
    
    REM Wait for service to be ready
    set /a count=0
    :wait_loop
    %DOCKER_COMPOSE% ps | findstr "%%s.*Up" >nul
    if not errorlevel 1 (
        call :print_status "%%s is running"
        goto :next_service
    )
    
    timeout /t 1 /nobreak >nul
    set /a count+=1
    if !count! lss 60 goto :wait_loop
    
    call :print_warning "%%s may not be ready yet"
    
    :next_service
)
goto :eof

REM Function to show logs
:show_logs
if "%~1"=="" (
    call :print_status "Showing logs for all services..."
    %DOCKER_COMPOSE% logs -f
) else (
    call :print_status "Showing logs for %~1..."
    %DOCKER_COMPOSE% logs -f "%~1"
)
goto :eof

REM Function to stop services
:stop_services
call :print_header "Stopping YoJa Services"

call :print_status "Stopping all services..."
%DOCKER_COMPOSE% down

call :print_status "Services stopped"
goto :eof

REM Function to restart services
:restart_services
call :print_header "Restarting YoJa Services"

call :stop_services
timeout /t 5 /nobreak >nul
call :build_and_start
goto :eof

REM Function to run database migrations
:run_migrations
call :print_header "Running Database Migrations"

call :print_status "Running Django migrations..."
%DOCKER_COMPOSE% exec django-service python manage.py migrate

call :print_status "Creating Django superuser (if needed)..."
%DOCKER_COMPOSE% exec django-service python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@yoja.com', 'admin123') if not User.objects.filter(username='admin').exists() else print('Superuser already exists')"
goto :eof

REM Function to backup data
:backup_data
call :print_header "Backing Up Data"

set "backup_dir=backups\%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%"
set "backup_dir=!backup_dir: =0!"
mkdir "!backup_dir!" 2>nul

call :print_status "Backing up main database..."
%DOCKER_COMPOSE% exec db pg_dump -U yoja_user yoja_main > "!backup_dir!\yoja_main.sql"

call :print_status "Backing up analytics database..."
%DOCKER_COMPOSE% exec analytics-db pg_dump -U yoja_user yoja_analytics > "!backup_dir!\yoja_analytics.sql"

call :print_status "Backup completed in !backup_dir!"
goto :eof

REM Function to show service URLs
:show_urls
call :print_header "YoJa Service URLs"
echo.
echo %GREEN%Frontend:%NC%          http://localhost:3000
echo %GREEN%FastAPI Service:%NC%   http://localhost:8000
echo %GREEN%Django Service:%NC%    http://localhost:8001
echo %GREEN%ML Jupyter:%NC%        http://localhost:8888
echo %GREEN%Grafana:%NC%           http://localhost:3001 (admin/admin123)
echo %GREEN%Prometheus:%NC%        http://localhost:9090
echo %GREEN%MinIO Console:%NC%     http://localhost:9001 (minioadmin/minioadmin123)
echo.
echo %GREEN%API Documentation:%NC%
echo   FastAPI Docs:     http://localhost:8000/docs
echo   Django Admin:     http://localhost:8001/admin
echo.
goto :eof

REM Main script logic
:main
call :check_docker
call :check_docker_compose

if "%~1"=="start" goto :cmd_start
if "%~1"=="up" goto :cmd_start
if "%~1"=="stop" goto :cmd_stop
if "%~1"=="down" goto :cmd_stop
if "%~1"=="restart" goto :cmd_restart
if "%~1"=="build" goto :cmd_build
if "%~1"=="logs" goto :cmd_logs
if "%~1"=="clean" goto :cmd_clean
if "%~1"=="migrate" goto :cmd_migrate
if "%~1"=="backup" goto :cmd_backup
if "%~1"=="urls" goto :cmd_urls
if "%~1"=="status" goto :cmd_status
if "%~1"=="shell" goto :cmd_shell
goto :cmd_help

:cmd_start
call :prepare_dependencies
call :build_and_start
call :show_urls
goto :eof

:cmd_stop
call :stop_services
goto :eof

:cmd_restart
call :restart_services
call :show_urls
goto :eof

:cmd_build
call :prepare_dependencies
call :clean_docker
%DOCKER_COMPOSE% build --no-cache
goto :eof

:cmd_logs
call :show_logs "%~2"
goto :eof

:cmd_clean
call :stop_services
call :clean_docker
goto :eof

:cmd_migrate
call :run_migrations
goto :eof

:cmd_backup
call :backup_data
goto :eof

:cmd_urls
call :show_urls
goto :eof

:cmd_status
%DOCKER_COMPOSE% ps
goto :eof

:cmd_shell
set "service=%~2"
if "!service!"=="" set "service=django-service"
call :print_status "Opening shell in !service!..."
%DOCKER_COMPOSE% exec "!service!" cmd
goto :eof

:cmd_help
echo YoJa Docker Management Script for Windows
echo.
echo Usage: %~n0 [COMMAND] [OPTIONS]
echo.
echo Commands:
echo   start, up     - Build and start all services
echo   stop, down    - Stop all services
echo   restart       - Restart all services
echo   build         - Build Docker images
echo   logs [service]- Show logs (all or specific service)
echo   clean         - Clean Docker system
echo   migrate       - Run database migrations
echo   backup        - Backup databases
echo   urls          - Show service URLs
echo   status        - Show service status
echo   shell [service] - Open shell in service
echo.
echo Examples:
echo   %~n0 start                 # Start all services
echo   %~n0 logs fastapi-service  # Show FastAPI logs
echo   %~n0 shell django-service  # Open Django shell
echo.
goto :eof

REM Entry point
call :main %*
