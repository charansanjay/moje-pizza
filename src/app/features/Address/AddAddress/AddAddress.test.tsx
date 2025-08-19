import { render, screen, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';

import { AddAddress } from './AddAddress';

import addressReducer, { setAddressToEdit } from '../slice/addressSlice';
import customerReducer from '../../../shared/slices/customerSlice/customerSlice';

import { mockAddress } from '../../../../assets/mockData';

// mock redux store
const store = configureStore({
  reducer: {
    address: addressReducer,
    customer: customerReducer,
  },
});

const queryClient = new QueryClient();

describe('AddAddress - PAGE', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  it('should render Add New Address heading when there is no address to edit', () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <AddAddress />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    expect(screen.getByText('Add New Address')).toBeInTheDocument();
  });

  it('should render Edit Address heading when there is an address to edit', () => {
    // make editAddress available in the addressSlice
    store.dispatch(setAddressToEdit(mockAddress));

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <AddAddress />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    expect(screen.getByText('Edit Address')).toBeInTheDocument();
  });

  it('should render AddressForm component', () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <AddAddress />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    expect(document.querySelector('form')).toBeInTheDocument();
  });
});
