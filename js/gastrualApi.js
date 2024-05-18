import { addNewTags} from "./keyWords.js";
const interval = 30 ;
let intervalId;
let keyWords = [];

const socket = io('wss://pincode-dev.ru', {
    autoConnect: false,
    'reconnection': true,
    'reconnectionDelay': 500,
    'reconnectionAttempts': 10,
    extraHeaders: {
        "ngrok-skip-browser-warning": "true"
    }
});

const onConnectToModal = ()=>{
    console.log("connect");
    keyWords = [];
}

const onDisconnectToModal = ()=>{
    console.log("disconnect");
}

const onReceiveText = (text)=>{
    console.log(text);
    const results = Object.values(JSON.parse(text))
    console.log(results)
    keyWords.push(results[0]);
    addNewTags(keyWords);
}

const getKeyWords = ()=>{
    return keyWords;
}


const startSendingData =(videoElement)=>{
    intervalId = setInterval(function() {
        addFrameSender(videoElement);
    }, interval);
}

const stopSendingData = () => {
    clearInterval(intervalId);
};


const startWebcam = ()=> {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(((stream) =>{
           // connectToSocket();
            const videoElement = document.getElementById("videoElement");
            videoElement.srcObject = stream;
            videoElement.classList.remove("hidden")
            videoElement.onloadedmetadata = (e)=> {
                videoElement.play();
                startSendingData(videoElement);
            };
            document.querySelector(".videoContainer").appendChild(videoElement);
        }))
        .catch((err)=> {
            console.error('Error accessing webcam:', err);
        });
}

const addFrameSender=(videoElement)=> {
        console.log("Send frame");
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        let newWidth = 224;

        canvas.width = 224;
        canvas.height = 224;

        if (context) {
        context.drawImage(videoElement, 0, (0), newWidth, 160);
        context.fillStyle = '#727272';
        context.fillRect(0, 160, newWidth, 224-160); // Нижняя часть
        const image = canvas.toDataURL('image/jpeg');
        socket.emit("data", image);
    }
}



const connectToSocket= ()=> {
    socket.on("send_not_normalize_text", onReceiveText);
    socket.on("message", onReceiveText);
    socket.on("connect", onConnectToModal);
    socket.on("disconnect", onDisconnectToModal);
    socket.connect()
}
connectToSocket();


const disconnectFromSocket= ()=> {
    socket.disconnect();

    socket.off("connect", onConnectToModal);
    socket.off("disconnect", onDisconnectToModal);
    socket.off("message", onReceiveText);
    socket.removeAllListeners();

    const videoElement = document.getElementById("videoElement");
    videoElement.srcObject = null;
    videoElement.classList.add("hidden");
    stopSendingData();
}


export {startWebcam, disconnectFromSocket, getKeyWords}
