import { combineReducers } from 'redux';
import userReducer from './userReducer';
import squeakReducer from './squeakReducer';
import uiReducer from './uiReducer';

export default combineReducers({
	user : userReducer,
	data : squeakReducer,
	ui   : uiReducer,
});
