import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { Provider, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { OrderDetailsPage } from './OrderDetailsPage';

import orderReducer from '../slice/orderSlice';

import { mockOrders } from '../../../../assets/mockData';

/* Mock components */
vi.mock('../../../components', () => ({
  PageHeading: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock('../../Cart/components/CartItems/CartItems', () => ({
  CartItems: () => (
    <div>Mocked CartItems: {mockOrders[0].cart.items.length} items</div>
  ),
}));

vi.mock('../../Cart/components/CartSummary/CartSummary', () => ({
  CartSummary: () => (
    <div>Mocked CartSummary: {mockOrders[0].cart.cartSummary.grandTotal}</div>
  ),
}));

vi.mock('./OrderInfo/OrderInfo', () => ({
  OrderInfo: () => <div>Mocked OrderInfo</div>,
}));

// Mock the useSelector hook
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useSelector: vi.fn(),
  };
});

const queryClient = new QueryClient();

const mockUseSelector = useSelector as unknown as Mock;

const store = configureStore({
  reducer: {
    order: orderReducer,
  },
});

describe('OrderDetailsPage - PAGE - COMPONENT', () => {
  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();
    mockUseSelector.mockReturnValue(mockUseSelector);
  });

  afterEach(() => {
    cleanup();
  });

  it('should render the order details page', () => {
    mockUseSelector.mockReturnValue(mockOrders[0]);

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <OrderDetailsPage />
        </QueryClientProvider>
      </Provider>
    );

    expect(
      screen.getByText(`Order (#${mockOrders[0].id})`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `Mocked CartItems: ${mockOrders[0].cart.items.length} items`
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Mocked OrderInfo')).toBeInTheDocument();
    expect(
      screen.getByText(
        `Mocked CartSummary: ${mockOrders[0].cart.cartSummary.grandTotal}`
      )
    ).toBeInTheDocument();
  });
});
