@echo off
setlocal

REM Переменные для портов
set PORT_MAIN=3000
set PORT_ADMIN=3001

//REM Проверка наличия npm
//where npm >nul 2>nul
//IF %ERRORLEVEL% NEQ 0 (
    //echo npm не установлен. Пожалуйста, установите Node.js с https://nodejs.org/ и попробуйте снова.
    //exit /b 1
//)

//REM Установить зависимости
//echo Установка зависимостей...
//npm install

REM Запуск сервера для ветки main
echo Запуск сервера для ветки main...
start cmd /k "git checkout main && npx http-server -p %PORT_MAIN%"

REM Запуск сервера для ветки adminpanelv2
echo Запуск сервера для ветки adminpanelv2...
start cmd /k "git checkout adminpanelv2 && npx http-server -p %PORT_ADMIN%"

echo Серверы запущены на портах %PORT_MAIN% и %PORT_ADMIN%.

endlocal
exit /b
