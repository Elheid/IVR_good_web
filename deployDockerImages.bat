@echo off

::  Создаем  копию  config.js  для  adminPanelOn=false
copy config.js config.prod.js

::  Изменяем  config.prod.js  для  adminPanelOn=false
powershell -Command "(Get-Content config.prod.js) -replace 'adminPanelOn:\s*true', 'adminPanelOn: false' | Set-Content config.prod.js"

REM Создаем временный конфигурационный файл для adminPanelOn=true
copy config.js config.admin.js

REM Изменяем config.admin.js для adminPanelOn=true
powershell -Command "(Get-Content config.admin.js) -replace 'adminPanelOn:\s*false', 'adminPanelOn: true' | Set-Content config.admin.js"


::  Сборка  образа  dev
docker build -t ivr-app-dev -f Dockerfile.admin .

::  Сборка  образа  prod
docker build -t ivr-app-prod -f Dockerfile.prod .


echo  Образы  Docker  собраны  успешно!

::  Удаляем  временный  файл  config.prod.js
del config.prod.js
::  Удаляем  временный  файл  config.prod.js
del config.admin.js


pause