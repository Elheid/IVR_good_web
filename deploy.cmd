@echo off
REM Переменные для портов
set PORT_MAIN=3000
set PORT_ADMIN=3001

REM Переменные для веток
set MAIN="deploy"
set ADMIN="deploy2"

start cmd /k "cd /d %cd% && git checkout %MAIN% && npx http-server -p %PORT_MAIN%"
timeout /t 0.5 /nobreak >nul
start cmd /k "cd /d %cd% && git checkout %ADMIN% && npx http-server -p %PORT_ADMIN%"
