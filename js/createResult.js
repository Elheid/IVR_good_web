import { createRes } from "./main/createrObj.js";

const showRes = (obj)=>{
    const list = document.querySelector(".manual-strp");
    list.appendChild(createRes(obj));
}

export {showRes}