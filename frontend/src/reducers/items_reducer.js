import { RECEIVE_ITEM, RECEIVE_ALL_ITEMS, REMOVE_ITEM } from '../actions/item_actions';

const initialState = {};

const items_reducer = (state = initialState, action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_ALL_ITEMS:
      return Object.assign({}, state, action.items);
    case RECEIVE_ITEM:
      return Object.assign({}, state, { [action.item._id]: action.item })
    case REMOVE_ITEM:
      let newState = Object.assign({}, state)
      delete newState[action.itemId]
      return newState
    default:
      return state;
  }
}

export default items_reducer