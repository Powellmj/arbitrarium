import { combineReducers } from 'redux';
import items from './items_reducer';
import contacts from './contacts_reducer';

const RootReducer = combineReducers({
  items,
  contacts,
});

export default RootReducer;