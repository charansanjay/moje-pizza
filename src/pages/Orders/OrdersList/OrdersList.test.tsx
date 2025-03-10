import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/* component */
import { OrdersList } from './OrdersList.tsx';

import orderReducer, {
  setSelectedOrder,
} from '../../../redux/slices/orderSlice/orderSlice.ts';

/* hooks */
import { useCustomerOrders } from '../../../customHooks/useCustomerOrders.tsx';

/* mock data */
import { mockOrders } from '../../../assets/mockData/mockOrders.ts';
import { mockCustomer } from '../../../assets/mockData/mockCustomer.ts';

/* types */
import {type  AppDispatch } from '../../../redux/store.ts';

/* Mock components */
vi.mock('../../../components/Loader/Loader.tsx', () => ({
  Loader: () => <div>Mocked Loader</div>,
}));

vi.mock('../../../components/EmptyPage/EmptyPage.tsx', () => ({
  EmptyPage: ({ message }: { message: string }) => <div>{message}</div>,
}));

vi.mock('../../../components/PageHeading/PageHeading.tsx', () => ({
  PageHeading: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock('../../../components/FilterSort/FilterSort.tsx', () => ({
  FilterSort: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('../../../components/FilterSort/Sort/Sort.tsx', () => ({
  Sort: ({ itemsToSort, setSortedItems }: any) => (
    <div>
      Mocked Sort
      <button onClick={() => setSortedItems(itemsToSort)}>Sort</button>
    </div>
  ),
}));

vi.mock('../../../components/FilterSort/ItemsPerPage/ItemsPerPage.tsx', () => ({
  ItemsPerPage: ({ onItemsPerPageChange, itemsPerPage }: any) => (
    <div>
      Mocked ItemsPerPage
      <button onClick={() => onItemsPerPageChange(itemsPerPage)}>
        Change Items Per Page
      </button>
    </div>
  ),
}));

vi.mock('../../../components/Pagination/Pagination.tsx', () => ({
  Pagination: ({
    currentPage,
    onPageChange,
  }: any) => (
    <div>
      Mocked Pagination
      <button onClick={() => onPageChange(currentPage + 1)}>Next Page</button>
    </div>
  ),
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// Mock the useSelector hook
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useSelector: vi.fn(),
    useDispatch: vi.fn(),
  };
});

// Mock the custom hook
vi.mock('../../../customHooks/useCustomerOrders.tsx', () => {
  return {
    useCustomerOrders: vi.fn(),
  };
});

const queryClient = new QueryClient();

const mockUseSelector = useSelector as unknown as Mock;
const mockUseCustomerOrders = useCustomerOrders as Mock;
const mockDispatch = useDispatch as AppDispatch as Mock;
const mockNavigate = useNavigate as Mock;

const store = configureStore({
  reducer: {
    order: orderReducer,
  },
});

describe('OrdersList - PAGE', () => {
  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();
    queryClient.clear();

    mockUseSelector.mockReturnValue(mockUseSelector);
    mockUseCustomerOrders.mockReturnValue(mockUseCustomerOrders);
    mockDispatch.mockReturnValue(mockDispatch);
    mockNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it('should render the orders list page', () => {
    mockUseSelector.mockReturnValue({
      customer: mockCustomer,
    });
    mockUseCustomerOrders.mockReturnValue({
      orders: mockOrders,
      isOrdersLoading: false,
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <OrdersList />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Mocked Sort')).toBeInTheDocument();
    expect(screen.getByText('Mocked ItemsPerPage')).toBeInTheDocument();
    expect(screen.getByText('Mocked Pagination')).toBeInTheDocument();
    expect(screen.getByText('Order ID')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Order Status')).toBeInTheDocument();
    expect(screen.getByText('Delivery Status')).toBeInTheDocument();
    expect(screen.getByText('Payment Method')).toBeInTheDocument();
    expect(screen.getByText('Payment Status')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('should render no orders message when orders array is empty', () => {
    mockUseSelector.mockReturnValue({
      customer: mockCustomer,
    });
    mockUseCustomerOrders.mockReturnValue({
      orders: [],
      isOrdersLoading: true,
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <OrdersList />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    expect(screen.getByText('No Orders Found !!')).toBeInTheDocument();
  });

  it('should render empty page when no orders', () => {
    mockUseSelector.mockReturnValue({
      customer: mockCustomer,
    });
    mockUseCustomerOrders.mockReturnValue({
      orders: [],
      isOrdersLoading: false,
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <OrdersList />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    expect(screen.getByText('No Orders Found !!')).toBeInTheDocument();
  });

  it('should render orders table when orders are available', () => {
    mockUseSelector.mockReturnValue({
      customer: mockCustomer,
    });

    mockUseCustomerOrders.mockReturnValue({
      orders: mockOrders,
      isOrdersLoading: false,
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <OrdersList />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    mockOrders.forEach((order) => {
      expect(screen.getByText(`#${order.id}`)).toBeInTheDocument();
      expect(screen.getByText(order.orderStatus)).toBeInTheDocument();
      expect(screen.getByText(order.deliveryStatus)).toBeInTheDocument();
      expect(screen.getByText(order.paymentMethod)).toBeInTheDocument();
      expect(screen.getByText(order.paymentStatus)).toBeInTheDocument();
    });
  });

  it('should navigate to order details page when "View" button is clicked', () => {
    mockUseSelector.mockReturnValue({
      customer: mockCustomer,
    });

    mockUseCustomerOrders.mockReturnValue({
      orders: mockOrders,
      isOrdersLoading: false,
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <OrdersList />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    fireEvent.click(screen.getAllByText('View')[0]);

    expect(mockDispatch).toHaveBeenCalledWith(setSelectedOrder(mockOrders[0]));
    expect(mockNavigate).toHaveBeenCalledWith('/customer/order-details');
  });
});
