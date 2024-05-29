import { createRes } from "./main/createrObj.js";
import { hideSkeletonAndReplace } from "./skeletons/skeletonResult.js";

const showRes = (obj, isClear=false)=>{
    const list = document.querySelector(".true-manual");
    list.appendChild(createRes(obj, isClear));
    hideSkeletonAndReplace();

    const addInfoButton = document.querySelector(".additional-info");
    const container = document.querySelector(".true-manual");
    const width = (window.innerWidth - container.offsetWidth)/2;
    addInfoButton.style.right = `calc(${width}px - 4%)`;
}

export {showRes}