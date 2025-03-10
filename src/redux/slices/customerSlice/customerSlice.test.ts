import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';

/* redux-slice */
import customerReducer, {
  setCustomer,
  resetCustomerSlice,
  CustomerSliceType,
  initialState,
} from './customerSlice.ts';

/* mock data */
import { mockCustomer } from '../../../assets/mockData/mockCustomer.ts';

// unit test - without store setup
describe('customerSlice - REDUCER LOGIC (pure function)', () => {
  it('should return the initial state', () => {
    expect(customerReducer(initialState, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  it('should handle setCustomer', () => {
    const expectedState: CustomerSliceType = {
      customerData: mockCustomer,
    };

    expect(customerReducer(initialState, setCustomer(mockCustomer))).toEqual(
      expectedState
    );
  });

  it('should handle resetCustomerSlice', () => {
    const modifiedState: CustomerSliceType = {
      customerData: mockCustomer,
    };

    expect(customerReducer(modifiedState, resetCustomerSlice())).toEqual(
      initialState
    );
  });
});

// integration testing with Redux store -
// test how Redux handles state updates in a real app
describe('customerSlice - REDUX STORE INTEGRATION', () => {
  const store = configureStore({
    reducer: {
      customer: customerReducer,
    },
  });

  it('should handle setCustomer', () => {
    store.dispatch(setCustomer(mockCustomer));
    const state = store.getState().customer;

    expect(state.customerData).toEqual(mockCustomer);
  });

  it('should handle resetCustomerSlice', () => {
    store.dispatch(resetCustomerSlice());
    const state = store.getState().customer;

    expect(state.customerData).toEqual(initialState.customerData);
  });
});
