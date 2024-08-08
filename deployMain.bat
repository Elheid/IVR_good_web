@echo off

REM Создаем временный конфигурационный файл для adminPanelOn=false
copy config.js config_admin_off.js

REM Изменяем config_admin_off.js для adminPanelOn=false
powershell -Command "(Get-Content config_admin_off.js) -replace 'adminPanelOn:\s*true', 'adminPanelOn: false' | Set-Content config_admin_off.js"

REM Копируем временный файл в основной конфигурационный файл
copy /Y config_admin_off.js config.js

REM Запуск сервера на порту 8081
start cmd /k python -m http.server 8001

REM Открываем браузер
start http://localhost:8081

REM Удаляем временный файл конфигурации
del config_admin_off.js

exit
