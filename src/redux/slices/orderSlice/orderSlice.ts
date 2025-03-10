import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { type OrderType } from '../../../services/apiOrder';

export interface OrderSliceType {
  selectedOrder: OrderType | {};
  customerOrders: OrderType[] | [];
}

export const initialState: OrderSliceType = {
  selectedOrder: {},
  customerOrders: [],
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setCustomerOrders: (state, action: PayloadAction<OrderType[]>) => {
      state.customerOrders = action.payload;
    },
    setSelectedOrder: (state, action: PayloadAction<OrderType>) => {
      state.selectedOrder = action.payload;
    },
    resetOrderSlice: (state) => {
      state.selectedOrder = initialState.selectedOrder;
      state.customerOrders = initialState.customerOrders;
    },
  },
});

export const { setCustomerOrders, setSelectedOrder, resetOrderSlice } =
  orderSlice.actions;

export default orderSlice.reducer;
