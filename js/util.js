//const ARR_OF_TITLES = ["Паспорт", "Снилс", "ИНН","Судимость"];
const ARR_OF_SERVICES= {
    "Паспорт":[
    "Достижение 14 лет",
    "Достижение 20 лет/Достижение 45 лет",
    "Изменились персональные данные",
    "Изменение внешности",
    "Непригодность паспорта",
    
    "Опечатка в паспорте",
    "Паспорт украден/утерян",
    "Смена пола"],
    "СНИЛС":["Круг заявителей",
        "Перечень документов",
        "Срок предоставления",
        "Госпошлина"],
    "Судимость":["За пределами РФ",
        "На территории РФ"],
    "ИНН":["Круг заявителей",
        "Перечень документов",
        "Срок предоставления",
        "Госпошлина",
        "Смена ИНН"]
};
const ARR_OF_TITLES = Object.keys(ARR_OF_SERVICES);
const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];
const getRandomInteger = (a, b) => {
    const lower = Math.ceil(Math.min(a, b));
    const upper = Math.floor(Math.max(a, b));
    const result = Math.random() * (upper - lower + 1) + lower;
    return Math.floor(result);
};
const idCreater = () =>{
    let lastGeneratedId = 0;
  
    return function () {
      lastGeneratedId += 1;
      return lastGeneratedId;
    };
};



const instructionCategory = `
    Введите/измените название категории в соответствующее поле.
    Вставьте/измените ссылку на иконку-превью в формате SWG (для простого языка) или загрузите файл и нажмите кнопку "Получить ссылку файла". Ссылка появится в соответствующем поле.
    Вставьте/измените ссылку на видео-превью в формате MP4 (для жестового языка) или загрузите файл и нажмите кнопку "Получить ссылку файла". Ссылка также появится в соответствующем поле.
    Нажмите на кнопку "Добавить/Изменить".
Не забудьте прочитать инструкцию еще раз для более точного выполнения действий.

Если вы хотите удалить категорию, то нажмите на кнопку "корзина", расположенную в правом верхнем углу карточки. Затем в появившемся окне введите название выбранного объекта, которое вы хотите удалить.
`
const instructionSubCategory = `
    Введите/измените название подкатегории в соответствующее поле.
    Вставьте/измените ссылку на иконку-превью в формате SWG (для простого языка) или загрузите файл и нажмите кнопку "Получить ссылку файла". Ссылка появится в соответствующем поле.
    Вставьте/измените ссылку на видео-превью в формате MP4 (для жестового языка) или загрузите файл и нажмите кнопку "Получить ссылку файла". Ссылка также появится в соответствующем поле.
    Нажмите на кнопку "Добавить/Изменить".
Не забудьте прочитать инструкцию еще раз для более точного выполнения действий. 

Если вы хотите удалить подкатегорию, то нажмите на кнопку "корзина", расположенную в правом верхнем углу карточки. Затем в появившемся окне введите название выбранного объекта, которое вы хотите удалить.
`

