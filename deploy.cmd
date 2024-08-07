@echo off

REM Запуск второго сервера с adminPanelOn: false
copy /Y configMain.js config.js
start cmd /k "npx http-server -p 8081"

timeout /t 5 /nobreak >nul

REM Запуск первого сервера с adminPanelOn: true
copy /Y configAdmin.js config.js
start cmd /k "npx http-server -p 8080"
