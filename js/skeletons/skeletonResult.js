const skeleton = document.querySelector('.skeleton');

const addSkeletonRes = ()=>{
    document.addEventListener('DOMContentLoaded', () => {
        var urlParams = window.location.search;
        const lenaguage = (urlParams.match('false')) ? 'gastrual' : "clear";
        const state = "manual-strp"
        const classToReplace = state;
        
        if(skeleton.classList.contains("hidden")){
            skeleton.classList.remove("hidden")
        }
        if(lenaguage === "clear"){
            skeleton.querySelector("img").classList.add("hidden")
        }
        const classes = document.querySelectorAll(`.${classToReplace}`);
        const elementToReplace = classes[1];
        elementToReplace.classList.add("hidden");
    });
}

const hideSkeletonAndReplace = ()=>{
    const classes = document.querySelectorAll(`.manual-strp`);
    const elementToReplace = classes[1];
    skeleton.classList.add("hidden");
    elementToReplace.classList.remove("hidden");
}

export {addSkeletonRes, hideSkeletonAndReplace}