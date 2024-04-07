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
    "Снилс":["Круг заявителей",
        "Перечень документов",
        "Срок предоставления",
        "Госпошлина"],
    "Судимость":["За пределами РФ",
        "На территории РФ"],
    "ИНН":["Круг заявителей",
        "Перечень документов",
        "Срок предоставления",
        "Госпошлина"]
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



const createIdForCatalog = idCreater();
const createIdForService = idCreater();

const emptyGifURL = "img/ratherGIF.jpg";
const emptyForClear = "img/clear.jpg";


const createCatalog = () => ({
    id: createIdForCatalog(), //любое число
    title:getRandomArrayElement(ARR_OF_TITLES),
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

  export {createCatalog, createService, getAllServices};