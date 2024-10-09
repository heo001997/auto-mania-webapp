import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SerializableDataset } from '@/types/Dataset';

const datasetsSlice = createSlice({
  name: 'datasets',
  initialState: {
    datasets: [] as SerializableDataset[],
  },
  reducers: {
    setDatasets: (state, action: PayloadAction<SerializableDataset[]>) => {
      state.datasets = action.payload;
    },
    addDataset: (state, action: PayloadAction<SerializableDataset>) => {
      state.datasets.push(action.payload);
    },
    updateDataset: (state, action: PayloadAction<SerializableDataset>) => {
      const index = state.datasets.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.datasets[index] = action.payload;
      }
    },
    deleteDataset: (state, action: PayloadAction<number>) => {
      state.datasets = state.datasets.filter(d => d.id !== action.payload);
    },
  },
});

export const { setDatasets, addDataset, updateDataset, deleteDataset } = datasetsSlice.actions;
export default datasetsSlice.reducer;
