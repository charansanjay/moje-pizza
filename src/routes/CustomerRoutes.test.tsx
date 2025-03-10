import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../services/queryClient.ts';

/* component */
import { CustomerRoutes } from './CustomerRoutes.tsx';

/* mock data */
import { mockCustomer } from '../assets/mockData/mockCustomer.ts';
import { mockAddresses } from '../assets/mockData/mockAddress.ts';
import { mockCart } from '../assets/mockData/mockCart.ts';

/* redux */
import authReducer from '../redux/slices/authSlice/authSlice.ts';
import customerReducer from '../redux/slices/customerSlice/customerSlice.ts';
import cartReducer from '../redux/slices/cartSlice/cartSlice.ts';
import addressReducer from '../redux/slices/addressSlice/addressSlice.ts';
import settingsReducer from '../redux/slices/settingsSlice/settingsSlice.ts';

const store = configureStore({
  reducer: {
    auth: authReducer,
    customer: customerReducer,
    cart: cartReducer,
    address: addressReducer,
    settings: settingsReducer,
  },
  preloadedState: {
    auth: { isAuthenticated: true },
    customer: { customerData: mockCustomer },
    cart: { customerCart: mockCart },
    address: {
      addresses: [],
      addressToEdit: mockAddresses[0],
      deliveryAddress: mockAddresses[0],
    },
    settings: { toast: null },
  },
});

describe('CustomerRoutes - ROUTE', () => {
  beforeEach(() => {
    cleanup();
    queryClient.clear();
  });

  afterEach(() => {
    cleanup();
    queryClient.clear();
  });

  it('should render the AddressBook page when navigating to /customer/address-book', async () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/address-book']}>
            <CustomerRoutes />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    // Wait for the Content to Appear
    await waitFor(() => {
      expect(screen.getByText('No Saved Address !!')).toBeInTheDocument();
    });
  });

  it('should render the AddAddress page when navigating to /customer/address-new', async () => {
    store.dispatch({ type: 'address/setAddressToEdit', payload: {} });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/address-new']}>
            <CustomerRoutes />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Add New Address')).toBeInTheDocument();
    });
  });

  it('should show Edit Address heading when address is passed while navigating', async () => {
    store.dispatch({
      type: 'address/setAddressToEdit',
      payload: mockAddresses[0],
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/address-new']}>
            <CustomerRoutes />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Edit Address/i)).toBeInTheDocument();
    });
  });

  it('should render the CartPage when navigating to /customer/cart', async () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/cart']}>
            <CustomerRoutes />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Your Cart/i)).toBeInTheDocument();
    });
  });

  it('should show the Loader when a page is loading (Suspense fallback)', async () => {
    store.dispatch({ type: 'customer/setCustomer', payload: {} });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/address-book']}>
            <CustomerRoutes />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });
});
