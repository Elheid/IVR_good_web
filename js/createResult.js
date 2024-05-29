import { createRes } from "./main/createrObj.js";
import { hideSkeletonAndReplace } from "./skeletons/skeletonResult.js";

const moveInfoButton = ()=>{
    const addInfoButton = document.querySelector(".additional-info");
    const container = document.querySelector(".true-manual");
    const width = (window.innerWidth - container.offsetWidth)/2;
    addInfoButton.style.right = `calc(${width}px - 4%)`;
}

const showRes = (obj, isClear=false)=>{
    const list = document.querySelector(".true-manual");
    list.appendChild(createRes(obj, isClear));
    hideSkeletonAndReplace();
    moveInfoButton();   
    window.addEventListener('resize', moveInfoButton);
}

export {showRes}