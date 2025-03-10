import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice/authSlice';
import { store } from './store';

describe('Redux Store', () => {
  it('should include auth reducer', () => {
    const testStore = configureStore({
      reducer: {
        auth: authReducer,
      },
    });

    expect(testStore.getState().auth).toEqual(store.getState().auth);
  });

  it('should include auth reducer', () => {
    expect(store.getState().auth).toBeDefined();
  });

  it('should include cart reducer', () => {
    expect(store.getState().cart).toBeDefined();
  });

  it('should include customer reducer', () => {
    expect(store.getState().customer).toBeDefined();
  });

  it('should include all reducer', () => {
    expect(store.getState().address).toBeDefined();
  });

  it('should include order reducer', () => {
    expect(store.getState().order).toBeDefined();
  });

  it('should include settings reducer', () => {
    expect(store.getState().settings).toBeDefined();
  });
});
