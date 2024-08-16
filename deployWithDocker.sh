#!/bin/bash

# Установка переменных окружения
PORT_ADMIN=8080
PORT_MAIN=8081

# Перемещение в директорию с Dockerfile
cd "$(dirname "$0")"

# Сборка образа для админ-приложения с флагом --no-cache
echo "Building ivr-app-admin image..."
docker build --no-cache -t ivr-app-admin -f Dockerfile.admin .

# Сборка образа для prod-приложения с флагом --no-cache
echo "Building ivr-app-prod image..."
docker build --no-cache -t ivr-app-prod -f Dockerfile.prod .

# Запуск контейнера для админ-приложения
echo "Running ivr-app-admin container..."
docker run -d -p $PORT_ADMIN:80 --name ivr-app-admin ivr-app-admin

# Запуск контейнера для prod-приложения
echo "Running ivr-app-prod container..."
docker run -d -p $PORT_MAIN:80 --name ivr-app-prod ivr-app-prod

echo "All containers are up and running."
exit