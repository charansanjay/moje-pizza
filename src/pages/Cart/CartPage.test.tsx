import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { Provider, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, useNavigate } from 'react-router-dom';

/* components */
import { CartPage } from './CartPage.tsx';

/* redux */
import cartReducer from '../../redux/slices/cartSlice/cartSlice.ts';
import customerReducer from '../../redux/slices/customerSlice/customerSlice.ts';
import addressReducer from '../../redux/slices/addressSlice/addressSlice.ts';
import settingsReducer from '../../redux/slices/settingsSlice/settingsSlice.ts';

/* mock data */
import { mockCart } from '../../assets/mockData/mockCart.ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/* Mock react-redux */
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useSelector: vi.fn(),
  };
});

vi.mock('../../components/EmptyPage/EmptyPage.tsx', () => ({
  EmptyPage: ({ message }: { message: string }) => <div>{message}</div>,
}));

vi.mock('../../components/Button/ContinueButton.tsx', () => ({
  ContinueButton: ({
    text,
    onClick,
  }: {
    text: string;
    onClick: () => void;
  }) => <button onClick={onClick}>{text}</button>,
}));

vi.mock('../../components/PageHeading/PageHeading.tsx', () => ({
  PageHeading: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const store = configureStore({
  reducer: {
    cart: cartReducer,
    customer: customerReducer,
    address: addressReducer,
    settings: settingsReducer,
  },
  preloadedState: {
    cart: { customerCart: mockCart },
  },
});

const queryClient = new QueryClient();

const mockUseSelector = useSelector as unknown as Mock;
const mockNavigate = useNavigate as unknown as Mock;

describe('CartPage - PAGE - COMPONENT', () => {
  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();

    mockUseSelector.mockReturnValue(mockUseSelector);
    mockNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  it('should render the cart page', () => {
    mockUseSelector.mockReturnValue(mockCart);
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CartPage />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    expect(screen.getByText(`Your Cart (2)`)).toBeInTheDocument();
    expect(screen.getByText('Apply Coupon')).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`${mockCart.cartSummary.grandTotal}`))
    ).toBeInTheDocument();
    expect(screen.getByText('Checkout')).toBeInTheDocument();
  });

  it('should render empty page when cart is empty', () => {
    const emptyCart = { ...mockCart, items: [] };
    mockUseSelector.mockReturnValue(emptyCart);

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CartPage />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('should navigate to checkout page when "Checkout" button is clicked', () => {
    mockUseSelector.mockReturnValue(mockCart);
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CartPage />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    fireEvent.click(screen.getByText('Checkout'));

    expect(mockNavigate).toHaveBeenCalledWith('/customer/checkout');
  });
});
