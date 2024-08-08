#!/bin/bash

# Создаем временный конфигурационный файл для adminPanelOn=true
cp config.js config_admin_on.js

# Изменяем config_admin_on.js для adminPanelOn=true
sed -i 's/adminPanelOn: false/adminPanelOn: true/' config_admin_on.js

# Копируем временный файл в основной конфигурационный файл
cp config_admin_on.js config.js

# Запускаем сервер на порту 8000 в фоне и закрываем текущее окно
python -m http.server 8000 &

# Открываем браузер на нужной странице
xdg-open http://localhost:8000

# Удаляем временный файл конфигурации
rm config_admin_on.js

# Завершаем выполнение скрипта
exit
