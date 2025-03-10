import { configureStore } from '@reduxjs/toolkit';

import cartReducer from './slices/cartSlice/cartSlice.ts';
import addressReducer from './slices/addressSlice/addressSlice.ts';
import orderReducer from './slices/orderSlice/orderSlice.ts';
import customerReducer from './slices/customerSlice/customerSlice.ts';
import authReducer from './slices/authSlice/authSlice.ts';
import settingsReducer from './slices/settingsSlice/settingsSlice.ts';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    customer: customerReducer,
    address: addressReducer,
    order: orderReducer,
    auth: authReducer,
    settings: settingsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
