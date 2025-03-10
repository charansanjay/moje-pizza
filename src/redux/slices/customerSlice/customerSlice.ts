import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CustomerType } from '../../../services/apiCustomer.ts';

export interface CustomerSliceType {
  customerData: CustomerType | {};
}

export const initialState: CustomerSliceType = {
  customerData: {},
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomer: (state, action: PayloadAction<CustomerType>) => {
      state.customerData = action.payload;
    },
    resetCustomerSlice: (state) => {
      state.customerData = initialState.customerData;
    },
  },
});

export const { setCustomer, resetCustomerSlice } = customerSlice.actions;

export default customerSlice.reducer;
