@echo off
REM Проверяем, установлен ли Python
python --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Python не установлен. Пожалуйста, установите Python с https://www.python.org/
    pause
    exit /b
)

REM Создаем временные конфигурации
echo Создание временных конфигураций...
copy config.js config_admin_on.js
copy config.js config_admin_off.js

REM Изменяем config_admin_on.js для adminPanelOn=true
powershell -Command "(Get-Content config_admin_on.js) -replace 'adminPanelOn:\s*false', 'adminPanelOn: true' | Set-Content config_admin_on.js"

REM Изменяем config_admin_off.js для adminPanelOn=false
powershell -Command "(Get-Content config_admin_off.js) -replace 'adminPanelOn:\s*true', 'adminPanelOn: false' | Set-Content config_admin_off.js"


REM Открываем браузеры
start http://localhost:8000
start http://localhost:8001


REM Запускаем первый сервер
echo Запуск первого сервера с adminPanelOn=true...
copy /Y config_admin_on.js config.js
start cmd /k python -m http.server 8000

REM Запускаем второй сервер
echo Запуск второго сервера с adminPanelOn=false...
copy /Y config_admin_off.js config.js
start cmd /k python -m http.server 8001

REM Восстанавливаем оригинальный config.js
echo Восстановление оригинального config.js...
copy /Y config.js.original config.js

REM Удаляем временные конфигурации
echo Удаление временных конфигураций...
del config_admin_on.js
del config_admin_off.js


pause
