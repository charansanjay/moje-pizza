import { configureStore } from '@reduxjs/toolkit';

import cartReducer from '../features/Cart/slice/cartSlice.ts';
import addressReducer from '../features/Address/slice/addressSlice.ts';
import orderReducer from '../features/Orders/slice/orderSlice.ts';
import customerReducer from '../shared/slices/customerSlice/customerSlice.ts';
import authReducer from '../features/Authorization/slice/authSlice.ts';
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
