import { renderHook, act, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import configureStore from 'redux-mock-store';

import { useCartMutation } from './useCartMutation';

import { setCustomerCart } from '../../redux/slices/cartSlice/cartSlice.ts';
import { setToast } from '../../redux/slices/settingsSlice/settingsSlice.ts';
import {
  addOrUpdateCartItem,
  applyCouponDiscount,
  deleteCartItem,
  updateCartItemQuantity,
} from '../../services/apiCart.ts';

/* mock data */
import { mockCart } from '../../assets/mockData/mockCart';
import { mockMenuItem } from '../../assets/mockData/mockMenuItem';

// Mock API functions
vi.mock('../../services/apiCart.ts', () => ({
  addOrUpdateCartItem: vi.fn(),
  updateCartItemQuantity: vi.fn(),
  deleteCartItem: vi.fn(),
  applyCouponDiscount: vi.fn(),
}));

// Mock Redux store
const mockStore = configureStore();
const store = mockStore({});
store.dispatch = vi.fn();

// Mock QueryClient
const queryClient = new QueryClient();

const mockDispatch = store.dispatch as Mock;
const mockAddOrUpdateCartItem = addOrUpdateCartItem as Mock;
const mockUpdateCartItemQuantity = updateCartItemQuantity as Mock;
const mockDeleteCartItem = deleteCartItem as Mock;
const mockApplyCouponDiscount = applyCouponDiscount as Mock;

describe('useCartMutation - HOOK', () => {
  beforeEach(() => {
    store.clearActions(); // Reset Redux actions before each test
    vi.clearAllMocks(); // Reset all mocks before each test
    cleanup();

    queryClient.clear();
    mockDispatch.mockClear();
    mockAddOrUpdateCartItem.mockResolvedValue(mockAddOrUpdateCartItem);
    mockUpdateCartItemQuantity.mockResolvedValue(mockUpdateCartItemQuantity);
    mockDeleteCartItem.mockResolvedValue(mockDeleteCartItem);
    mockApplyCouponDiscount.mockResolvedValue(mockApplyCouponDiscount);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    </Provider>
  );

  it('should add or update cart item successfully', async () => {
    mockAddOrUpdateCartItem.mockResolvedValue(mockCart);

    const { result } = renderHook(() => useCartMutation(), { wrapper });

    await act(
      async () =>
        await result.current.addOrUpdateCartItem({
          itemToAdd: mockMenuItem,
          customerCart: mockCart,
        })
    );

    expect(mockAddOrUpdateCartItem).toHaveBeenCalledWith(
      mockMenuItem,
      mockCart
    );
    expect(mockDispatch).toHaveBeenCalledWith(setCustomerCart(mockCart));
    expect(mockDispatch).toHaveBeenCalledWith(
      setToast({
        message: 'Item ADDED to cart',
        type: 'success',
        disableAutoClose: false,
      })
    );
  });

  it('should handle error when adding or updating cart item', async () => {
    mockAddOrUpdateCartItem.mockRejectedValue(
      new Error('Failed to add item to cart')
    );

    const { result } = renderHook(() => useCartMutation(), { wrapper });

    await act(
      async () =>
        await result.current.addOrUpdateCartItem({
          itemToAdd: mockMenuItem,
          customerCart: mockCart,
        })
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      setToast({
        message: 'Failed to add item to cart',
        type: 'error',
        disableAutoClose: true,
      })
    );
  });

  it('should update cart item quantity successfully', async () => {
    mockUpdateCartItemQuantity.mockResolvedValue(mockCart);

    const { result } = renderHook(() => useCartMutation(), { wrapper });

    await act(
      async () =>
        await result.current.updateCartItemQuantity({
          itemToUpdate: mockCart.items[0],
          cartData: mockCart,
        })
    );

    expect(mockDispatch).toHaveBeenCalledWith(setCustomerCart(mockCart));
    expect(mockDispatch).toHaveBeenCalledWith(
      setToast({
        message: 'Item quantity UPDATED',
        type: 'success',
        disableAutoClose: false,
      })
    );
  });

  it('should handle error when updating cart item quantity', async () => {
    mockUpdateCartItemQuantity.mockRejectedValue(
      new Error('Failed to update item quantity')
    );

    const { result } = renderHook(() => useCartMutation(), { wrapper });

    await act(
      async () =>
        await result.current.updateCartItemQuantity({
          itemToUpdate: mockCart.items[0],
          cartData: mockCart,
        })
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      setToast({
        message: 'Failed to update item quantity',
        type: 'error',
        disableAutoClose: true,
      })
    );
  });

  it('should delete cart item successfully', async () => {
    mockDeleteCartItem.mockResolvedValue(mockCart);

    const { result } = renderHook(() => useCartMutation(), { wrapper });

    await act(() =>
      result.current.deleteCartItem({
        itemToDelete: mockCart.items[0],
        cartData: mockCart,
      })
    );

    expect(mockDispatch).toHaveBeenCalledWith(setCustomerCart(mockCart));
    expect(mockDispatch).toHaveBeenCalledWith(
      setToast({
        message: 'Item REMOVED from the cart',
        type: 'success',
        disableAutoClose: false,
      })
    );
  });

  it('should handle error when deleting cart item', async () => {
    mockDeleteCartItem.mockRejectedValue(
      new Error('Failed to remove item from cart')
    );

    const { result } = renderHook(() => useCartMutation(), { wrapper });

    await act(() =>
      result.current.deleteCartItem({
        itemToDelete: mockCart.items[0],
        cartData: mockCart,
      })
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      setToast({
        message: 'Failed to remove item from cart',
        type: 'error',
        disableAutoClose: true,
      })
    );
  });

  it('should apply coupon successfully', async () => {
    mockApplyCouponDiscount.mockResolvedValue(mockCart);

    const { result } = renderHook(() => useCartMutation(), { wrapper });

    await act(() =>
      result.current.applyCouponDiscount({
        cartData: mockCart,
        couponCode: 'DISCOUNT15',
      })
    );
;
    expect(mockDispatch).toHaveBeenCalledWith(setCustomerCart(mockCart));
    expect(mockDispatch).toHaveBeenCalledWith(
      setToast({ message: 'Coupon applied successfully', type: 'success' })
    );
  })
});