const instructionService = `
    Проверьте, что выбрана правильная категория (родительская карточка) для добавления/изменения услуги.
    Введите/измените название услуги в соответствующем поле.
    Добавьте/измените ссылку на иконку-превью в формате SWG (для простого языка) или загрузите файл и нажмите "Получить ссылку файла". Ссылка появится в соответствующем поле.
    Вставьте/измените ссылку на видео-превью в формате MP4 (для жестового языка) или загрузите файл и нажмите "Получить ссылку файла". Ссылка также появится в соответствующем поле.
    Добавьте/измените ссылку на видео-описание в формате MP4 (для жестового языка) или загрузите файл и нажмите "Получить ссылку файла". Ссылка также появится в соответствующем поле.
    Предоставьте/измените текстовое описание услуги.
    Если требуется иконка для определенного раздела текста, вставьте ссылку на иконку в формате SWG или загрузите файл и нажмите "Получить ссылку файла". Иконка будет отображаться рядом с текстом, который вы введете выше.
Примечание: для каждого нового текстового блока можно добавить только одну иконку. Чтобы добавить иконку к каждому новому абзацу, кликните на кнопку "+", чтобы создать новый блок текста и добавить иконку туда. 
    После завершения всех шагов, нажмите кнопку "Добавить/Изменить".
Не забудьте прочитать инструкцию еще раз для более точного выполнения действий.

Если вы хотите удалить услугу, то нажмите на кнопку "корзина", расположенную в правом верхнем углу карточки. Затем в появившемся окне введите название выбранного объекта, которое вы хотите удалить.
`
const instructionInfo = `
    Введите/измените название дополнительной информации в соответствующем поле.
    Добавьте/измените ссылку на иконку-превью в формате SWG (для простого языка) или загрузите файл и нажмите "Получить ссылку файла". Ссылка появится в соответствующем поле.
    Вставьте/измените ссылку на видео-превью в формате MP4 (для жестового языка) или загрузите файл и нажмите "Получить ссылку файла". Ссылка также появится в соответствующем поле.
    Добавьте/измените ссылку на видео-описание в формате MP4 (для жестового языка) или загрузите файл и нажмите "Получить ссылку файла". Ссылка также появится в соответствующем поле.
    Предоставьте/измените текстовое описание услуги.
    Если требуется иконка для определенного раздела текста, вставьте ссылку на иконку в формате SWG или загрузите файл и нажмите "Получить ссылку файла". Иконка будет отображаться рядом с текстом, который вы введете выше.
Примечание: для каждого нового текстового блока можно добавить только одну иконку. Чтобы добавить иконку к каждому новому абзацу, кликните на кнопку "+", чтобы создать новый блок текста и добавить иконку туда. 
    После завершения всех шагов, нажмите кнопку "Добавить/Изменить".
Не забудьте прочитать инструкцию еще раз для более точного выполнения действий.

Если вы хотите удалить дополнительную информацию, то нажмите на кнопку "корзина", расположенную в правом верхнем углу карточки. Затем в появившемся окне введите название выбранного объекта, которое вы хотите удалить.
`;  

const replaceWordsWithSpan = (input)=> {
    // Определяем слова, которые нужно найти
    const wordsToReplace = ['примечание', 'удалить'];
    
    // Создаем регулярное выражение для поиска этих слов
    const regex = new RegExp(wordsToReplace.join('|'), 'gi');
    
    // Заменяем найденные слова на <span class="red-text">слово</span>
    return input.replace(regex, function(matched) {
        return `<span class="red-text">${matched}</span>`;
    });
}
/*
replaceWordsWithSpan(instructionCategory);
replaceWordsWithSpan(instructionSubCategory);
replaceWordsWithSpan(instructionService);
replaceWordsWithSpan(instructionInfo);
*/

const createIdForCatalog = idCreater();
const createIdForService = idCreater();
const createIdForInfo = idCreater();



const titleCreator = idCreater();

const emptyGifURL = "img/ratherGIF.jpg";
const emptyForClear = "img/clear.jpg";
/*
const getTitles = ()=>{
    const id = titleCreator() - 1;
    return ARR_OF_TITLES[id];
}*//*

const createCatalog = () => ({
    id: createIdForCatalog(), //любое число
    title:getTitles(),//getRandomArrayElement(ARR_OF_TITLES),
    img:document.querySelector(".catalogs").classList.contains("clear-language") 
    ? emptyForClear : emptyGifURL
});
const getAllServices = (title)=> { return ARR_OF_SERVICES[title];}


const createService = (title) => ({
    id: createIdForService(), //любое число
    title:title,
    img:document.querySelector(".services").classList.contains("clear-language") 
    ? emptyForClear : emptyGifURL
});

const createInfo = (title) => ({
    id: createIdForInfo(), //любое число
    title:title,
    img:"img/ratherGIF.jpg",
    additionalInfo:"сделай то, не знаю, что"
});*/

const getCellById = (id)=>{
    const catalogs = document.querySelector(".catalogs:not(.skeleton)")
    if (catalogs){
        const catalogCells = catalogs.querySelectorAll('.catalog-card');
        for (const cell of catalogCells){
          const catalogId = cell.getAttribute('catalog-id');
          if (catalogId == id){
            return cell;
          }
        }
    }
    
    const subcatalogs = document.querySelectorAll(".sub-catalogs");
    for (const subcatalog of subcatalogs){
        if(subcatalog){
            const subcatalogCells = subcatalog.querySelectorAll('.catalog-card');
            for (const cell of subcatalogCells){
              const catalogId = cell.getAttribute('catalog-id');
              if (catalogId == id){
                return cell;
              }
            }
        }
    }
    
}

const getAllSubCatalogs = () => {
    const searchParams = new URLSearchParams(window.location.search);
  
    // Массив для хранения всех значений sub-catalog
    const subCatalogs = [];
  
    // Получаем все параметры из запроса URL
    for (const [key, value] of searchParams.entries()) {
        // Проверяем ключ, чтобы убедиться, что это sub-catalog{i}
        if (key.startsWith('sub-catalog')) {
            // Добавляем значение sub-catalog в массив
            subCatalogs.push(value);
        }
    }
  
    return subCatalogs;
}

