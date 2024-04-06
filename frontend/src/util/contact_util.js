import axios from 'axios';

export const createItem = item => {
  return axios.post('/contacts/', item);
};

export const createManyItems = item => {
  return axios.post('/contacts/index/', item);
};

export const updateItem = item => {
  return axios.patch('/contacts/update', item);
};

export const updateManyItems = itemObj => {
  return axios.patch('/contacts/index', itemObj);
};

export const fetchAllItems = () => {
  return axios.get(`/contacts/index/`);
};

export const pushConfig = () => {
  return axios.post(`/contacts/push-config/`);
};

export const fetchItem = itemId => {
  return axios.get(`/contacts/show/${itemId}`);
};

export const deleteItem = itemId => {
  return axios.delete(`/contacts/${itemId}`);
};