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

import { useCustomerAddress } from './useCustomerAddress.tsx';

/* redux-slice/services */
import { setCustomerAddresses } from '../redux/slices/addressSlice/addressSlice.ts';
import { setToast } from '../redux/slices/settingsSlice/settingsSlice.ts';
import { fetchCustomerAddress } from '../services/apiAddress.ts';

/* mock data */
import { mockAddresses } from '../assets/mockData/mockAddress.ts';

// Mock API function
vi.mock('../services/apiAddress.ts', () => ({
  fetchCustomerAddress: vi.fn(),
}));

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});
const queryClient = new QueryClient();

const mockStore = configureStore([]);
const store = mockStore({});
store.dispatch = vi.fn();

const mockDispatch = store.dispatch as Mock;
const mockUseQuery = useQuery as Mock;
const mockFetchCustomerAddresses = fetchCustomerAddress as Mock;

describe('useCustomerAddress - HOOK', () => {
  beforeEach(() => {
    store.clearActions();
    vi.clearAllMocks();
    cleanup();

    queryClient.clear();
    mockDispatch.mockClear();
    mockUseQuery.mockReturnValue(mockUseQuery);
    mockFetchCustomerAddresses.mockResolvedValue(mockFetchCustomerAddresses);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    </Provider>
  );

  it('should fetch and set customer addresses on success', async () => {
    mockUseQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      error: null,
      data: mockAddresses,
      isSuccess: true,
    });

    const { result } = renderHook(
      () => useCustomerAddress({ customerId: '123' }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isAddressLoading).toBe(false));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() => expect(result.current.isError).not.toBe(true));
    expect(result.current.customerAddresses).toEqual(mockAddresses);
    expect(mockDispatch).toHaveBeenCalledWith(
      setCustomerAddresses(mockAddresses)
    );
  });

  it('should dispatch error toast on failure', async () => {
    mockUseQuery.mockReturnValue({
      isLoading: false,
      isError: true,
      error: new Error('Failed to fetch customer address'),
      data: undefined,
      isSuccess: false,
    });

    const { result } = renderHook(
      () => useCustomerAddress({ customerId: '123' }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isAddressLoading).toBe(false));
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockDispatch).toHaveBeenCalledWith(
      setToast({
        message: 'Failed to fetch customer address',
        type: 'error',
      })
    );
  });
});
