import { renderHook, act, cleanup } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { useOrderMutation } from './useOrderMutation';

import { createOrder } from '../../services/apiOrder';
import { setToast } from '../../../../store/slices/settingsSlice/settingsSlice';
import { setSelectedOrder } from '../../slice/orderSlice';
import { resetCartItems } from '../../../Cart/slice/cartSlice';
import { invalidateQueries } from '../../../../utils';

import { mockOrders, mockEmptyCart } from '../../../../../assets/mockData';

// Mock the dependencies
vi.mock('../../services/apiOrder', () => ({
  createOrder: vi.fn(),
}));

vi.mock('../../../../utils', () => {
  return {
    invalidateQueries: vi.fn(),
  };
});

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
const mockCreateOrder = createOrder as Mock;
const mockInvalidateQueries = invalidateQueries as Mock;

describe('useOrderMutation - HOOK', async () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();

    mockDispatch.mockClear();
    mockCreateOrder.mockResolvedValue(mockCreateOrder);
    mockInvalidateQueries.mockResolvedValue(mockInvalidateQueries);
  });

  it('should create order successfully', async () => {
    mockCreateOrder.mockResolvedValue({
      data: mockOrders[0],
      resetCartData: mockEmptyCart,
    });
    const { result } = renderHook(() => useOrderMutation(), { wrapper });

    await act(async () => {
      await result.current.createOrder(mockOrders[0]);
    });

    expect(mockCreateOrder).toHaveBeenCalledWith(mockOrders[0]);

    expect(mockInvalidateQueries).toHaveBeenCalledWith('customerOrders');
    expect(mockDispatch).toHaveBeenCalledWith(
      setToast({
        type: 'success',
        message: 'Order created successfully',
      })
    );
    expect(mockDispatch).toHaveBeenCalledWith(resetCartItems(mockEmptyCart));
    expect(mockDispatch).toHaveBeenCalledWith(setSelectedOrder(mockOrders[0]));
  });

  it('should fails to create order', async () => {
    mockCreateOrder.mockRejectedValue(new Error('Failed to create order'));

    const { result } = renderHook(() => useOrderMutation(), { wrapper });

    await act(async () => {
      await result.current.createOrder(mockOrders[0]);
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      setToast({
        type: 'error',
        message: 'FAILED to create order !',
      })
    );
  });
});
