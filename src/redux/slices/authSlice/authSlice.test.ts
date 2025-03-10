import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';

/* redux-slice */
import authReducer, { initialState, login, logout } from './authSlice.ts';

// unit test - without store setup
describe('authSlice - REDUCER LOGIC (pure function)', () => {
  it('should return the initial state', () => {
    expect(authReducer(initialState, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  it('should handle login', () => {
    const expectedState = {
      isAuthenticated: true,
    };

    expect(authReducer(initialState, login())).toEqual(expectedState);
  });

  it('should handle logout', () => {
    const modifiedState = {
      isAuthenticated: true,
    };

    expect(authReducer(modifiedState, logout())).toEqual(initialState);
  });
});

// integration testing with Redux store -
// test how Redux handles state updates in a real app
describe('authSlice - REDUX STORE INTEGRATION', () => {
  const store = configureStore({
    reducer: {
      address: authReducer,
    },
  });

  it('should handle login', () => {
    store.dispatch(login());
    const state = store.getState().address;

    expect(state.isAuthenticated).toEqual(true);
  });

  it('should handle logout', () => {
    store.dispatch(logout());
    const state = store.getState().address;

    expect(state.isAuthenticated).toEqual(false);
  });
});
