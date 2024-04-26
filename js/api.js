const BASE_URL = 'http://localhost:8080/';

const Route = {
  GET_CATEGORY: 'categories',
  GET_SERVICE: 'items/search/byCategory?categoryId=',
  GET_INFO: 'additions/search/item/',
  SEND_DATA: '/',
};
const Method = {
  GET: 'GET',
  POST: 'POST',
};
const ErrorText = {
  GET_DATA: 'Не удалось загрузить данные. Попробуйте обновить страницу',
  SEND_DATA: 'Не удалось отправить форму. Попробуйте ещё раз',
};

const load = (route, errorText, method = Method.GET, body = null) =>
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

const getCategories= () => load(Route.GET_CATEGORY, ErrorText.GET_DATA);
const getService= (id) => loadById(Route.GET_SERVICE, id, ErrorText.GET_DATA);
const getInfo= (id) => loadById(Route.GET_SERVICE, id, ErrorText.GET_DATA);

const sendData = (body) => load(Route.SEND_DATA, ErrorText.SEND_DATA, Method.POST, body);

export { getCategories, getService, getInfo, sendData};
/*
const BASE_URL = 'https://cors-anywhere.herokuapp.com/http://localhost:8080/';

const Route = {
  GET_CATEGORY: '/categories',
  GET_SERVICE: '/items',
  SEND_DATA: '/',
};
const Method = {
  GET: 'GET',
  POST: 'POST',
};
const ErrorText = {
  GET_DATA: 'Не удалось загрузить данные. Попробуйте обновить страницу',
  SEND_DATA: 'Не удалось отправить форму. Попробуйте ещё раз',
};

const load = (route, errorText, method = Method.GET, body = null) =>
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

const getCategories= () => load(Route.GET_CATEGORY, ErrorText.GET_DATA);
const getServices= () => load(Route.GET_SERVICE, ErrorText.GET_DATA);

const sendData = (body) => load(Route.SEND_DATA, ErrorText.SEND_DATA, Method.POST, body);

export { getCategories, getServices, sendData};*/