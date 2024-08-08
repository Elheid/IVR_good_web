@echo off

REM Создаем временный конфигурационный файл для adminPanelOn=true
copy config.js config_admin_on.js

REM Изменяем config_admin_on.js для adminPanelOn=true
powershell -Command "(Get-Content config_admin_on.js) -replace 'adminPanelOn:\s*false', 'adminPanelOn: true' | Set-Content config_admin_on.js"

REM Копируем временный файл в основной конфигурационный файл
copy /Y config_admin_on.js config.js

REM Запуск сервера на порту 8080
start cmd /k python -m http.server 8000

REM Открываем браузер
start http://localhost:8080

REM Удаляем временный файл конфигурации
del config_admin_on.js

exit
