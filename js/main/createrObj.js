// это должно быть временная штука ддля проверки идеи

const createRes = ({title, url, manualText})=>{
    const template = document.querySelector('#result').content;
    const res = document.importNode(template, true);
    const gif = res.querySelector("img");
    const text = res.querySelector(".manual-text");
    const cardTitle = res.querySelector(".card-title");
    cardTitle.textContent = title; 
    gif.src = url;
    text.textContent = manualText;
    return res;
}

const infoRes = ({title, url, manualText})=>{
    const template = document.querySelector('#result').content;
    const res = document.importNode(template, true);
    const gif = res.querySelector("img");
    const text = res.querySelector(".manual-text");
    const cardTitle = res.querySelector(".card-title");
    const button = res.querySelector("button");
    button.innerHTML = "";
    cardTitle.textContent = title; 
    gif.src = url;
    text.textContent = manualText;
    return res;
}


const createCatalogCard = (catalog)=>{
    const catalogTemplate = document.querySelector('#catalog-template').content.querySelector('li');
    const cardCatalog = document.importNode(catalogTemplate, true);
    const cardTitle = cardCatalog.querySelector('.card-title');
    const imgOrGif = cardCatalog.querySelector('.catalog-gif');

    imgOrGif.src = catalog.gifLink;
    cardTitle.textContent = catalog.title;
    cardCatalog.setAttribute("catalog-id", catalog.id);
    return cardCatalog;
};


const createServiceCard = (service)=>{
    const serviceTemplate = document.querySelector('#service-template').content.querySelector('li');
    const cardCatalog = document.importNode(serviceTemplate, true);
    const cardTitle = cardCatalog.querySelector('.card-description');
    const imgOrGif = cardCatalog.querySelector('.service-gif');

    imgOrGif.src = service.gifLink;
    cardTitle.textContent = service.title;
    cardCatalog.setAttribute("service-id", service.id);
    cardCatalog.setAttribute("addition-info-ids", service.additionIds);


    const nextButton = cardCatalog.querySelector(".service-button");

    nextButton.addEventListener("click", (evt)=>{
    const serviceName = evt.target.parentNode.querySelector(".card-description").textContent;
    window.location.href = `result.html?serviceName=${encodeURIComponent(serviceName)}`;
    })
    return cardCatalog;
};

const createInfoCard = ({id, title, img})=>{
    const infoTemplate = document.querySelector('#additional-info').content.querySelector('li');

    const infoCard = document.importNode(infoTemplate, true);
    const cardTitle = infoCard.querySelector('.card-description');
    const imgOrGif = infoCard.querySelector('.info-gif');

    imgOrGif.src = img;
    cardTitle.textContent = title;
    infoCard.setAttribute("info-id", id);
    return infoCard;
};


const createGoButtons = ()=>{
    const listOfCards = document.querySelectorAll(".list-of-cards");

    const twoInRow = document.querySelector(".two-in-row");
    const oneInRow = document.querySelector(".one-in-row");
    
    oneInRow.addEventListener("click", ()=>{
        listOfCards.forEach((card)=> card.classList.add("list"));
    })
    twoInRow.addEventListener("click", ()=>{
        listOfCards.forEach((card)=> card.classList.remove("list"));
    })
}



export {createRes, createGoButtons, createServiceCard, createCatalogCard, createInfoCard, infoRes}