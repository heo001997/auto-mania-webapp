import { combineReducers } from '@reduxjs/toolkit';
import devicesReducer from './slices/devicesSlice';
import datasetsReducer from './slices/datasetsSlice';
import workflowsReducer from './slices/workflowsSlice';

const rootReducer = combineReducers({
  devices: devicesReducer,
  datasets: datasetsReducer,
  workflows: workflowsReducer,
});

export default rootReducer;
