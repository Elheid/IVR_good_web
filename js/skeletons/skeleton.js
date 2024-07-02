import { createGastrualSkeleton } from "../main/createrObj.js";

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

const updateSkeletonElementCount  =(count)=>{
        const skeleton = determineSkeleton();
        if(skeleton.classList.contains("hidden")){
            skeleton.classList.remove("hidden")
        }
        const skeletonCount = skeleton.querySelector("ul").children.length;
        const countOfReplace = count - skeletonCount;
        const isClear = skeleton.classList.contains("clear-language");
        const fragmentToAppend = createGastrualSkeleton(countOfReplace, isClear);
        skeleton.querySelector("ul").appendChild(fragmentToAppend);
        // Симулируем загрузку данных с помощью setTimeout
        // Скрываем скелетон и показываем настоящий контент
}

const loadSkeletons = ()=>{
    {
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

    }
}
const addSkeletons = ()=>{
    document.addEventListener('DOMContentLoaded', loadSkeletons);
    const videos = document.querySelectorAll('.video');
    if(videos){
        videos.forEach(video => {
            video.addEventListener('canplaythrough', function() {
                // Находим родительскую карточку и добавляем ей класс 'show'
                loadSkeletons();
            });
        });
    }
}

const hideSkeletonsAndReplace = (classToReplace)=>{
    const skeleton = determineSkeleton();
    const elementToReplace = document.querySelector(`.${classToReplace}`);
    skeleton.classList.add("hidden");
    elementToReplace.classList.remove("hidden");
}

export {addSkeletons, hideSkeletonsAndReplace, updateSkeletonElementCount}