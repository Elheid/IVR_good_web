import { addSearchButton } from "./search.js";
import { addNewTags } from "../keyWords.js";
import { startRecord, disconnectFromSocket, getKeyWords } from "../api/gastrualApi.js";

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

const stopButtonEvent = ()=>{
    stopRecordButton.classList.add("hidden")
    startRecordButton.classList.remove("hidden")
    const button ="stop";
    //addNewTags();
    tagNames = [];
    changeIndicator(button);
    disconnectFromSocket();
}

const startButtonEvent = ()=>{
    stopRecordButton.classList.remove("hidden")
    startRecordButton.classList.add("hidden")
    tagNames = getKeyWords();
    const button ="start";
    startRecord();
    changeIndicator(button);
}



const removeGastrualSearch = ()=>{
    stopButtonEvent();
    document.removeEventListener('click', addNewTags);
    startRecordButton.removeEventListener("click", startButtonEvent)
    stopRecordButton.removeEventListener("click",stopButtonEvent)
}

const removeAllTags = ()=>{
    const tagList = document.querySelector(".tag-list");
    tagList.innerHTML = "";
}


const addGastrualSearch = ()=>{
    stopRecordButton.classList.add("hidden")
    addSearchButton(document.querySelector(".search-popup"));
    startRecordButton.addEventListener("click", startButtonEvent)
    stopRecordButton.addEventListener("click",stopButtonEvent)
}

export {addGastrualSearch, removeGastrualSearch, removeAllTags}