import {
  render,
  screen,
  waitFor,
  cleanup,
  fireEvent,
} from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi, Mock } from 'vitest';
import { useNavigate, MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../services/queryClient';

import authReducer from '../redux/slices/authSlice/authSlice.ts';
import customerReducer from '../redux/slices/customerSlice/customerSlice.ts';
import cartReducer from '../redux/slices/cartSlice/cartSlice.ts';
import settingsReducer from '../redux/slices/settingsSlice/settingsSlice.ts';

import { AppRoute } from './AppRoute.tsx';
import { configureStore } from '@reduxjs/toolkit';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// Mock store
const store = configureStore({
  reducer: {
    auth: authReducer,
    customer: customerReducer,
    cart: cartReducer,
    settings: settingsReducer,
  },
  preloadedState: {
    auth: { isAuthenticated: false },
    customer: { customerData: {} },
    cart: { customerCart: {} },
    settings: { toast: null },
  },
});

const mockNavigate = useNavigate as Mock;

describe('AppRoute - ROUTE', () => {
  beforeEach(() => {
    cleanup();
    queryClient.clear();

    mockNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    cleanup();
    queryClient.clear();
  });

  it('should redirect from "/" to "/home"', async () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/']}>
            <AppRoute />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Welcome to Moje Pizza/i)).toBeInTheDocument();
    });
  });

  it('should render the Home page when navigating to "/home"', async () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/']}>
            <AppRoute />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    expect(screen.getByText(/Welcome to Moje Pizza/i)).toBeInTheDocument();
  });

  it('should render the Menu page when navigating to "/menu"', async () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/']}>
            <AppRoute />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    // find the menu button
    const menuButton = screen.getByText(/Check Menu/i);
    expect(menuButton).toBeInTheDocument();
    fireEvent.click(menuButton);

    expect(mockNavigate).toHaveBeenCalledWith('/menu');
  });

  it('should render the Signin page when navigating to "/signin"', async () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/']}>
            <AppRoute />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    // find the signin button
    const signinButton = screen.getByText(/Sign in/i);
    expect(signinButton).toBeInTheDocument();
    fireEvent.click(signinButton);

    await waitFor(() => {
      expect(screen.getByText('Sign in to your account.')).toBeInTheDocument();
    });
  });

  it('should render the Signup page when navigating to "/signup"', async () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/']}>
            <AppRoute />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    // find the signup button
    const signupButton = screen.getByText(/Register/i);
    expect(signupButton).toBeInTheDocument();
    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(screen.getByText('Sign up / Register')).toBeInTheDocument();
    });
  });

  it('should render the NotFound page when navigating to an unknown route', async () => {
    
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/unknown-route']}>
            <AppRoute />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    await waitFor(() => {
      const unknownRoute = screen.getByText(/Oops! Page not found./i);
      expect(unknownRoute).toBeInTheDocument();
    });
  });
});
