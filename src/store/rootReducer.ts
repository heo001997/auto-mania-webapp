import { combineReducers } from '@reduxjs/toolkit';
import devicesReducer from './slices/devicesSlice';
import datasetsReducer from './slices/datasetsSlice';

const rootReducer = combineReducers({
  devices: devicesReducer,
  datasets: datasetsReducer,
});

export default rootReducer;
