import { addSearchButton } from "./search.js";
import { startWebcam, disconnectFromSocket, getKeyWords } from "./gastrualApi.js";

const stopRecordButton = document.querySelector(".stop-record");
const startRecordButton = document.querySelector(".start-record");

const createTag = (name)=>{
    const tagTemplate = document.getElementById("tag");
    const newTag = document.importNode(tagTemplate.content.querySelector("li"), true);
    const title = newTag.querySelector(".tag-name");
    title.textContent = name;
    return newTag;
}

/*const getKeyWords = ()=>{
    const listTags = ["потеря", "паспорт"];
    return listTags;
}*/

const addNewTags =  ()=>{
    const input = document.querySelector('.search-input');
    const tagList = document.querySelector(".tag-list");
    const tagNames = getKeyWords();
    tagNames.forEach((name) => {
        const tag =createTag(name);
        tagList.appendChild(tag);
        input.value += name + " ";
    })
    addDeleteTagButton();
};

const changeIndicator = (buttonName)=>{
    const indicator = document.querySelector(".indicator");
    if(indicator.classList.contains("red") && buttonName == "start"){
        indicator.classList.replace("red", "green")
        indicator.src = "/img/greenDot.svg";
    }else{
        indicator.classList.replace("green", "red")
        indicator.src = "/img/redDot.svg";
    }
}

const stopButton = ()=>{
    const button ="stop";
    addNewTags();
    changeIndicator(button);
    disconnectFromSocket();
}

const startButton = ()=>{
    const button ="start";
    startWebcam();
    changeIndicator(button);
}



const removeGastrualSearch = ()=>{
    document.removeEventListener('click', addNewTags);
}

const removeAllTags = ()=>{
    const tagList = document.querySelector(".tag-list");
    tagList.innerHTML = "";
}

const addDeleteTagButton = ()=>{
    const input = document.querySelector('.search-input');
    const deliteTags = document.querySelectorAll(".delete-tag");

    deliteTags.forEach((deleteButton)=>{
      deleteButton.addEventListener("click", (evt)=>{
        const tag = evt.target.parentNode;
        const tagList = document.querySelector(".tag-list");
        const name = tag.querySelector(".tag-name").textContent;
        const newValue = input.value.replace(name, "");
        input.value = newValue;
        tagList.removeChild(tag);
      })
    })
}

const addGastrualSearch = ()=>{
    addSearchButton(document.querySelector(".search-popup"));
    startRecordButton.addEventListener("click", startButton)
    stopRecordButton.addEventListener("click",stopButton)
}

export {addGastrualSearch, removeGastrualSearch, removeAllTags}