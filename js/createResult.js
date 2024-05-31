import { createRes } from "./main/createrObj.js";
import { hideSkeletonAndReplace } from "./skeletons/skeletonResult.js";

const moveInfoButton = ()=>{
    const addInfoButton = document.querySelector(".additional-info");
    const container = document.querySelector(".true-manual");
    const width = (window.innerWidth - container.offsetWidth)/2;
    addInfoButton.style.right = `calc(${width}px - 4%)`;
    document.querySelector(".hovered-text").style.right = `calc(${width}px - 11%)`;
    document.querySelector(".hovered-text").style.display = "none";
}

const showRes = (obj, isClear=false)=>{
    const list = document.querySelector(".true-manual");
    list.appendChild(createRes(obj, isClear));
    hideSkeletonAndReplace();
    moveInfoButton();   
    window.addEventListener('resize', moveInfoButton);

    var info = document.querySelector('.additional-info');
    info.touchmove = ()=>{
        document.querySelector(".hovered-text").style.display = 'block';
    }
    info.onmouseover = ()=>{
        document.querySelector(".hovered-text").style.display = 'block';
    }
    info.onmouseout = ()=> {
        document.querySelector(".hovered-text").style.display = 'none';
    }
}

export {showRes}