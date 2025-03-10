import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

/* component */
import { Signin } from './Signin.tsx';

/* redux slice */
import settingsReducer from '../../../redux/slices/settingsSlice/settingsSlice.ts';
import { setToast } from '../../../redux/slices/settingsSlice/settingsSlice.ts';


/* Mock components */
vi.mock('./SigninForm/SigninForm.tsx', () => ({
  SigninForm: () => <div>Mocked SigninForm</div>,
}));

const store = configureStore({
  reducer: {
    settings: settingsReducer,
  },
});

describe('Signin - PAGE', () => {
  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render the signin page', () => {
    render(
      <Provider store={store}>
        <Signin />
      </Provider>
    );

    expect(screen.getByText('Sign in to your account.')).toBeInTheDocument();
    expect(
      screen.getByText('Welcome back, Please enter your details')
    ).toBeInTheDocument();
    expect(screen.getByText('Mocked SigninForm')).toBeInTheDocument();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    expect(screen.getAllByText('Continue with Google')[0]).toBeInTheDocument();
  });

  it('should dispatch setToast action when clicking "Forgot password?"', () => {
    const dispatch = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <Signin />
      </Provider>
    );

    fireEvent.click(screen.getByText('Forgot password?'));

    expect(dispatch).toHaveBeenCalledWith(
      setToast({
        message: 'FEATURE under development',
        type: 'info',
      })
    );
  });

  it('should render the OR divider', () => {
    render(
      <Provider store={store}>
        <Signin />
      </Provider>
    );

    expect(screen.getByText('OR')).toBeInTheDocument();
  });

  it('should render the Google Signin button', () => {
    render(
      <Provider store={store}>
        <Signin />
      </Provider>
    );

    expect(screen.getAllByText('Continue with Google')[0]).toBeInTheDocument();
  });
});
