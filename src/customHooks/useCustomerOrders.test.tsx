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

import { useCustomerOrders } from './useCustomerOrders.tsx';

/* redux-slice/services */
import { setCustomerOrders } from '../redux/slices/orderSlice/orderSlice.ts';
import { setToast } from '../redux/slices/settingsSlice/settingsSlice.ts';

/* mock data */
import { mockOrders } from '../assets/mockData/mockOrders.ts';

// Mock API function
vi.mock('../services/apiOrder.ts', () => ({
  getOrders: vi.fn(),
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

describe('useCustomerOrders - HOOK', () => {
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

  it('should fetch and store customer orders data successfully', async () => {
    mockUseQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      error: null,
      data: mockOrders,
      isSuccess: true,
    });

    const { result } = renderHook(
      () => useCustomerOrders({ customerId: '10' }),
      {
        wrapper,
      }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() => expect(result.current.isError).toBe(false));
    expect(mockDispatch).toHaveBeenCalledWith(setCustomerOrders(mockOrders));
  });

  it('should return error if fetch customer orders fails', async () => {
    mockUseQuery.mockReturnValue({
      isLoading: false,
      isError: true,
      error: new Error('Failed to fetch customer orders'),
      data: null,
      isSuccess: false,
    });

    const { result } = renderHook(
      () => useCustomerOrders({ customerId: '10' }),
      {
        wrapper,
      }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockDispatch).toHaveBeenCalledWith(
      setToast({
        message: 'Failed to fetch customer orders',
        type: 'error',
      })
    );
  });
});
