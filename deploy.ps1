# Задаем порты для серверов
$portMain = 3000
$portAdmin = 3001

# Функция для проверки и установки npm зависимостей
function Install-NpmDependencies {
    if (Test-Path -Path "./node_modules") {
        Write-Output "Зависимости уже установлены. Пропускаем установку."
    } else {
        Write-Output "Установка зависимостей..."
        npm install
    }
}

# Функция для запуска сервера в новой PowerShell сессии
function Start-Server {
    param (
        [string]$branch,
        [int]$port
    )

    Start-Process powershell -ArgumentList "git checkout $branch; npx http-server -p $port" -NoNewWindow
}

# Функция для открытия страницы в браузере
function Open-Browser {
    param (
        [int]$port
    )

    Start-Process "http://localhost:$port"
}

# Проверка наличия npm
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "npm не установлен. Пожалуйста, установите Node.js с https://nodejs.org/ и попробуйте снова."
    exit 1
}

# Установить зависимости
Install-NpmDependencies

# Запуск сервера для ветки main
Write-Output "Запуск сервера для ветки main..."
Start-Server -branch "deploy" -port $portMain

# Запуск сервера для ветки adminPanelv2
Write-Output "Запуск сервера для ветки adminPanelv2..."
Start-Server -branch "deploy2" -port $portAdmin

# Открытие страниц в браузере
Write-Output "Открытие страниц в браузере..."
Start-Sleep -Seconds 5 # Задержка, чтобы дать время серверам запуститься
Open-Browser -port $portMain
Open-Browser -port $portAdmin

Write-Output "Серверы запущены на портах $portMain и $portAdmin."
