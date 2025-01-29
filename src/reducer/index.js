import {combineReducers} from 'redux';
import authReducer from '../slices/authSlice';
import cartReducer from '../slices/cartSlice';
import profileReducer from '../slices/profileSlice';

const rootReducer=combineReducers({
    auth:authReducer,
    cart:cartReducer,
    profile:profileReducer,
});

export default rootReducer;