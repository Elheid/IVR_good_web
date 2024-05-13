// Создаем WebSocket соединение
const socket = new WebSocket("http://localhost:5000");




// Функция для отправки данных на сервер через WebSocket
function sendData(imageData) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(imageData);
    } else {
        console.error('WebSocket connection is not open.');
        socket.close();
    }
}

// Функция для получения доступа к видеопотоку с веб-камеры
function startWebcam() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            const videoElement = document.getElementById("videoElement");
            videoElement.srcObject = stream;
            videoElement.onloadedmetadata = function(e) {
                videoElement.play();
                // Отправляем изображения с веб-камеры на сервер каждые 30 миллисекунд
                setInterval(function() {
                    sendFrame(videoElement);
                }, 30);
            };
            document.querySelector(".video-container").appendChild(videoElement);
        })
        .catch(function(err) {
            console.error('Error accessing webcam:', err);
        });
}

// Функция для отправки кадра с видеопотока на сервер
function sendFrame(videoElement) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const newWidth = 224;
    const newHeight = 224;


    context.drawImage(videoElement, 0, 0, newWidth, newHeight);

    // Преобразовываем изображение в base64 строку
    const imageData = canvas.toDataURL('image/jpeg');
    
    // Отправляем изображение на сервер
    sendData(imageData);
}

// Обработчик события при открытии WebSocket соединения
socket.onopen = function(event) {
    console.log('WebSocket connection opened.');
};

// Обработчик события при получении сообщения от сервера
socket.onmessage = function(event) {
    console.log('Received message from server:', event.data);
    // Обновляем интерфейс на основе ответа от сервера
    updateInterface(event.data);
};

// Обработчик события при возникновении ошибки
socket.onerror = function(error) {
    console.error('WebSocket error:', error);
};

// Обработчик события при закрытии WebSocket соединения
socket.onclose = function(event) {
    console.log('WebSocket connection closed.');
};

// Функция для обновления интерфейса на основе ответа от сервера
function updateInterface(responseData) {
    // Реализация логики обновления интерфейса на основе данных от сервера
    // Пример:
    // document.getElementById('result').innerText = responseData;
}

// Начинаем работу с веб-камерой
//export {startWebcam}
