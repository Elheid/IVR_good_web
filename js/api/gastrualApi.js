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

let canvas = null;
let context = null;

const frames_arr = [];  // Array to collect frames
const frames_pac = 4;   // Number of frames to batch before sending

const startWebcam = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            const videoInst = document.getElementById("videoInst");
            videoInst.srcObject = stream;
            videoInst.classList.add("stream");

            // Initialize canvas once for reusability
            if (!canvas) {
                canvas = document.createElement('canvas');
                context = canvas.getContext('2d');
                canvas.width = 224;
                canvas.height = 224;
            }
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

const onReceiveText = (text)=>{
    processMessage(text);
}

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
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL('image/jpeg', 0.5);
    frames_arr.push(data);

    // Log the current size of the frames_arr
    console.log(`Current size of frames_arr: ${frames_arr.length}`);

    if (frames_arr.length === frames_pac) {
        console.log(`Emitting ${frames_arr.length} frames to the server.`);
        socket.emit('data', frames_arr);
        frames_arr.length = 0;  // Clear the array
        console.log("frames_arr has been cleared after emitting.");
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
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