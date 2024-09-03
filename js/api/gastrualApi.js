import { addNewTags } from "../keyWords.js";
import { config } from "../../config.js";

const interval = 1000 / 30;
let intervalId;
let keyWords = [];

const socketURL = config.apiGesturalUrl;
const socket = io(socketURL, {
    path: '/rsl-filter/socket.io/',
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionAttempts: 10,
    extraHeaders: {
        "ngrok-skip-browser-warning": "true"
    }
});

const startWebcam = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            const videoInst = document.getElementById("videoInst");
            videoInst.srcObject = stream;
            videoInst.classList.add("stream");
        })
        .catch(err => {
            console.error('Error accessing webcam:', err);
        });
};

const stopWebcam = () => {
    const videoInst = document.getElementById("videoInst");
    const stream = videoInst.srcObject;
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    videoInst.pause();
    videoInst.srcObject = null;
    videoInst.classList.remove("stream");
};

const onConnectToModal = () => {
    console.log("Connected to socket");
    keyWords = [];
};

const onDisconnectToModal = () => {
    console.log("Disconnected from socket");
};

const processMessage = (text) => {
    const results = Object.values(JSON.parse(text));
    if (!prevResults.includes(text)) {
        prevResults.push(text);
        results.forEach(result => {
            if (!prevWords.includes(result)) {
                keyWords.push(result);
                prevWords.push(result);
            }
        });
    }
    addNewTags(keyWords);
};

const startSendingData = (videoElement) => {
    if (intervalId) clearInterval(intervalId);

    intervalId = setInterval(() => {
        if (socket.connected) {
            addFrameSender(videoElement);
        }
    }, interval);
};

const stopSendingData = () => {
    clearInterval(intervalId);
};

const startRecord = () => {
    connectToSocket();
    const videoInst = document.getElementById("videoInst");
    videoInst.play();
    startSendingData(videoInst);
};

const addFrameSender = (videoElement) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const frames_arr = [];
    const frames_pac = 4;

    const newWidth = 224;
    const newHeight = 224;

    canvas.width = newWidth;
    canvas.height = newHeight;

    context.drawImage(videoElement, 0, 0, newWidth, newHeight);
    const data = canvas.toDataURL('image/jpeg', 0.5);
    frames_arr.push(data);

    if (frames_arr.length === frames_pac) {
        socket.emit('data', frames_arr);
        frames_arr.length = 0;  // Clear the array
    }

    context.clearRect(0, 0, newWidth, newHeight);
};

const connectToSocket = () => {
    socket.on("send_not_normalize_text", onReceiveText);
    socket.on("message", onReceiveText);
    socket.on("connect", onConnectToModal);
    socket.on("disconnect", onDisconnectToModal);
    socket.connect();
};

const disconnectFromSocket = () => {
    socket.disconnect();

    socket.off("connect", onConnectToModal);
    socket.off("disconnect", onDisconnectToModal);
    socket.off("message", onReceiveText);
    socket.removeAllListeners();

    prevWords.length = 0;
    prevResults.length = 0;

    stopSendingData();
};

const getKeyWords = () => keyWords;

export { startRecord, startWebcam, stopWebcam, disconnectFromSocket, getKeyWords };