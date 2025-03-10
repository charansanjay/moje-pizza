import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { Provider, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

/* component */
import { OrderInfo } from './OrderInfo.tsx';

/* redux */
import orderReducer from '../../../../redux/slices/orderSlice/orderSlice.ts';

/* utils */
import { formatDate } from '../../../../utils/helpers.ts';

/* mock data */
import { mockOrders } from '../../../../assets/mockData/mockOrders.ts';

// Mock the useSelector hook
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useSelector: vi.fn(),
  };
});

const mockUseSelector = useSelector as unknown as Mock;

const store = configureStore({
  reducer: {
    order: orderReducer,
  },
});

describe('OrderInfo - PAGE - COMPONENT', () => {
  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();

    mockUseSelector.mockReturnValue(mockUseSelector);
  });

  afterEach(() => {
    cleanup();
  });

  it('should render the order information', () => {
    mockUseSelector.mockReturnValue(mockOrders[0]);

    render(
      <Provider store={store}>
        <OrderInfo />
      </Provider>
    );

    expect(screen.getByText('Order Information')).toBeInTheDocument();
    expect(screen.getByText('Name:')).toBeInTheDocument();
    expect(
      screen.getAllByText(
        new RegExp(
          `${mockOrders[0]?.customer?.metaData?.firstName} ${mockOrders[0]?.customer?.metaData?.lastName}`
        )
      )[0]
    ).toBeInTheDocument();
    expect(screen.getByText('Order Date:')).toBeInTheDocument();
    expect(
      screen.getByText(formatDate(mockOrders[0].created_at!))
    ).toBeInTheDocument();
    expect(screen.getByText('Order Status:')).toBeInTheDocument();
    expect(screen.getByText(mockOrders[0].orderStatus)).toBeInTheDocument();
    expect(screen.getByText('Payment Method:')).toBeInTheDocument();
    expect(screen.getByText(mockOrders[0].paymentMethod)).toBeInTheDocument();
    expect(screen.getByText('Payment Status:')).toBeInTheDocument();
    expect(screen.getByText(mockOrders[0].paymentStatus)).toBeInTheDocument();
    expect(screen.getByText('Delivery Status:')).toBeInTheDocument();
    expect(screen.getByText(mockOrders[0].deliveryStatus)).toBeInTheDocument();
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(
      screen.getByText(mockOrders[0].customer.emailAddress)
    ).toBeInTheDocument();
    expect(screen.getByText('Delivery Address:')).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(mockOrders[0].deliveryAddress.houseAddress))
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(mockOrders[0].deliveryAddress.city))
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(mockOrders[0].deliveryAddress.pinCode))
    ).toBeInTheDocument();
    expect(screen.getByText('Phone number:')).toBeInTheDocument();
    expect(
      screen.getByText(
        new RegExp(
          mockOrders[0].deliveryAddress.phoneNumber.replace('+', '\\+')
        )
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Download Invoice:')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });
});
