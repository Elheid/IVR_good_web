const cardTemplate = document.querySelector('#card-template').content.querySelector('li');
const list = document.querySelector('.list-of-cards');

const emptyGifURL = "img/ratherGIF.jpg";
const emptyForClear = "img/clear.jpg";
const createCard = (newTitle)=>{
    const img = document.querySelector(".services").classList.contains("clear-language") 
    ? emptyForClear : emptyGifURL;
    const cardElement = document.importNode(cardTemplate, true);
    cardElement.querySelector('.service-gif').setAttribute('src', img);
    cardElement.querySelector('.card-description').textContent = newTitle;
    return cardElement;
};


const fillList = (creator, num)=>{
    for (let i = 0; i < num; i++){
        const newElement = creator('NewHeader ' + i);
        list.appendChild(newElement);
    }
}

const initializeResults = (num)=>{
    fillList(createCard, num);
}


export {initializeResults};
