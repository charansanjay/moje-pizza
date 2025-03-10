import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, useNavigate } from 'react-router-dom';

/* component */
import { AddressItem } from './AddressItem.tsx';

/* redux-slice */
import addressReducer from '../../../../redux/slices/addressSlice/addressSlice.ts';
import customerReducer from '../../../../redux/slices/customerSlice/customerSlice.ts';

/* customHooks */
import { useCustomerAddress } from '../../../../customHooks/useCustomerAddress.tsx';
import { useAddressMutation } from '../../../../customHooks/mutationHooks/useAddressMutation.tsx';

/* mock data */
import { mockAddress } from '../../../../assets/mockData/mockAddress.ts';

// Mock dependencies
vi.mock('../../../../components/Modal/Modal', () => ({
  Modal: vi.fn(() => <div>Mocked Modal</div>),
}));

vi.mock('../../../../components/Loader/Loader', () => ({
  Loader: vi.fn(() => <div>Mocked Loader</div>),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('../../../../customHooks/useCustomerAddress.tsx', () => ({
  useCustomerAddress: vi.fn(),
}));

vi.mock('../../../../customHooks/mutationHooks/useAddressMutation.tsx', () => ({
  useAddressMutation: vi.fn(() => {
    return {
      updateDeliveryAddress: vi.fn(),
    };
  }),
}));

const store = configureStore({
  reducer: {
    address: addressReducer,
    customer: customerReducer,
  },
});

const queryClient = new QueryClient();

const mockNavigate = useNavigate as Mock;
const mockUseCustomerAddress = useCustomerAddress as Mock;
const mockUseAddressMutation = useAddressMutation as Mock;
const mockUpdateDeliveryAddress = vi.fn();

describe('AddressItem - PAGE - COMPONENT', () => {
  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();
    mockNavigate.mockReturnValue(mockNavigate);
    mockUseCustomerAddress.mockReturnValue(mockUseCustomerAddress);
    mockUseAddressMutation.mockReturnValue(mockUseAddressMutation);
    mockUpdateDeliveryAddress.mockReturnValue(mockUpdateDeliveryAddress);
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it('should render address details', async () => {
    mockUseCustomerAddress.mockReturnValue({
      isAddressLoading: false,
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <AddressItem address={mockAddress} showButtons={true} />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('firstName lastName')).toBeInTheDocument();
      expect(
        screen.getByText((_, element) => {
          return element?.textContent === 'Street: streetAddress';
        })
      ).toBeInTheDocument();
      expect(
        screen.getByText((_, element) => {
          return element?.textContent === 'Phone: +420 771 234 567';
        })
      ).toBeInTheDocument();
    });
  });

  it('should show loader when loading', () => {
    mockUseCustomerAddress.mockReturnValue({
      isAddressLoading: true,
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <AddressItem address={mockAddress} showButtons={true} />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    expect(screen.getByText('Mocked Loader')).toBeInTheDocument();
  });

  it('should handle edit address', () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <AddressItem address={mockAddress} showButtons={true} />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    fireEvent.click(screen.getByTitle('Edit'));
    expect(mockNavigate).toHaveBeenCalledWith('/customer/address-new');
  });

  it('should open modal on delete', () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <AddressItem address={mockAddress} showButtons={true} />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    fireEvent.click(screen.getByTitle('Delete'));
    expect(screen.getByText('Mocked Modal')).toBeInTheDocument();
  });

  it('should handle set default address', async () => {
    mockUseAddressMutation.mockReturnValue({
      updateDeliveryAddress: mockUpdateDeliveryAddress,
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <AddressItem
              address={{ ...mockAddress, deliveryAddress: false }}
              showButtons={true}
            />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    const setDefaultAddress = screen.getByText('Set as delivery address');
    expect(setDefaultAddress).toBeInTheDocument();

    fireEvent.click(setDefaultAddress);

    expect(mockUpdateDeliveryAddress).toHaveBeenCalled();
  });
});
