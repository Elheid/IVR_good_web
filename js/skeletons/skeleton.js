//import { createGastrualSkeleton } from "../createrObj.js";

const determineSkeleton = ()=>{
    const catalog = document.querySelector(".catalogs")
    const skeletons = document.querySelectorAll('.skeleton');
    let language = catalog.classList.contains("clear-language") ? "clear" : "gastrual"
    if(language === "clear"){
        return skeletons[1];
    }else{
        return skeletons[0];
    }
}
const addSkeletons = ()=>{

    document.addEventListener('DOMContentLoaded', () => {
        const skeleton = determineSkeleton();
        if(skeleton.classList.contains("hidden")){
            skeleton.classList.remove("hidden")
        }
        var urlParams = window.location.search;
        const state = (urlParams.match('catalog')) ? 'services' :  'catalogs';
        const classToReplace = state;
        
        //const list = skeleton.querySelector("ul")
        const elementToReplace = document.querySelector(`.${classToReplace}`);
        
        elementToReplace.classList.add("hidden");
        /*const countOfReplace = 2;
        const fragmentToAppend = createGastrualSkeleton(countOfReplace);
        list.appendChild(fragmentToAppend);*/
        // Симулируем загрузку данных с помощью setTimeout
        // Скрываем скелетон и показываем настоящий контент
    });
}

const hideSkeletonsAndReplace = (classToReplace)=>{
    const skeleton = determineSkeleton();
    const elementToReplace = document.querySelector(`.${classToReplace}`);
    skeleton.classList.add("hidden");
    elementToReplace.classList.remove("hidden");
}

export {addSkeletons, hideSkeletonsAndReplace}