const getLastParam = ()=>{
    const searchParams = new URLSearchParams(window.location.search);
  
    // Переменные для хранения последнего ключа и значения параметра
    let lastParamKey = null;
    let lastParamValue = null;

    // Получаем все параметры из запроса URL
    for (const [key, value] of searchParams.entries()) {
        // Обновляем последний найденный параметр ключ и значение
        lastParamKey = key;
        lastParamValue = value;
    }
    return lastParamKey;
}

const removeLastQueryParam = () => {
    const searchParams = new URLSearchParams(window.location.search);
  
    // Переменные для хранения последнего ключа и значения параметра
    let lastParamKey = null;
    let lastParamValue = null;

    // Получаем все параметры из запроса URL
    for (const [key, value] of searchParams.entries()) {
        // Обновляем последний найденный параметр ключ и значение
        lastParamKey = key;
        lastParamValue = value;
    }

    // Удаляем последний найденный параметр
    if (lastParamKey) {
        searchParams.delete(lastParamKey);

        // Обновляем URL без перезагрузки страницы
        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        return  newUrl;
    }
}


const findSubCatalogByValue = (valueToFind) => {
    const searchParams = new URLSearchParams(window.location.search);
  
    // Перебираем все параметры в запросе URL
    for (const [key, value] of searchParams.entries()) {
        // Проверяем, является ли текущий ключ `sub-catalog` и соответствует ли его значение искомому
        if (key.startsWith('sub-catalog') && value === valueToFind) {
            return key;
        }
    }
  
    // Если значение не найдено, возвращаем null
    return null;
}



const getLastSubCatalog = ()=>{
    const searchParams = new URLSearchParams(window.location.search);
  
    // Переменная для хранения последнего значения sub-catalog
    let lastSubCatalog = null;
  
    // Получаем все параметры из запроса URL
    for (const [key, value] of searchParams.entries()) {
      // Проверяем ключ, чтобы убедиться, что это sub-catalog{i}
      if (key.startsWith('sub-catalog')) {
          // Присваиваем значение последнего sub-catalog
          lastSubCatalog = value;
      }
    }
    return lastSubCatalog;
}

const getLastSubCatalogName = ()=>{
    const searchParams = new URLSearchParams(window.location.search);
  
    // Переменная для хранения последнего значения sub-catalog
    let lastSubCatalog = null;
  
    // Получаем все параметры из запроса URL
    for (const [key, value] of searchParams.entries()) {
      // Проверяем ключ, чтобы убедиться, что это sub-catalog{i}
      if (key.startsWith('sub-catalog')) {
          // Присваиваем значение последнего sub-catalog
          lastSubCatalog = key;
      }
    }
    return lastSubCatalog;
}

const getPreSubCatalog = () => {
    const searchParams = new URLSearchParams(window.location.search);
  
    // Переменные для хранения последнего и предпоследнего значений sub-catalog
    let lastSubCatalog = null;
    let penultimateSubCatalog = null;
  
    // Получаем все параметры из запроса URL
    for (const [key, value] of searchParams.entries()) {
        // Проверяем ключ, чтобы убедиться, что это sub-catalog{i}
        if (key.startsWith('sub-catalog')) {
            // Обновляем предпоследнее значение на текущее последнее
            penultimateSubCatalog = lastSubCatalog;
            // Обновляем последнее значение на текущее значение параметра
            lastSubCatalog = value;
        }
    }
  
    return penultimateSubCatalog;
}

  const countSubCatalogs = () => {
    const searchParams = new URLSearchParams(window.location.search);
    let count = 0;

    // Итерируем по всем ключам в объекте URLSearchParams
    for (const key of searchParams.keys()) {
        // Проверяем, что ключ начинается с "sub-catalog"
        if (key.startsWith('sub-catalog')) {
            count++;
        }
    }

    return count;
}


