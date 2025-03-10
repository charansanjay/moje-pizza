import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';

/* redux-slice */
import orderReducer, {
  setCustomerOrders,
  setSelectedOrder,
  resetOrderSlice,
  OrderSliceType,
  initialState,
} from './orderSlice.ts';

/* mock data */
import {
  mockEmptyOrders,
  mockOrders,
} from '../../../assets/mockData/mockOrders.ts';

// unit test - without store setup
describe('orderSlice - REDUCER LOGIC (pure function)', () => {
  it('should return the initial state', () => {
    expect(orderReducer(initialState, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  it('should handle setCustomerOrders', () => {
    const expectedState: OrderSliceType = {
      selectedOrder: {},
      customerOrders: mockOrders,
    };

    expect(orderReducer(initialState, setCustomerOrders(mockOrders))).toEqual(
      expectedState
    );
  });

  it('should handle setSelectedOrder', () => {
    const expectedState: OrderSliceType = {
      selectedOrder: mockOrders[0],
      customerOrders: mockEmptyOrders,
    };

    expect(orderReducer(initialState, setSelectedOrder(mockOrders[0]))).toEqual(
      expectedState
    );
  });

  it('should handle resetOrderSlice', () => {
    const modifiedState: OrderSliceType = {
      selectedOrder: mockOrders[0],
      customerOrders: mockOrders,
    };

    expect(orderReducer(modifiedState, resetOrderSlice())).toEqual(
      initialState
    );
  });
});

// integration testing with Redux store -
// test how Redux handles state updates in a real app
describe('orderSlice - REDUX STORE INTEGRATION', () => {
  const store = configureStore({
    reducer: {
      order: orderReducer,
    },
  });

  it('should handle setCustomerOrders', () => {
    store.dispatch(setCustomerOrders(mockOrders));
    const state = store.getState().order;

    expect(state.customerOrders).toEqual(mockOrders);
  });

  it('should handle setSelectedOrder', () => {
    store.dispatch(setSelectedOrder(mockOrders[0]));
    const state = store.getState().order;

    expect(state.selectedOrder).toEqual(mockOrders[0]);
  });

  it('should handle resetOrderSlice', () => {
    store.dispatch(resetOrderSlice());
    const state = store.getState().order;

    expect(state).toEqual(initialState);
  });
});
