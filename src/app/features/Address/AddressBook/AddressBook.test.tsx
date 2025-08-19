import { render, screen, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

import { AddressBook } from './AddressBook';

import addressReducer from '../slice/addressSlice';
import customerReducer from '../../../shared/slices/customerSlice/customerSlice';

import { useCustomerAddress } from '../hooks/queries/useCustomerAddress';

import { mockAddresses } from '../../../../assets/mockData';

// Mock dependencies
vi.mock('../../../components/Loader/Loader', () => ({
  Loader: vi.fn(() => <div>Mocked Loader</div>),
}));

vi.mock('../../../components/PageHeading/PageHeading', () => ({
  PageHeading: vi.fn(({ title }) => <div>{title}</div>),
}));

vi.mock('../hooks/queries/useCustomerAddress', () => ({
  useCustomerAddress: vi.fn(),
}));

const store = configureStore({
  reducer: {
    address: addressReducer,
    customer: customerReducer,
  },
});

const queryClient = new QueryClient();

const mockUseCustomerAddress = useCustomerAddress as Mock;

describe('AddressBook - PAGE', () => {
  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it('should render loader when loading', () => {
    mockUseCustomerAddress.mockReturnValue({
      isAddressLoading: true,
      customerAddresses: [],
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <AddressBook />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    expect(screen.getByText('Mocked Loader')).toBeInTheDocument();
  });

  it('should render empty page when no addresses', () => {
    mockUseCustomerAddress.mockReturnValue({
      isAddressLoading: false,
      customerAddresses: [],
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <AddressBook />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    expect(screen.getByText('No Saved Address !!')).toBeInTheDocument();
    expect(screen.getByText('Add Address')).toBeInTheDocument();
  });

  it('should render address list when addresses are available', () => {
    mockUseCustomerAddress.mockReturnValue({
      isAddressLoading: false,
      customerAddresses: mockAddresses,
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <AddressBook />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    expect(
      screen.getByText(`Your Addresses (${mockAddresses.length})`)
    ).toBeInTheDocument();
    mockAddresses.forEach((address) => {
      expect(screen.getByText(address.houseAddress)).toBeInTheDocument();
    });
  });
});
