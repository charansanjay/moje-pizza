import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import GoogleSignin from './GoogleSignin.tsx';

import { setToast } from '../../../redux/slices/settingsSlice/settingsSlice.ts';

const mockStore = configureStore([]);
const store = mockStore({});

describe('GoogleSignin - COMPONENT', () => {
  beforeEach(() => {
    store.clearActions();
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the button with the correct text', () => {
    render(
      <Provider store={store}>
        <GoogleSignin text='Sign in with Google' />
      </Provider>
    );

    const button = screen.getByRole('button', { name: 'Sign in with Google' });
    expect(button).toBeInTheDocument();
  });

  it('dispatches setToast action on button click', () => {
    render(
      <Provider store={store}>
        <GoogleSignin text='Sign in with Google' />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button'));
    const actions = store.getActions();
    expect(actions).toEqual([
      setToast({
        message: 'FEATURE under development',
        type: 'info',
      }),
    ]);
  });
});
