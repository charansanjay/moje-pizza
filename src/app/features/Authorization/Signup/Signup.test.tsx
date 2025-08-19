import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import { Signup } from './Signup';

import settingsReducer from '../../../store/slices/settingsSlice/settingsSlice';

/* Mock components */
vi.mock('./SignupForm/SignupForm', () => ({
  SignupForm: () => <div>Mocked SignupForm</div>,
}));

const store = configureStore({
  reducer: {
    settings: settingsReducer,
  },
});

describe('Signup - PAGE', () => {
  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render the signup page', () => {
    render(
      <Provider store={store}>
        <Signup />
      </Provider>
    );

    expect(screen.getByText('Sign up / Register')).toBeInTheDocument();
    expect(
      screen.getByText('Welcome, Please enter your details to register')
    ).toBeInTheDocument();
    expect(screen.getByText('Mocked SignupForm')).toBeInTheDocument();
    expect(screen.getAllByText('Sign up with Google')).toHaveLength(2);
  });

  it('should render the OR divider', () => {
    render(
      <Provider store={store}>
        <Signup />
      </Provider>
    );

    expect(screen.getByText('OR')).toBeInTheDocument();
  });

  it('should render the Google Signin button', () => {
    render(
      <Provider store={store}>
        <Signup />
      </Provider>
    );

    expect(screen.getAllByText('Sign up with Google')).toHaveLength(2);
  });
});