const getCellNameById = (id)=>{
    const cell = getCellById(id);
    if (cell){
        const title = cell.querySelector(".card-title");
        return title.innerText;
    }
    return "";
}
const getCatalogId = ()=>{
    const urlParams = window.location.search;
    return new URLSearchParams(urlParams).get('catalog');
}
const getCatalogsNames = ()=>{
    const catalogs = document.querySelector(".list-of-cards.catalogs-list").children;
    const res = [];
    for (let i = 0; i < catalogs.length; i++){
        res.push(catalogs[i].querySelector(".card-title").textContent)
    }
    //catalogs.forEach(catalog=> res.push(catalog.querySelector(".card-title").textContent));
    return res;
}
const getCatalogsId = ()=>{
    const catalogs = document.querySelector(".list-of-cards.catalogs-list").children;
    const res = [];
    for (let i = 0; i < catalogs.length; i++){
        res.push(catalogs[i].getAttribute("catalog-id"))
    }
    //catalogs.forEach(catalog=> res.push(catalog.querySelector(".card-title").textContent));
    return res;
}

/*
const getServicesByCatalog = (cell)=>{
    const title = cell.innerText;
    return getAllServices(title);
}*/


const equalizeSubtitles = ()=>{
    //const container = document.querySelector(`.${list} .list-of-cards:not(.sceleton-list)`)
    var cards = document.querySelectorAll('.substrate');
    var maxHeight = 0;
    
    cards.forEach((card)=> {
    if (card.offsetHeight > maxHeight) {
    maxHeight = card.offsetHeight;
    }
    });
    cards.forEach(function(card) {
    card.style.height = maxHeight > 300 ? "fit-content" :maxHeight + 'px';;
    });
}

const equalizeIconContainers = ()=>{
    //const container = document.querySelector(`.${list} .list-of-cards:not(.sceleton-list)`)
    var containers = document.querySelectorAll('.icon-container');
    var maxHeight = 0;
    
    containers.forEach((icon)=> {
    if (icon.offsetHeight > maxHeight) {
    maxHeight = icon.offsetHeight;
    }
    });
    
    containers.forEach(function(card) {
    card.style.height = maxHeight + 'px';
    });
}

const getParamFromURL = ()=>{
    //const regex = /=(.*?)\?/g;
    //const stateData = urlParams.get('serviceId');
    /*const href = window.location.href;
    const regex = /=(.*?)\&/g;
    let matches = href.match(regex);*/
    const searchParams = new URLSearchParams(window.location.search);
    let paramNames = ['serviceId','language','admin'];
    //const paramState = searchParams.get(paramName);
    const res = [];
    paramNames.forEach((name)=>{
        res.push(searchParams.get(name));
    })
   /* matches.forEach((match)=>{
        res.push(match.replace("?", "").replace("=",""));
    });*/
    return res;
}

const updateMarginButtonsOnList = (list)=>{
    const cards = list.children;
    for (var i = 0; i< cards.length; i++){
        updateMargin(cards[i], cards[i].querySelector(".extended-container"));
    }
}

const updateMargin = (card, container) => {
    if (container){
        if (card.offsetWidth !== 0) {
            const deleteButton = container.querySelector(".delete-button");
            const editButton = container.querySelector(".edit-button");
            const width = (card.offsetWidth - deleteButton.offsetWidth);
            const leftMargin = width/28
            deleteButton.style.marginLeft = `calc(${width - leftMargin}px)`;
            editButton.style.marginLeft = `calc(${leftMargin}px)`;
        }
    }
    const video = card.querySelector("video");
    if (video){
        video.addEventListener('loadeddata', () =>
        {
            updateMargin(card, container);
        })
    }
};

const getCurState = ()=>{
    var urlParams = window.location.search;
    return (urlParams.match('serviceId'))? 'info-cards' : (urlParams.match('catalog')) ? 'services-list' :  'catalogs-list';
}

const isAdmin = ()=>{
    return window.localStorage.getItem("isAdmin") === "true"
}

const tryJsonParse = (value, name)=>{
    let res = '';
    try {
        res = JSON.parse(value)[name];  // Попробуем распарсить как JSON
    } catch (e) {
        res =  value;  
    }
    const undefindCheck = typeof res !== 'undefined';
    return undefindCheck ? res:value;
}

export {/*createCatalog, createService, createInfo, getAllServices,*/
    tryJsonParse,
     getCellById, getCatalogId, getCellNameById,
    equalizeSubtitles, getParamFromURL, equalizeIconContainers, getCatalogsId,
    updateMargin, updateMarginButtonsOnList, getCurState, isAdmin, 
    getLastSubCatalog, countSubCatalogs, getPreSubCatalog, getLastSubCatalogName,
     getAllSubCatalogs, findSubCatalogByValue, removeLastQueryParam, getLastParam,
     instructionCategory, instructionSubCategory, instructionService, instructionInfo, replaceWordsWithSpan};
