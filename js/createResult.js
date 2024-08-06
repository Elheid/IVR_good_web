import { createRes, loadHeaderData } from "./main/createrObj.js";
import { hideSkeletonAndReplace } from "./skeletons/skeletonResult.js";

import { addAdminPanel, adminUpdate } from "./adminPanel.js";
import { createForm } from "./form.js";

const addPrevListHeader = ()=>{
    const headerHTML =  JSON.parse(loadHeaderData());

    const header = document.createElement('ul');
    header.innerHTML = headerHTML;
    header.classList.add("header-list")
    const mainHeader = document.querySelector(".main-header");
    mainHeader.appendChild(header);
}

const moveInfoButton = ()=>{
    const addInfoButton = document.querySelector(".additional-info");
    const container = document.querySelector(".true-manual");

    const width = (window.innerWidth - container.offsetWidth)/2;
    addInfoButton.style = `right:calc(${width}px - 4%);`;// top:11%;

    /*const title = document.querySelector("h3");
    const height = window.innerHeight - title.offsetHeight;
    addInfoButton.style.top = `20%;`;*/

    document.querySelector(".hovered-text").style.right = `calc(${width}px - 11%)`;
    document.querySelector(".hovered-text").style.display = "none";
}

const showRes = (obj, isClear=false)=>{
    const list = document.querySelector(".true-manual");
    list.appendChild(createRes(obj, isClear));
    hideSkeletonAndReplace();


    /*var info = document.querySelector('.additional-info');
    info.onmouseover = ()=>{
        document.querySelector(".hovered-text").style.display = 'block';
    }
    info.onmouseout = ()=> {
        document.querySelector(".hovered-text").style.display = 'none';
    }*/



    addPrevListHeader();

    //Убрал админку для прода
    /*addAdminPanel();
    adminUpdate();
    createForm();*/

    //toggleEditResButtons();
    //toggleButtonStateUpdate();


    /*moveInfoButton();   
    window.addEventListener('resize', moveInfoButton);*/

}

export {showRes}