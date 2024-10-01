import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Device } from '@/types/Device';

const devicesSlice = createSlice({
  name: 'devices',
  initialState: {
    devices: <Device[]>[],
    currentDevice: <Device>{},
  },
  reducers: {
    setCurrentDevice: (state, action: PayloadAction<Device>) => {
      state.currentDevice = action.payload;
      // Save current device to localStorage
      localStorage.setItem('currentDevice', JSON.stringify(action.payload));
      console.log("Current device: ", action.payload)
    },
    addDevice: (state, action: PayloadAction<Device>) => {
      const deviceExists = state.devices.some(device => device.id === action.payload.id);
      if (!deviceExists) {
        state.devices.push(action.payload);
        console.log("Add device: ", action.payload);
      }
    },
    removeDevice: (state, action: PayloadAction<string>) => {
      state.devices = state.devices.filter(a => a.id !== action.payload);
    },
  },
});

export const { setCurrentDevice, addDevice, removeDevice } = devicesSlice.actions;
export default devicesSlice.reducer;
