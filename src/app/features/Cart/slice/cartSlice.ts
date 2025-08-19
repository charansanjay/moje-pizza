import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { type CartType } from '../types';

export interface CartSliceType {
  customerCart: CartType | {};
}

export const initialState: CartSliceType = {
  customerCart: {},
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCustomerCart: (state, action: PayloadAction<CartType>) => {
      state.customerCart = action.payload;
    },
    resetCartItems: (state, action: PayloadAction<CartType>) => {
      state.customerCart = action.payload;
    },
    resetCartSlice: (state) => {
      state.customerCart = initialState.customerCart;
    },
  },
});

export const { setCustomerCart, resetCartItems, resetCartSlice } =
  cartSlice.actions;

export default cartSlice.reducer;
