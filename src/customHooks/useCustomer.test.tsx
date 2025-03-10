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

import { useCustomer } from './useCustomer.tsx';

/* redux-slice/services */
import { setCustomer } from '../redux/slices/customerSlice/customerSlice.ts';
import { setToast } from '../redux/slices/settingsSlice/settingsSlice.ts';

/* mock data */
import { mockCustomer } from '../assets/mockData/mockCustomer.ts';

// Mock Redux store
const mockStore = configureStore();
const store = mockStore({});
store.dispatch = vi.fn();

// Mock API function
vi.mock('../services/apiCustomer.ts', () => ({
  fetchCustomerById: vi.fn(),
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

const mockDispatch = store.dispatch as Mock;
const mockUseQuery = useQuery as Mock;

describe('useCustomer - HOOK', () => {
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

  it('should fetch and store customer data successfully', async () => {
    mockUseQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      error: null,
      data: [mockCustomer],
      isSuccess: true,
    });

    const { result } = renderHook(() => useCustomer({ customerId: '123' }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isCustomerLoading).toBe(false));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() => expect(result.current.isError).toBe(false));
    expect(mockDispatch).toHaveBeenCalledWith(setCustomer(mockCustomer));
  });

  it('should handle error when fetching customer data', async () => {
    mockUseQuery.mockReturnValue({
      isLoading: false,
      isError: true,
      error: new Error('Failed to fetch customer'),
      data: null,
      isSuccess: false,
    });

    const { result } = renderHook(() => useCustomer({ customerId: '123' }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isCustomerLoading).toBe(false));
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockDispatch).toHaveBeenCalledWith(
      setToast({
        message: 'Failed to fetch customer',
        type: 'error',
      })
    );
  });
});
