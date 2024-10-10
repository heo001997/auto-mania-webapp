import { SerializableWorkflow } from '@/types/Workflow';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const workflowsSlice = createSlice({
  name: 'workflows',
  initialState: {
    workflows: [] as SerializableWorkflow[],
  },
  reducers: {
    setWorkflows: (state, action: PayloadAction<SerializableWorkflow[]>) => {
      state.workflows = action.payload;
    },
    addWorkflow: (state, action: PayloadAction<SerializableWorkflow>) => {
      state.workflows.push(action.payload);
    },
    updateWorkflow: (state, action: PayloadAction<SerializableWorkflow>) => {
      const index = state.workflows.findIndex(w => w.id === action.payload.id);
      if (index !== -1) {
        state.workflows[index] = action.payload;
      }
    },
    deleteWorkflow: (state, action: PayloadAction<number>) => {
      state.workflows = state.workflows.filter(w => w.id !== action.payload);
    },
  },
});

export const { setWorkflows, addWorkflow, updateWorkflow, deleteWorkflow } = workflowsSlice.actions;
export default workflowsSlice.reducer;
