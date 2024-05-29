import { createRes } from "./main/createrObj.js";

const showRes = (obj, isClear=false)=>{
    const list = document.querySelector(".manual-strp");
    list.appendChild(createRes(obj, isClear));

    const addInfoButton = document.querySelector(".additional-info");
    const container = document.querySelector(".manual");
    const width = (window.innerWidth - container.offsetWidth)/2;
    addInfoButton.style.right = `calc(${width}px - 4%)`;
}

export {showRes}