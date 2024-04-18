var modal = document.getElementById('popup-container'); // Получаем модальное окно
var videoElement = document.getElementById('videoElement'); // Получаем элемент для видеопотока

// Функция, которая запрашивает доступ к веб-камере
const requestWebcam = ()=> {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            // Выводим видеопоток на видеоэлемент
            videoElement.srcObject = stream;
        })
        .catch(function(err) {
            console.error('Ошибка при получении доступа к веб-камере: ', err);
        });
}

// Функция, которая отключает доступ к веб-камере
const releaseWebcam = ()=> {
    var stream = videoElement.srcObject;
    if (stream) {
        var tracks = stream.getTracks();
        tracks.forEach(function(track) {
            track.stop();
        });
        videoElement.srcObject = null;
    }
}
export {releaseWebcam, requestWebcam}