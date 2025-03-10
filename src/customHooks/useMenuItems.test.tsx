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

import { useMenuItems } from './useMenuItems.tsx';

import { setToast } from '../redux/slices/settingsSlice/settingsSlice.ts';

import { mockMenuItems } from '../assets/mockData/mockMenuItems.ts';

// Mock API function
vi.mock('../services/apiRestaurant.ts', () => ({
  fetchMenu: vi.fn(),
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

describe('useMenuItems - HOOK', () => {
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

  it('should return menu items on success', async () => {
    mockUseQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      error: null,
      data: mockMenuItems,
      isSuccess: true,
    });

    const { result } = renderHook(() => useMenuItems(), { wrapper });

    await waitFor(() => expect(result.current.isMenuLoading).toBe(false));
    await waitFor(() => expect(result.current.isError).toBe(false));
  });

  it('should dispatch setToast on error', async () => {
    mockUseQuery.mockReturnValue({
      isLoading: false,
      isError: true,
      error: new Error('Failed to fetch menu items'),
      data: null,
      isSuccess: false,
    });

    const { result } = renderHook(() => useMenuItems(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isMenuLoading).toBe(false));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockDispatch).toHaveBeenCalledWith(
      setToast({
        message: 'Failed to fetch menu items',
        type: 'error',
      })
    );
  });
});
