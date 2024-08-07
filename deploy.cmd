@echo off

REM Запуск первого сервера с adminPanelOn: true
copy /Y configAdmin.js config.js
start cmd /k "npx http-server -p 8080"

REM Запуск второго сервера с adminPanelOn: false
copy /Y configMain.js config.js
start cmd /k "npx http-server -p 8081"