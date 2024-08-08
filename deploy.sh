#!/bin/bash

# Проверяем, установлен ли Python
if ! command -v python3 &> /dev/null
then
    echo "Python не установлен. Пожалуйста, установите Python с https://www.python.org/"
    exit
fi

# Создаем временные конфигурации
echo "Создание временных конфигураций..."
cp config.js config_admin_on.js
cp config.js config_admin_off.js

# Изменяем config_admin_on.js для adminPanelOn=true
sed -i 's/adminPanelOn:\s*false/adminPanelOn: true/' config_admin_on.js
sed -i 's/adminPanelOn:\s*false/adminPanelOn: true/' config_admin_on.js

# Изменяем config_admin_off.js для adminPanelOn=false
sed -i 's/adminPanelOn:\s*true/adminPanelOn: false/' config_admin_off.js
sed -i 's/adminPanelOn:\s*true/adminPanelOn: false/' config_admin_off.js

# Открываем браузеры
xdg-open http://localhost:8000
xdg-open http://localhost:8001


# Запускаем первый сервер
echo "Запуск первого сервера с adminPanelOn=true..."
cp config_admin_on.js config.js
python3 -m http.server 8000 &

# Запускаем второй сервер
echo "Запуск второго сервера с adminPanelOn=false..."
cp config_admin_off.js config.js
python3 -m http.server 8001 &

# Восстанавливаем оригинальный config.js
echo "Восстановление оригинального config.js..."
cp config_admin_on.js config.js

# Удаляем временные конфигурации
echo "Удаление временных конфигураций..."
rm config_admin_on.js
rm config_admin_off.js


wait
