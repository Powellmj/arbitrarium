import * as APIUtil from '../util/food_util';

export const RECEIVE_FOOD = "RECEIVE_FOOD";
export const RECEIVE_ALL_FOODS = "RECEIVE_ALL_FOODS";
export const REMOVE_FOOD = "REMOVE_FOOD";

export const receiveFood = food => ({
  type: RECEIVE_FOOD,
  food
});

export const receiveAllFoods = foods => ({
  type: RECEIVE_ALL_FOODS,
  foods
});

export const removeFood = foodId => ({
  type: REMOVE_FOOD,
  foodId
});

export const requestFood = foodId => dispatch => APIUtil.fetchFood(foodId)
  .then(food => (
    dispatch(receiveFood(food.data))
  ))

export const requestAllFoods = () => dispatch => APIUtil.fetchAllFoods()
  .then(foods => {
    let foodsObj = {}
    foods.data.forEach(food => {
      foodsObj[food._id] = food
    })
    dispatch(receiveAllFoods(foodsObj))
  })

export const createFood = food => dispatch => (
  APIUtil.createFood(food).then((response) => {
    dispatch(receiveFood(response.data))
  }
  // , err => (
  //   dispatch(receiveErrors(err.response.data))
  // )
  )
)

export const createManyFoods = food => dispatch => (
  APIUtil.createManyFoods(food).then((response) => {
    dispatch(requestAllFoods())
  }
    // , err => (
    //   dispatch(receiveErrors(err.response.data))
    // )
  )
)

export const updateFood = food => dispatch => (
  APIUtil.updateFood(food).then((response) => {
    dispatch(receiveFood(response.data))
  }
    // , err => (
    //   dispatch(receiveErrors(err.response.data))
    // )
  )
)

export const deleteFood = foodId => dispatch => {
  APIUtil.deleteFood(foodId);
  return dispatch(removeFood(foodId));
}