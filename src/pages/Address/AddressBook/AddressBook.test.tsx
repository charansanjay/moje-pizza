import {
  render,
  screen,
  cleanup,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

/* component */
import { AddressBook } from './AddressBook.tsx';

/* redux-slice */
import addressReducer from '../../../redux/slices/addressSlice/addressSlice.ts';
import customerReducer from '../../../redux/slices/customerSlice/customerSlice.ts';

/* customHooks */
import { useCustomerAddress } from '../../../customHooks/useCustomerAddress.tsx';

/* mock data */
import { mockAddresses } from '../../../assets/mockData/mockAddress.ts';

// Mock dependencies

vi.mock('../../../components/Loader/Loader', () => ({
  Loader: vi.fn(() => <div>Mocked Loader</div>),
}));

vi.mock('../../../components/PageHeading/PageHeading', () => ({
  PageHeading: vi.fn(({ title }) => <div>{title}</div>),
}));

vi.mock('../../../customHooks/useCustomerAddress.tsx', () => ({
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
