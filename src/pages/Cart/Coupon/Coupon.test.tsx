import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/* component */
import { Coupon } from './Coupon.tsx';

/* redux */
import cartReducer from '../../../redux/slices/cartSlice/cartSlice.ts';
import settingsReducer, {
  setToast,
} from '../../../redux/slices/settingsSlice/settingsSlice.ts';

/* custom hooks */
import { useCartMutation } from '../../../customHooks/mutationHooks/useCartMutation.tsx';

/* mock data */
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

/* Mock hooks */
vi.mock('../../../customHooks/mutationHooks/useCartMutation.tsx', () => ({
  useCartMutation: vi.fn(() => {
    return {
      applyCouponDiscount: vi.fn(),
    };
  }),
}));

const store = configureStore({
  reducer: {
    cart: cartReducer,
    settings: settingsReducer,
  },
  preloadedState: {
    cart: { customerCart: mockCart },
  },
});

const queryClient = new QueryClient();

const mockUseSelector = useSelector as unknown as Mock;
const mockDispatch = useDispatch as AppDispatch as Mock;
const mockUseCartMutation = useCartMutation as Mock;
const mockApplyCoupon = vi.fn();

describe('Coupon - COMPONENT', () => {
  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();
    queryClient.clear();

    mockUseSelector.mockReturnValue(mockCart);
    mockApplyCoupon.mockReturnValue(mockApplyCoupon);
    mockUseCartMutation.mockReturnValue(mockUseCartMutation);
    mockDispatch.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  it('should render the coupon component', () => {
    mockUseCartMutation.mockReturnValue({
      isLoading: false,
      applyCouponDiscount: mockApplyCoupon,
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Coupon cartData={mockCart} />
        </QueryClientProvider>
      </Provider>
    );

    expect(
      screen.getByPlaceholderText('Enter code - DISCOUNT15')
    ).toBeInTheDocument();
    expect(screen.getByText('Apply Coupon')).toBeInTheDocument();
  });

  it('should show error toast when no coupon code is entered', () => {
    mockUseCartMutation.mockReturnValue({
      isLoading: false,
      applyCouponDiscount: mockApplyCoupon,
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Coupon cartData={mockCart} />
        </QueryClientProvider>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter code - DISCOUNT15'), {
      target: { value: '' },
    });

    fireEvent.click(screen.getByText('Apply Coupon'));

    expect(mockDispatch).toHaveBeenCalledWith(
      setToast({ message: 'Please enter coupon code', type: 'error' })
    );
  });

  it('should call applyCoupon when coupon code is entered', () => {
    mockUseCartMutation.mockReturnValue({
      isLoading: false,
      applyCouponDiscount: mockApplyCoupon,
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Coupon cartData={mockCart} />
        </QueryClientProvider>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter code - DISCOUNT15'), {
      target: { value: 'DISCOUNT15' },
    });
    fireEvent.click(screen.getByText('Apply Coupon'));

    expect(mockApplyCoupon).toHaveBeenCalled();
  });

  it('should show loading state when coupon is being applied', () => {
    mockUseCartMutation.mockReturnValue({
      isLoading: true,
      applyCouponDiscount: mockApplyCoupon,
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Coupon cartData={mockCart} />
        </QueryClientProvider>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter code - DISCOUNT15'), {
      target: { value: 'DISCOUNT15' },
    });

    expect(screen.getByText(/Applying.../i)).toBeInTheDocument();
  });

  it('should not render the coupon component when discount is already applied', () => {
    const cartWithDiscount = {
      ...mockCart,
      cartSummary: {
        ...mockCart.cartSummary,
        discountPercentage: 10,
      },
    };

    mockUseCartMutation.mockReturnValue({
      isLoading: false,
      applyCouponDiscount: mockApplyCoupon,
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Coupon cartData={cartWithDiscount} />
        </QueryClientProvider>
      </Provider>
    );

    expect(
      screen.queryByPlaceholderText('Enter code - DISCOUNT15')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Apply Coupon')).not.toBeInTheDocument();
  });
});
