import { combineReducers } from 'redux';
import authReducer from './authentication/reducers';

const rootReducers = combineReducers({
  auth: authReducer,
});

export default rootReducers;
