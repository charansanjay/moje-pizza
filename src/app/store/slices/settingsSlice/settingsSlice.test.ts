import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';

/* redux-slice */
import settingsReducer, {
  setToast,
  resetSettingsSlice,
  SettingsSliceType,
  initialState,
  clearToast,
} from './settingsSlice.ts';

// unit test - without store setup
describe('settingsSlice - REDUCER LOGIC (pure function)', () => {
  it('should return the initial state', () => {
    expect(settingsReducer(initialState, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  it('should handle setToast', () => {
    const expectedState: SettingsSliceType = {
      toast: {
        message: 'This is a success message!',
        type: 'success',
      },
    };

    expect(
      settingsReducer(initialState, setToast(expectedState.toast))
    ).toEqual(expectedState);
  });

  it('should handle clearToast', () => {
    const modifiedState: SettingsSliceType = {
      toast: {
        message: 'Hello, World!',
        type: 'success',
      },
    };

    expect(settingsReducer(modifiedState, clearToast())).toEqual(initialState);
  });

  it('should handle resetSettingsSlice', () => {
    const modifiedState: SettingsSliceType = {
      toast: {
        message: 'Hello, World!',
        type: 'success',
      },
    };

    expect(settingsReducer(modifiedState, resetSettingsSlice())).toEqual(
      initialState
    );
  });
});

// integration testing with Redux store -
// test how Redux handles state updates in a real app
describe('settingsSlice - REDUX STORE INTEGRATION', () => {
  it('should handle setToast', () => {
    const store = configureStore({
      reducer: {
        settings: settingsReducer,
      },
    });

    const expectedState: SettingsSliceType = {
      toast: {
        message: 'This is a success message!',
        type: 'success',
      },
    };

    store.dispatch(setToast(expectedState.toast));

    expect(store.getState().settings).toEqual(expectedState);
  });

  it('should handle clearToast', () => {
    const store = configureStore({
      reducer: {
        settings: settingsReducer,
      },
    });

    const modifiedState: SettingsSliceType = {
      toast: {
        message: 'Hello, World!',
        type: 'success',
      },
    };

    store.dispatch(setToast(modifiedState.toast));
    store.dispatch(clearToast());

    expect(store.getState().settings).toEqual(initialState);
  });

  it('should handle resetSettingsSlice', () => {
    const store = configureStore({
      reducer: {
        settings: settingsReducer,
      },
    });

    const modifiedState: SettingsSliceType = {
      toast: {
        message: 'Hello, World!',
        type: 'success',
      },
    };

    store.dispatch(setToast(modifiedState.toast));
    store.dispatch(resetSettingsSlice());

    expect(store.getState().settings).toEqual(initialState);
  });
});
