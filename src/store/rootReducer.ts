import { combineReducers } from '@reduxjs/toolkit';
import devicesReducer from './slices/devicesSlice';

const rootReducer = combineReducers({
  devices: devicesReducer,
});

export default rootReducer;
