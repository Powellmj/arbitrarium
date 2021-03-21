import { combineReducers } from 'redux';
import items from './items_reducer';

const RootReducer = combineReducers({
  items,
});

export default RootReducer;