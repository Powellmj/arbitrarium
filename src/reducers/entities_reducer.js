import { combineReducers } from 'redux';
import foods from './foods_reducer';

const RootReducer = combineReducers({
  foods,
});

export default RootReducer;