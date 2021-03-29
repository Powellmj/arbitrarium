import axios from 'axios';

export const createItem = item => {
  return axios.post('/items/', item);
};

export const createManyItems = item => {
  return axios.post('/items/index/', item);
};


export const updateItem = item => {
  return axios.patch('/items/update', item);
};

export const updateManyItems = itemObj => {
  return axios.patch('/items/index', itemObj);
};

export const fetchAllItems = () => {
  return axios.get(`/items/index/`);
};

export const fetchItem = itemId => {
  return axios.get(`/items/show/${itemId}`);
};

export const deleteItem = itemId => {
  return axios.delete(`/items/${itemId}`);
};