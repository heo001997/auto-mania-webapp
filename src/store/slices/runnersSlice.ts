import { SerializableRunner } from '@/types/Runner';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const runnersSlice = createSlice({
  name: 'runners',
  initialState: {
    runners: [] as SerializableRunner[],
  },
  reducers: {
    setRunners: (state, action: PayloadAction<SerializableRunner[]>) => {
      state.runners = action.payload;
    },
    addRunner: (state, action: PayloadAction<SerializableRunner>) => {
      state.runners.push(action.payload);
    },
    updateRunner: (state, action: PayloadAction<SerializableRunner>) => {
      const index = state.runners.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.runners[index] = action.payload;
      }
    },
    deleteRunner: (state, action: PayloadAction<number>) => {
      state.runners = state.runners.filter(w => w.id !== action.payload);
    },
  },
});

export const { setRunners, addRunner, updateRunner, deleteRunner } = runnersSlice.actions;
export default runnersSlice.reducer;
