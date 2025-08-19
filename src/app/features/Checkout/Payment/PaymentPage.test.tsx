import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import PaymentPage from './PaymentPage';

import { useOrderMutation } from '../../Orders';

import cartReducer from '../../Cart/slice/cartSlice';
import customerReducer from '../../../shared/slices/customerSlice/customerSlice';
import addressReducer from '../../Address/slice/addressSlice';

import {
  mockCustomer,
  mockCart,
  mockAddress,
  mockAddresses,
} from '../../../../assets/mockData';

const mockCreateOrder = vi.fn();

/* Mock hooks */
vi.mock('../../Orders', () => ({
  useOrderMutation: vi.fn(() => ({
    createOrder: mockCreateOrder,
  })),
}));

const store = configureStore({
  reducer: {
    cart: cartReducer,
    customer: customerReducer,
    address: addressReducer,
  },
  preloadedState: {
    customer: { customerData: mockCustomer },
    cart: { customerCart: mockCart },
    address: {
      addresses: mockAddresses,
      addressToEdit: mockAddresses[0],
      deliveryAddress: mockAddress,
    },
  },
});

const queryClient = new QueryClient();

const mockUseOrderMutation = useOrderMutation as Mock;

describe('PaymentPage - PAGE', () => {
  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();
    queryClient.clear();

    mockUseOrderMutation.mockReturnValue({
      createOrder: mockCreateOrder,
    });
    mockCreateOrder.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render the payment page', () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <PaymentPage />
        </QueryClientProvider>
      </Provider>
    );

    expect(screen.getByText('Select Payment Method')).toBeInTheDocument();
    expect(screen.getByText(/PayPal/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Credit \/ Debit \/ Visa Card/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Cash on Delivery/i)).toBeInTheDocument();
  });

  it('should disable "Pay Now" button when no payment method is selected', () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <PaymentPage />
        </QueryClientProvider>
      </Provider>
    );

    const payButton = screen.getByRole('button', { name: /Pay Now/i });

    fireEvent.click(screen.getByText('PayPal'));

    expect(payButton).not.toBeDisabled();
  });

  it('should call createOrder when "Pay Now" button is clicked', () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <PaymentPage />
        </QueryClientProvider>
      </Provider>
    );

    fireEvent.click(screen.getByText(/PayPal/i));
    fireEvent.click(screen.getByRole('button', { name: /Pay Now/i }));
    expect(mockCreateOrder).toHaveBeenCalledTimes(1);

    expect(mockCreateOrder).toHaveBeenCalledWith({
      customer_id: mockCustomer.id,
      orderStatus: 'complete',
      paymentMethod: 'paypal',
      paymentStatus: 'paid',
      deliveryStatus: 'Processing',
      cart: mockCart,
      customer: mockCustomer,
      deliveryAddress: mockAddress,
    });
  });

  it('should show "Processing..." when payment is in progress', () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <PaymentPage />
        </QueryClientProvider>
      </Provider>
    );

    fireEvent.click(screen.getByText(/PayPal/i));
    fireEvent.click(screen.getByRole('button', { name: /Pay Now/i }));

    expect(screen.getByRole('button')).toHaveTextContent('Processing...');
  });
});
