import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { Provider, useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

/* components */
import { CartItems } from './CartItems.tsx';

/* redux */
import cartReducer from '../../../redux/slices/cartSlice/cartSlice.ts';
import customerReducer from '../../../redux/slices/customerSlice/customerSlice.ts';
import addressReducer from '../../../redux/slices/addressSlice/addressSlice.ts';
import settingsReducer from '../../../redux/slices/settingsSlice/settingsSlice.ts';

/* custom hooks */
import { useCartMutation } from '../../../customHooks/mutationHooks/useCartMutation.tsx';

/* mock data */
import { mockCustomer } from '../../../assets/mockData/mockCustomer.ts';
import { mockCart } from '../../../assets/mockData/mockCart.ts';

/* types */
import { type AppDispatch } from '../../../redux/store.ts';

/* Mock react-redux */
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useSelector: vi.fn(),
    useDispatch: vi.fn(),
  };
});

/* Mock components */
vi.mock('../../../components/Loader/Loader.tsx', () => ({
  Loader: () => <div>Mocked Loader</div>,
}));

vi.mock('../../../components/Modal/Modal.tsx', () => ({
  Modal: ({ isOpen, onClose, onConfirm, title, message }: any) =>
    isOpen ? (
      <div>
        <div>{title}</div>
        <div>{message}</div>
        <button onClick={onClose}>Close</button>
        <button onClick={onConfirm}>Confirm</button>
      </div>
    ) : null,
}));

/* Mock hooks */
vi.mock('../../../customHooks/mutationHooks/useCartMutation.tsx', () => ({
  useCartMutation: vi.fn(() => {
    return {
      deleteCartItem: vi.fn(),
      updateCartItemQuantity: vi.fn(),
    };
  }),
}));

const store = configureStore({
  reducer: {
    cart: cartReducer,
    customer: customerReducer,
    address: addressReducer,
    settings: settingsReducer,
  },
  preloadedState: {
    customer: { customerData: mockCustomer },
    cart: { customerCart: mockCart },
  },
});

const queryClient = new QueryClient();

const mockUseCartMutation = useCartMutation as Mock;
const mockDispatch = useDispatch as AppDispatch as Mock;
const mockDeleteCartItem = vi.fn();
const mockUpdateCartItemQuantity = vi.fn();

describe('CartItems - PAGE - COMPONENT', () => {
  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();

    mockUseCartMutation.mockReturnValue({
      isLoading: false,
      deleteCartItem: mockDeleteCartItem,
      updateCartItemQuantity: mockUpdateCartItemQuantity,
    });

    mockDispatch.mockReturnValue(mockDispatch);
    mockDeleteCartItem.mockReturnValue(mockDeleteCartItem);
    mockUpdateCartItemQuantity.mockReturnValue(mockUpdateCartItemQuantity);
  });

  afterEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  it('should render the cart items', async () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CartItems showActions={true} cartData={mockCart} />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    mockCart.items.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });

  it('should show loader when cart items are loading', () => {
    mockUseCartMutation.mockReturnValue({
      isLoading: true,
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CartItems showActions={true} cartData={mockCart} />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    expect(screen.getByText('Mocked Loader')).toBeInTheDocument();
  });

  it('should call deleteCartItem when delete button is clicked', () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CartItems showActions={true} cartData={mockCart} />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    fireEvent.click(screen.getAllByTestId('delete_icon')[0]);

    fireEvent.click(screen.getAllByText('Confirm')[0]);

    expect(mockDeleteCartItem).toHaveBeenCalledWith({
      itemToDelete: mockCart.items[0],
      cartData: mockCart,
    });
  });

  it('should call updateCartItemQuantity when quantity is changed', () => {
    const modifiedCartObject = {
      itemToUpdate: {
        ...mockCart.items[0],
        quantity: mockCart.items[0].quantity + 1,
        rowTotal: (mockCart.items[0].quantity + 1) * mockCart.items[0].price,
      },
      cartData: mockCart,
    };

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CartItems showActions={true} cartData={mockCart} />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    fireEvent.click(screen.getAllByTestId('plus_icon')[0]);

    expect(mockUpdateCartItemQuantity).toHaveBeenCalledWith(modifiedCartObject);
  });
});
