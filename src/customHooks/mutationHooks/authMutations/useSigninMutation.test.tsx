import { renderHook, act, cleanup } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

/* component */
import { useSigninMutation } from './useSigninMutation.tsx';

/* redux-slice/service */
import { setCustomerCart } from '../../../redux/slices/cartSlice/cartSlice.ts';
import { login } from '../../../redux/slices/authSlice/authSlice.ts';
import { setCustomer } from '../../../redux/slices/customerSlice/customerSlice.ts';
import { setToast } from '../../../redux/slices/settingsSlice/settingsSlice.ts';
import { signinCustomer } from '../../../services/apiAuth.ts';

/* mock data */
import { mockCart } from '../../../assets/mockData/mockCart.ts';
import { mockCustomer } from '../../../assets/mockData/mockCustomer.ts';

// Mock the dependencies
vi.mock('../../../services/apiAuth.ts', () => ({
  signinCustomer: vi.fn(),
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
const mockSigninCustomer = signinCustomer as Mock;

describe('useSigninMutation - HOOK', async () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();

    mockDispatch.mockClear();
    mockSigninCustomer.mockResolvedValue(mockSigninCustomer);
  });

  it('should dispatch setCustomerCart, setCustomer and toast on successful signin', async () => {
    const mockResponse = {
      customerData: mockCustomer,
      customerCart: mockCart,
    };

    mockSigninCustomer.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useSigninMutation(), { wrapper });

    await act(async () => {
      await result.current.signin({
        emailAddress: 'charan@example.com',
        password: 'password123',
        rememberMe: false,
      });
    });

    expect(signinCustomer).toHaveBeenCalledWith({
      emailAddress: 'charan@example.com',
      password: 'password123',
      rememberMe: false,
    });
    expect(mockDispatch).toHaveBeenCalledWith(login());
    expect(mockDispatch).toHaveBeenCalledWith(setCustomer(mockCustomer));
    expect(mockDispatch).toHaveBeenCalledWith(setCustomerCart(mockCart));
    expect(mockDispatch).toHaveBeenCalledWith(
      setToast({
        message: 'Signin Successful',
        type: 'success',
      })
    );
  });

  it('should show error toast when customer data is missing', async () => {
    mockSigninCustomer.mockResolvedValue(null);

    const { result } = renderHook(() => useSigninMutation(), { wrapper });

    await act(async () => {
      await result.current.signin({
        emailAddress: 'wrong@gmail.com',
        password: 'wrongpassword',
        rememberMe: false,
      });
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      setToast({
        message: 'Signin FAILED: Customer not found',
        type: 'error',
      })
    );
  });

  it('should handle API errors and show error toast', async () => {
    const mockError = new Error('Network Error');
    mockSigninCustomer.mockRejectedValue(mockError);

    const { result } = renderHook(() => useSigninMutation(), { wrapper });

    await act(async () => {
      await result.current.signin({
        emailAddress: 'charan@example.com',
        password: 'password123',
        rememberMe: false,
      });
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      setToast({ message: 'Network Error', type: 'error' })
    );
  });
});
