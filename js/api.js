//const BASE_URL = 'http://localhost:8080/';
const BASE_URL = 'https://pincode-dev.ru/ivr-good/';
const Route = {
  GET_CATEGORY: 'categories',
  GET_SERVICES: 'items/search/byCategory?categoryId=',
  GET_SERVICE_BY_ID:"items/",
  GET_INFO: 'additions/',
  SEARCH_SERVICE_BY_TITTLE:"items/search?title=",
  SEARCH_SIMILAR_SERVICE:"items/search/similar?title=",
  SEND_DATA: '/',
};
const Method = {
  GET: 'GET',
  POST: 'POST',
};
const ErrorText = {
  GET_DATA: 'Не удалось загрузить данные. Попробуйте изменить запрос',
  SEND_DATA: 'Не удалось отправить форму. Попробуйте ещё раз',
};

const load = (route, errorText, method = Method.GET, body = null, ) =>
  fetch(`${BASE_URL}${route}`, {method, body})
    .then((response) => {
      if (!response.ok) {
        throw new Error();  
      }
      return response.json();
    })
    .catch(() => {
      throw new Error(errorText);
});

const loadById = (route, id, errorText, method = Method.GET, body = null) =>
  fetch(`${BASE_URL}${route}${id}`, {method, body})
    .then((response) => {
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    })
    .catch(() => {
      throw new Error(errorText);
});

/*
const loadToSearch = ( title, errorText, method = Method.GET, body = null) =>
  fetch(`${BASE_URL}items/search?title=${title}`, {method, body})
    .then((response) => {
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    })
    .catch(() => {
      loadToSearchSimilar(title);
});

const loadToSearchSimilar = (title, errorText, method = Method.GET, body = null) =>
  fetch(`${BASE_URL}items/search/similar?title=${title}`, {method, body})
    .then((response) => {
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    })
    .catch(() => {
      throw new Error(errorText);});
*/

const getCategories= () => load(Route.GET_CATEGORY, ErrorText.GET_DATA);
const getService= (id) => loadById(Route.GET_SERVICES, id, ErrorText.GET_DATA);
const getServiceById= (id) => loadById(Route.GET_SERVICE_BY_ID, id, ErrorText.GET_DATA);
const getInfoById= (id) => loadById(Route.GET_INFO, id, ErrorText.GET_DATA);

const getServiceByTitle= (title) => loadById(Route.SEARCH_SERVICE_BY_TITTLE,title, ErrorText.GET_DATA);
const getSimilarService= (title) => loadById(Route.SEARCH_SIMILAR_SERVICE,title, ErrorText.GET_DATA);


const sendData = (body) => load(Route.SEND_DATA, ErrorText.SEND_DATA, Method.POST, body);

export { getCategories, getService, getInfoById, getServiceById, getServiceByTitle, getSimilarService, sendData};
