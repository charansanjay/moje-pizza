import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';

/* redux-slice */
import cartReducer, {
  setCustomerCart,
  resetCartItems,
  resetCartSlice,
  CartSliceType,
  initialState,
} from './cartSlice.ts';

/* mock data */
import { mockCart, mockEmptyCart } from '../../../assets/mockData/mockCart.ts';

// unit test - without store setup
describe('cartSlice - REDUCER LOGIC (pure function)', () => {
  it('should return the initial state', () => {
    expect(cartReducer(initialState, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  it('should handle setCustomerCart', () => {
    const expectedState: CartSliceType = {
      customerCart: mockCart,
    };

    expect(cartReducer(initialState, setCustomerCart(mockCart))).toEqual(
      expectedState
    );
  });

  it('should handle resetCartItems', () => {
    const modifiedState: CartSliceType = {
      customerCart: mockCart,
    };

    const expectedState: CartSliceType = {
      customerCart: mockEmptyCart,
    };

    expect(cartReducer(modifiedState, resetCartItems(mockEmptyCart))).toEqual(
      expectedState
    );
  });

  it('should handle resetCartSlice', () => {
    const modifiedState: CartSliceType = {
      customerCart: mockCart,
    };

    expect(cartReducer(modifiedState, resetCartSlice())).toEqual(initialState);
  });
});

// integration testing with Redux store -
// test how Redux handles state updates in a real app
describe('cartSlice - REDUX STORE INTEGRATION', () => {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
    },
  });

  it('should handle setCustomerCart', () => {
    store.dispatch(setCustomerCart(mockCart));
    const state = store.getState().cart;

    expect(state.customerCart).toEqual(mockCart);
  });

  it('should handle resetCartItems', () => {
    store.dispatch(resetCartItems(mockEmptyCart));
    const state = store.getState().cart;

    expect(state.customerCart).toEqual(mockEmptyCart);
  });

  it('should handle resetCartSlice', () => {
    store.dispatch(resetCartSlice());
    const state = store.getState().cart;

    expect(state.customerCart).toEqual(initialState.customerCart);
  });
});
