#!/bin/bash

# Создаем временный конфигурационный файл для adminPanelOn=false
cp config.js config_admin_off.js

# Изменяем config_admin_off.js для adminPanelOn=false
sed -i 's/adminPanelOn: true/adminPanelOn: false/' config_admin_off.js

# Копируем временный файл в основной конфигурационный файл
cp config_admin_off.js config.js

# Запускаем сервер на порту 8001 в фоне и закрываем текущее окно
python -m http.server 8001 &

# Открываем браузер на нужной странице
xdg-open http://localhost:8001

# Удаляем временный файл конфигурации
rm config_admin_off.js

# Завершаем выполнение скрипта
exit
