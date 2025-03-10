import { cleanup, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import configureStore from 'redux-mock-store';

import { useCustomerCart } from './useCustomerCart.tsx';

/* redux-slice/services */
import { setCustomerCart } from '../redux/slices/cartSlice/cartSlice.ts';
import { setToast } from '../redux/slices/settingsSlice/settingsSlice.ts';

/* mock data */
import { mockCart } from '../assets/mockData/mockCart.ts';

// Mock API function
vi.mock('../services/apiCart.ts', () => ({
  fetchCustomerCart: vi.fn(),
}));

// Mock QueryClient
const queryClient = new QueryClient();

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

// Mock Redux store
const mockStore = configureStore([]);
const store = mockStore({});
store.dispatch = vi.fn();

const mockDispatch = store.dispatch as Mock;
const mockUseQuery = useQuery as Mock;

describe('useCustomerCart - HOOK', () => {
  beforeEach(() => {
    store.clearActions();
    vi.clearAllMocks();
    cleanup();

    queryClient.clear();
    mockDispatch.mockClear();
    mockUseQuery.mockReturnValue(mockUseQuery);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    </Provider>
  );

  it('should fetch and store customer cart data successfully', async () => {
    mockUseQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      error: null,
      data: { data: mockCart },
      isSuccess: true,
    });

    const { result } = renderHook(() => useCustomerCart({ cartId: '44' }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isCartLoading).toBe(false));
    await waitFor(() => expect(result.current.isError).toBe(false));
    expect(mockDispatch).toHaveBeenCalledWith(setCustomerCart(mockCart));
  });

  it('should return error if fetch customer cart fails', async () => {
    mockUseQuery.mockReturnValue({
      isLoading: false,
      isError: true,
      error: new Error('Failed to fetch customer cart'),
      data: null,
      isSuccess: false,
    });

    const { result } = renderHook(() => useCustomerCart({ cartId: '44' }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isCartLoading).toBe(false));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockDispatch).toHaveBeenCalledWith(
      setToast({
        message: 'Failed to fetch customer cart',
        type: 'error',
      })
    );
  });
});
