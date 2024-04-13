const nextButton = document.querySelector(".next-button");
const prevButton = document.querySelector(".prev-button");

const giveMoreButton = document.querySelector(".more");
const giveLessButton = document.querySelector(".less");

const description = document.querySelector(".instruction");
const nextWindow = "services.html";
const prevWindow = "index.html";;

const hideText = (element)=>{
    element.style.overflow = 'hidden';
    element.style.whiteSpace = 'nowrap';
}

const showText = (element)=>{
    element.style.overflow = 'visible';
    element.style.whiteSpace = 'normal';
}

nextButton.addEventListener("click", ()=>{
    window.location.href = nextWindow;
})

prevButton.addEventListener("click", ()=>{
    window.location.href = prevWindow;
})

giveMoreButton.addEventListener('click', ()=>{
    showText(description);
    giveMoreButton.style.display = 'none';
    giveLessButton.style.display = '';
});

giveLessButton.addEventListener("click", ()=>{
    hideText(description);
    giveLessButton.style.display = 'none';
    giveMoreButton.style.display = '';
})