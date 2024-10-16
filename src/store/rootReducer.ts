import { combineReducers } from '@reduxjs/toolkit';
import devicesReducer from './slices/devicesSlice';
import datasetsReducer from './slices/datasetsSlice';
import workflowsReducer from './slices/workflowsSlice';
import runnersReducer from './slices/runnersSlice';
const rootReducer = combineReducers({
  devices: devicesReducer,
  datasets: datasetsReducer,
  workflows: workflowsReducer,
  runners: runnersReducer,
});

export default rootReducer;
