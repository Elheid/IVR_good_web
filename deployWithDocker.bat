@echo off

set PORT_ADMIN=8080
set PORT_MAIN=8081

REM Перемещение в директорию с Dockerfile
cd /d "%~dp0"

REM Сборка образа для админ-приложения с флагом --no-cache
echo Building ivr-app-admin image...
docker build --no-cache -t ivr-app-admin -f Dockerfile.admin .

REM Сборка образа для prod-приложения с флагом --no-cache
echo Building ivr-app-prod image...
docker build --no-cache -t ivr-app-prod -f Dockerfile.prod .

REM Запуск контейнера для админ-приложения
echo Running ivr-app-admin container...
docker run -d -p %PORT_ADMIN%:80 --name ivr-app-admin ivr-app-admin

REM Запуск контейнера для prod-приложения
echo Running ivr-app-prod container...
docker run -d -p %PORT_MAIN%:80 --name ivr-app-prod ivr-app-prod

echo All containers are up and running.
pause

