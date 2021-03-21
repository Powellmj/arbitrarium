import { RECEIVE_FOOD, RECEIVE_ALL_FOODS, REMOVE_FOOD } from '../actions/food_actions';

const initialState = {};

const foods_reducer = (state = initialState, action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_ALL_FOODS:
      return Object.assign({}, state, action.foods);
    case RECEIVE_FOOD:
      return Object.assign({}, state, { [action.food._id]: action.food })
    case REMOVE_FOOD:
      let newState = Object.assign({}, state)
      delete newState[action.foodId]
      return newState
    default:
      return state;
  }
}

export default foods_reducer