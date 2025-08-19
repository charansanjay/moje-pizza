import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ToastType = {
  message: string;
  type: 'success' | 'error' | 'info';
  disableAutoClose?: boolean;
};

export interface SettingsSliceType {
  toast: ToastType | null;
}

export const initialState: SettingsSliceType = {
  toast: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setToast(state, action: PayloadAction<ToastType | null>) {
      state.toast = action.payload;
    },
    clearToast: (state) => {
      state.toast = null;
    },
    resetSettingsSlice(state) {
      state.toast = initialState.toast;
    },
  },
});

export const { setToast, clearToast, resetSettingsSlice } =
  settingsSlice.actions;

export default settingsSlice.reducer;
