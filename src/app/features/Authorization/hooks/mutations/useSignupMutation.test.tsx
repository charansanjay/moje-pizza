import { renderHook, act, cleanup } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { useSignupMutation } from './useSignupMutation';

import { signupCustomer } from '../../services/apiAuth';
import { setToast } from '../../../../store/slices/settingsSlice/settingsSlice';

// Mock API service
vi.mock('../../services/apiAuth', () => ({
  signupCustomer: vi.fn(),
}));

// Mock the store
const mockStore = configureStore([]);
const store = mockStore({});
store.dispatch = vi.fn();

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  </Provider>
);

const mockDispatch = store.dispatch as Mock;
const mockSignupCustomer = signupCustomer as Mock;

describe('useSignupMutation - HOOK', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();

    mockDispatch.mockClear();
    mockSignupCustomer.mockResolvedValue(mockSignupCustomer);
  });

  it('should dispatch setToast on successful signup', async () => {
    const mockResponse = {
      id: '123',
      email: 'charan@example.com',
    };

    mockSignupCustomer.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useSignupMutation(), { wrapper });

    await act(async () => {
      await result.current.signup({
        firstName: 'charan',
        lastName: 'sanajy',
        emailAddress: 'charan@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
    });

    expect(mockSignupCustomer).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(
      setToast({
        message: 'Account CREATED successfully',
        type: 'success',
      })
    );
  });

  it('should dispatch setToast on failed signup', async () => {
    mockSignupCustomer.mockResolvedValue(null);

    const { result } = renderHook(() => useSignupMutation(), { wrapper });

    await act(async () => {
      await result.current.signup({
        firstName: 'charan',
        lastName: 'sanajy',
        emailAddress: 'charan@example.com',
        password: 'password',
        confirmPassword: 'password123',
      });
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      setToast({
        message: 'Signup FAILED: could not create customer',
        type: 'error',
      })
    );
  });

  it('should handle API error and show error toast', async () => {
    const mockError = new Error('Network Error');
    mockSignupCustomer.mockRejectedValue(mockError);

    const { result } = renderHook(() => useSignupMutation(), { wrapper });

    await act(async () => {
      await result.current.signup({
        firstName: 'charan',
        lastName: 'sanajy',
        emailAddress: 'charan@example.com',
        password: 'password',
        confirmPassword: 'password123',
      });
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      setToast({ message: 'Network Error', type: 'error' })
    );
  });
});
