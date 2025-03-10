import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../../services/queryClient.ts';

/* component */
import { MenuItem } from './MenuItem.tsx';

/* redux-slice */
import cartReducer from '../../../redux/slices/cartSlice/cartSlice.ts';
import customerReducer from '../../../redux/slices/customerSlice/customerSlice.ts';
import settingsReducer, {
  setToast,
} from '../../../redux/slices/settingsSlice/settingsSlice.ts';

/* custom hooks */
import { useCartMutation } from '../../../customHooks/mutationHooks/useCartMutation.tsx';

/* mock data */
import { mockMenuItem } from '../../../assets/mockData/mockMenuItem.ts';
import { mockCart } from '../../../assets/mockData/mockCart.ts';

/* types */
import { type AppDispatch } from '../../../redux/store.ts';

/* Mock components */
vi.mock('../../../components/Loader/Loader.tsx', () => ({
  Loader: () => <div>Mocked Loader</div>,
}));

/* Mock hooks */
vi.mock('../../../customHooks/mutationHooks/useCartMutation.tsx', () => ({
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
        message: 'Please signin to add item to cart',
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
