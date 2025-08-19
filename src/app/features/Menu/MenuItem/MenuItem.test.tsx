import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../../services/queryClient.ts';

import { MenuItem } from './MenuItem';

import { useCartMutation } from '../../Cart/hooks/mutations/useCartMutation';

import cartReducer from '../../Cart/slice/cartSlice';
import customerReducer from '../../../shared/slices/customerSlice/customerSlice';
import settingsReducer, {
  setToast,
} from '../../../store/slices/settingsSlice/settingsSlice';

import { mockMenuItem, mockCart } from '../../../../assets/mockData';

import { type AppDispatch } from '../../../store/store';

/* Mock components */
vi.mock('../../../components/Loader/Loader', () => ({
  Loader: () => <div>Mocked Loader</div>,
}));

/* Mock hooks */
vi.mock('../../Cart/hooks/mutations/useCartMutation', () => ({
  useCartMutation: vi.fn(() => {
    return {
      addOrUpdateCartItem: vi.fn(),
    };
  }),
}));

// Mock the useSelector hook
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useSelector: vi.fn(),
    useDispatch: vi.fn(),
  };
});

const store = configureStore({
  reducer: {
    cart: cartReducer,
    customer: customerReducer,
    settings: settingsReducer,
  },
});

const mockUseCartMutation = useCartMutation as Mock;
const mockUseSelector = useSelector as unknown as Mock;
const mockDispatch = useDispatch as AppDispatch as Mock;
const mockAddOrUpdateCartItem = vi.fn();

describe('MenuItem - PAGE - COMPONENT', () => {
  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();
    queryClient.clear();

    mockDispatch.mockReturnValue(mockDispatch);
    mockUseSelector.mockReturnValue(mockUseSelector);
    mockUseCartMutation.mockReturnValue(mockUseCartMutation);
    mockAddOrUpdateCartItem.mockReturnValue(mockAddOrUpdateCartItem);
  });

  afterEach(() => {
    cleanup();
  });

  it('should render the menu item', () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MenuItem menuItem={mockMenuItem} />
        </QueryClientProvider>
      </Provider>
    );

    expect(screen.getByText(new RegExp(mockMenuItem.name))).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(mockMenuItem.description))
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        new RegExp(`${mockMenuItem.currency} ${mockMenuItem.price.toFixed(2)}`)
      )
    ).toBeInTheDocument();
  });

  it('should show "Sold out" when the item is sold out', () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MenuItem menuItem={mockMenuItem} />
        </QueryClientProvider>
      </Provider>
    );

    expect(screen.getByText(/Sold out/i)).toBeInTheDocument();
  });

  it('should show loader when cart is updating', () => {
    mockUseCartMutation.mockReturnValue({
      isLoading: true,
      addOrUpdateCartItem: mockAddOrUpdateCartItem,
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MenuItem menuItem={mockMenuItem} />
        </QueryClientProvider>
      </Provider>
    );

    expect(screen.queryByText('Mocked Loader')).toBeInTheDocument();
  });

  it('should dispatch setToast action when user is not signed in', () => {
    mockUseSelector.mockReturnValue({});

    mockUseCartMutation.mockReturnValue({
      isLoading: false,
      addOrUpdateCartItem: mockAddOrUpdateCartItem,
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MenuItem menuItem={mockMenuItem} />
        </QueryClientProvider>
      </Provider>
    );

    fireEvent.click(screen.getByText('Cart'));

    expect(mockDispatch).toHaveBeenCalledWith(
      setToast({
        message: 'Please Signin.',
        type: 'info',
        disableAutoClose: false,
      })
    );
  });

  it('should call addOrUpdateCartItem when user is signed in', () => {
    mockUseSelector.mockReturnValue({ ...mockCart, items: [mockMenuItem] });
    mockUseCartMutation.mockReturnValue({
      isLoading: false,
      addOrUpdateCartItem: mockAddOrUpdateCartItem,
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MenuItem menuItem={mockMenuItem} />
        </QueryClientProvider>
      </Provider>
    );

    fireEvent.click(screen.getByText('Cart'));

    expect(mockAddOrUpdateCartItem).toHaveBeenCalledWith({
      itemToAdd: mockMenuItem,
      customerCart: { ...mockCart, items: [mockMenuItem] },
    });
  });
});
