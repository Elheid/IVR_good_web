// это должно быть временная штука ддля проверки идеи

const createRes = (result)=>{
    const template = document.querySelector('#result').content;
    const res = document.importNode(template, true);
    const gif = res.querySelector("img");
    const text = res.querySelector(".manual-text");
    const cardTitle = res.querySelector(".card-title");
    cardTitle.classList.remove("card-title");
    cardTitle.classList.add("res-title");
    cardTitle.textContent = result.title; 
    gif.src = result.gifLink;//"img/gastrual2.jpg";
    text.textContent = result.description;

    const popup = document.getElementById("popup");
    if (result.additionIds !== null)
    {
        popup.setAttribute("addition-info-id", result.additionIds);

    }
    else
        popup.setAttribute("addition-info-id", null);
    return res;
}

const infoRes = (info)=>{
    const template = document.querySelector('#result').content;
    const res = document.importNode(template, true);
    const gif = res.querySelector("img");
    const text = res.querySelector(".manual-text");
    //text.classList.remove("manual-text");
    //text.classList.add("info-text");
    text.parentNode.classList.remove("manual");
    text.parentNode.classList.add("info-manual");
    const cardTitle = res.querySelector(".card-title");
    const button = res.querySelector("button");
    button.innerHTML = "";
    cardTitle.textContent = info.title; 
    gif.src = info.gifLink;
    text.textContent = info.description;
    return res;
}

const createPlayButton = ()=>{
    var playButton = document.createElement('img');
    playButton.classList.add('play-button');
    playButton.src = 'img/play2.png';
    return playButton;
}

const createVidContainer = ()=>{
    var videoOverlay = document.createElement('div');
    videoOverlay.classList.add('video-overlay');

    // Создаем img элемент для кнопки воспроизведения


    // Создаем video элемент
    var videoElement = document.createElement('video');
    videoElement.classList.add('gif');
    videoElement.src = ''; 

    // Добавляем атрибут playsinline
    videoElement.setAttribute('playsinline', true);
    videoElement.muted = true

    //videoOverlay.appendChild(createPlayButton());

    videoOverlay.appendChild(videoElement);
    return videoOverlay;
}

const createClearLangCard = (cardParent, title, count)=>{

    cardParent.children[0].classList.add("clear-card");
    const card = cardParent.querySelector("button");
    /*var cardTitle = document.createElement('p');
    cardTitle.classList.add('title');
    cardTitle.trxtContent = title;*/
    const cardTitle = card.querySelector('.card-title');
    cardTitle.textContent = title;



    var arrow = document.createElement('img');
    arrow.classList.add('arrow-img');
    arrow.src = "/img/arrow.svg"; 

    card.appendChild(cardTitle);

    if(cardParent.classList.contains("catalog-card")){
        var countServices = document.createElement('p');
        countServices.classList.add('count-services');
        countServices.textContent = count + " услуг";
        card.appendChild(countServices);
    }

    card.appendChild(arrow);
    return cardParent;
}


const createCatalogCard = (catalog, clearLanguage)=>{
    const catalogTemplate = document.querySelector('#catalog-template').content.querySelector('li');
    var cardCatalog = document.importNode(catalogTemplate, true);

    const cardTitle = cardCatalog.querySelector('.card-title');
    //const imgOrGif = cardCatalog.querySelector('img.catalog-gif');

   
    if (!(clearLanguage)){
        //imgOrGif.classList.add("hidden");
        //cardCatalog.appendChild(createVidContainer());
        const cardButton = cardCatalog.querySelector(".card-button");
        cardButton.appendChild(createVidContainer());
        const vidOrGif = cardCatalog.querySelector('video.gif');
        vidOrGif.src = catalog.gifPreview;
        cardTitle.textContent = catalog.title;
    }
    else{
        var clearCard = createClearLangCard(cardCatalog, catalog.title, catalog.itemsInCategoryIds.length);
        //cardTitle.textContent = catalog.title + " " + catalog.itemsInCategoryIds.length + " услуг";
        //imgOrGif.src = "img/clear.jpg";
        cardCatalog = (clearCard);
    }

    
    cardCatalog.setAttribute("catalog-id", catalog.id);
    return cardCatalog;
};


const createServiceCard = (service, clearLanguage)=>{
    const serviceTemplate = document.querySelector('#service-template').content.querySelector('li');
    var cardService = document.importNode(serviceTemplate, true);
    const cardTitle = cardService.querySelector('.card-description');
    //const imgOrGif = cardService.querySelector('img.service-gif');

    if (!(clearLanguage)){
        //cardService.appendChild(createVidContainer());
        const cardButton = cardService.querySelector(".card-button");
        cardButton.appendChild(createVidContainer());
        const vidOrGif = cardService.querySelector('video.gif');
        vidOrGif.src = service.gifPreview;
    }
    else{
        //imgOrGif.src = "img/clear.jpg";
        var clearCard = createClearLangCard(cardService, service.title, 
            service.itemsInCategoryIds ? service.itemsInCategoryIds.length : 0);
        //cardTitle.textContent = catalog.title + " " + catalog.itemsInCategoryIds.length + " услуг";
        //imgOrGif.src = "img/clear.jpg";
        cardService = (clearCard);
    }

    cardTitle.textContent = service.title;
    cardService.setAttribute("service-id", service.id);


    const nextButton = cardService.querySelector(".service-button");

    nextButton.addEventListener("click", (evt)=>{
    //const serviceName = evt.target.parentNode.querySelector(".card-description").textContent;
    const serviceId = evt.target.parentNode.parentNode.getAttribute("service-id");
    window.location.href = `result.html?serviceId=${encodeURIComponent(serviceId)}`;
    })
    return cardService;
};

const createInfoCard = (info)=>{
    const infoTemplate = document.querySelector('#additional-info').content.querySelector('li');

    const infoCard = document.importNode(infoTemplate, true);
    const cardTitle = infoCard.querySelector('.card-description');
    const imgOrGif = infoCard.querySelector('.info-gif');


    imgOrGif.src = info.gifPreview;
    cardTitle.textContent = info.title;
    infoCard.setAttribute("info-id", info.id);
    return infoCard;
};


const createGoButtons = ()=>{


    const listOfCards = document.querySelectorAll(".list-of-cards");
    const catalog = document.querySelector(".catalogs");
    const twoInRow = document.querySelector(".two-in-row");
    const oneInRow = document.querySelector(".one-in-row");
    if (!catalog.classList.contains("clear-language")){
        oneInRow.addEventListener("click", ()=>{
            listOfCards.forEach((card)=> card.classList.add("list"));
        })
        twoInRow.addEventListener("click", ()=>{
            listOfCards.forEach((card)=> card.classList.remove("list"));
        })
    }else{
        twoInRow.classList.add("hidden");
        oneInRow.classList.add("hidden");
    }
}



export {createRes, createGoButtons, createServiceCard, createCatalogCard, createInfoCard, infoRes}