import { addSearchButton } from "./search.js";
import { addNewTags } from "./keyWords.js";
import { startWebcam, disconnectFromSocket, getKeyWords } from "./gastrualApi.js";

const stopRecordButton = document.querySelector(".stop-record");
const startRecordButton = document.querySelector(".start-record");
let tagNames = [];



/*const getKeyWords = ()=>{
    const listTags = ["потеря", "паспорт"];
    return listTags;
}*/



const changeIndicator = (buttonName)=>{
    const indicator = document.querySelector(".indicator");
    if(indicator.classList.contains("red") && buttonName == "start"){
        indicator.classList.replace("red", "green")
        indicator.src = "/img/greenDot.svg";
    }
    if(indicator.classList.contains("green") && buttonName == "stop"){
        indicator.classList.replace("green", "red")
        indicator.src = "/img/redDot.svg";
    }
}

const stopButton = ()=>{
    const button ="stop";
    //addNewTags();
    tagNames = [];
    changeIndicator(button);
    disconnectFromSocket();
}

const startButton = ()=>{
    tagNames = getKeyWords();
    const button ="start";
    startWebcam();
    changeIndicator(button);
}



const removeGastrualSearch = ()=>{
    document.removeEventListener('click', addNewTags);
    startRecordButton.removeEventListener("click", startButton)
    stopRecordButton.removeEventListener("click",stopButton)
}

const removeAllTags = ()=>{
    const tagList = document.querySelector(".tag-list");
    tagList.innerHTML = "";
}


const addGastrualSearch = ()=>{
    addSearchButton(document.querySelector(".search-popup"));
    startRecordButton.addEventListener("click", startButton)
    stopRecordButton.addEventListener("click",stopButton)
}

export {addGastrualSearch, removeGastrualSearch, removeAllTags}