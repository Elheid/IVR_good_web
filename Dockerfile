FROM nginx:latest

WORKDIR /ivr-front


# Копируем все файлы IVR, кроме оригинального config.js
COPY . /ivr-front


# Изменяем конфигурацию Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf


# Перезапускаем Nginx, чтобы изменения вступили в силу
CMD ["nginx", "-g", "daemon off;"] 

