import { addNewTags } from "../keyWords.js";

const interval = 30;
let intervalId;
let keyWords = [];
const socketURL = 'wss://pincode-dev.ru';//'wss://pincode-dev.ru'

const socket = io(socketURL, {
    autoConnect: false,
    'reconnection': true,
    'reconnectionDelay': 500,
    'reconnectionAttempts': 10,
    extraHeaders: {
        "ngrok-skip-browser-warning": "true"
    }
});
const startWebcam = ()=>{
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(((stream) =>{
    const videoInst = document.getElementById("videoInst");
    videoInst.srcObject = stream;
    videoInst.classList.add("stream");
    })).catch((err)=> {
        console.error('Error accessing webcam:', err);
    });;
}

const stopWebcam = ()=>{
    const videoInst = document.getElementById("videoInst");
    videoInst.pause();
    videoInst.srcObject = null;
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(((stream) =>{stream.getTracks()[0].stop();}));
    //videoInst.src = "/img/long.mp4";
    videoInst.classList.remove("stream")
}

const onConnectToModal = ()=>{
    console.log("connect");
    keyWords = [];
}

const onDisconnectToModal = ()=>{
    console.log("disconnect");
}
let prevWords = [];
let prevResults = [];
const processMessage = (text)=>{
    keyWords = [];
    console.log(text);
    const results = Object.values(JSON.parse(text))
    console.log(results)
    if(!(prevResults.indexOf(text) >= 0))
    {
        prevResults.push(text);
        for (var i=0; i < results.length; i++){
            if (!(prevWords.indexOf(results[0]) >= 0)){
                keyWords.push(results[0]);
                prevWords.push(results[0]);
                break;
            }
        }
    }
    addNewTags(keyWords);
}

const onReceiveText = (text)=>{
        processMessage(text);
}

const getKeyWords = ()=>{
    return keyWords;
}


const startSendingData =(videoElement)=>{
    intervalId = setInterval(function() {
        if (socket.connected){
            addFrameSender(videoElement);
        }
    }, interval);
    
}

const stopSendingData = () => {
    clearInterval(intervalId);
};


const startRecord = ()=> {
    //navigator.mediaDevices.getUserMedia({ video: true })
        //.then(((stream) =>{
            connectToSocket();
            //const videoElement = document.getElementById("videoElement");
            //const videoInst = document.getElementById("videoInst");
            //videoInst.srcObject = stream;
           // videoInst.style = "width:552px; height:345px;";
            
            //videoInst.classList.add("hidden")
            videoInst.play();
            startSendingData(videoInst);
        //}))
        //.catch((err)=> {
        //    console.error('Error accessing webcam:', err);
        //});
}

const addFrameSender=(videoElement)=> {
    console.log("Send frame")
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const originalWidth = videoElement.videoWidth;
    const originalHeight = videoElement.videoHeight;
    const aspectRatio = originalWidth / originalHeight;
    let newWidth = 224;
    // let newHeight = newWidth / aspectRatio;
    let newHeight = 224;

    canvas.width = 224;
    canvas.height = 224;

    context?.drawImage(videoElement, 0, (224 - newHeight) / 2, newWidth, newHeight);
    const image = canvas.toDataURL('image/jpeg');
    socket.emit("data", image);

        /*console.log("Send frame");
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
    }*/
}



const connectToSocket= ()=> {

    socket.on("send_not_normalize_text", onReceiveText);
    socket.on("message", onReceiveText);
    socket.on("connect", onConnectToModal);
    socket.on("disconnect", onDisconnectToModal);
    socket.connect()
}



const disconnectFromSocket= ()=> {
    socket.disconnect();

    socket.off("connect", onConnectToModal);
    socket.off("disconnect", onDisconnectToModal);
    socket.off("message", onReceiveText);
    socket.removeAllListeners();

    //const videoElement = document.getElementById("videoElement");

    prevWords = [];
    prevResults = [];
    //videoElement.classList.add("hidden");
    //videoInst.classList.remove("hidden");

    stopSendingData();
}


export {startRecord, startWebcam, stopWebcam, disconnectFromSocket, getKeyWords}
