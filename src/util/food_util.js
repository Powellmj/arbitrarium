import axios from 'axios';

export const createFood = food => {
  return axios.post('/foods/', food);
};

export const createManyFoods = food => {
  return axios.post('/foods/index/', food);
};


export const updateFood = food => {
  return axios.patch('/foods/update', food);
};

export const fetchAllFoods = () => {
  return axios.get(`/foods/index/`);
};

export const fetchFood = foodId => {
  return axios.get(`/foods/show/${foodId}`);
};

export const deleteFood = foodId => {
  return axios.delete(`/foods/${foodId}`);
};