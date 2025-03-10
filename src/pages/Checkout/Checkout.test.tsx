import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

/* components */
import { Checkout } from './Checkout.tsx';

/* redux */
import cartReducer from '../../redux/slices/cartSlice/cartSlice.ts';
import customerReducer from '../../redux/slices/customerSlice/customerSlice.ts';
import addressReducer from '../../redux/slices/addressSlice/addressSlice.ts';
import settingsReducer, {
  setToast,
} from '../../redux/slices/settingsSlice/settingsSlice.ts';

/* custom hooks */
import { useCustomerAddress } from '../../customHooks/useCustomerAddress.tsx';

/* mock data */
import { mockCustomer } from '../../assets/mockData/mockCustomer.ts';
import { mockAddresses } from '../../assets/mockData/mockAddress.ts';
import { mockCart } from '../../assets/mockData/mockCart.ts';

/* types */
import { type AppDispatch } from '../../redux/store.ts';

/* Mock react-redux */
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useSelector: vi.fn(),
    useDispatch: vi.fn(),
  };
});

/* Mock components */
vi.mock('./Payment/PaymentPage.tsx', async () => {
  return {
    default: () => <div>Mocked PaymentPage</div>,
  };
});

vi.mock('../../components/TaskBar/TaskBar.tsx', () => ({
  TaskBar: ({ currentStep, completedSteps }: any) => (
    <div>
      Mocked TaskBar - Step: {currentStep}, Completed:{' '}
      {completedSteps.join(', ')}
    </div>
  ),
}));

vi.mock('../../components/Loader/Loader.tsx', () => ({
  Loader: () => <div>Mocked Loader</div>,
}));

/* Mock hooks */
vi.mock('../../customHooks/useCustomerAddress.tsx', () => ({
  useCustomerAddress: vi.fn(),
}));

const store = configureStore({
  reducer: {
    cart: cartReducer,
    customer: customerReducer,
    address: addressReducer,
    settings: settingsReducer,
  },
  preloadedState: {
    customer: { customerData: mockCustomer },
    cart: { customerCart: mockCart },
    address: {
      addresses: mockAddresses,
      addressToEdit: {},
      deliveryAddress: {},
    },
  },
});

const queryClient = new QueryClient();

const mockUseCustomerAddress = useCustomerAddress as Mock;
const mockDispatch = useDispatch as AppDispatch as Mock;
const mockUseSelector = useSelector as unknown as Mock;

describe('Checkout - PAGE', () => {
  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();

    mockUseCustomerAddress.mockReturnValue(mockUseCustomerAddress);
    mockUseSelector.mockReturnValue(mockUseSelector);
    mockDispatch.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  it('should render the checkout page', async () => {
    mockUseSelector.mockReturnValue(mockCustomer);
    mockUseCustomerAddress.mockReturnValue({
      customerAddresses: mockAddresses,
      isAddressLoading: false,
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <Checkout />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    expect(screen.getByText('Checkout')).toBeInTheDocument();
    expect(
      screen.getByText('Mocked TaskBar - Step: 1, Completed:')
    ).toBeInTheDocument();
    mockAddresses.forEach((address) => {
      expect(screen.getByText(address.houseAddress)).toBeInTheDocument();
    });
  });

  it('should show loader when addresses are loading', () => {
    mockUseSelector.mockReturnValue(mockCustomer);
    mockUseCustomerAddress.mockReturnValue({
      customerAddresses: [],
      isAddressLoading: true,
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <Checkout />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    expect(screen.getByText('Mocked Loader')).toBeInTheDocument();
  });

  it('should show empty page when no addresses are found', () => {
    mockUseSelector.mockReturnValue(mockCustomer);
    mockUseCustomerAddress.mockReturnValue({
      customerAddresses: [],
      isAddressLoading: false,
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <Checkout />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    expect(screen.getByText('No Saved Address !!')).toBeInTheDocument();
  });

  it('should proceed to payment page when address is selected', () => {
    mockUseSelector.mockReturnValue(mockCustomer);
    mockUseCustomerAddress.mockReturnValue({
      customerAddresses: mockAddresses,
      isAddressLoading: false,
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <Checkout />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    fireEvent.click(screen.getByText('Continue'));

    expect(screen.getByText('Mocked PaymentPage')).toBeInTheDocument();
    expect(
      screen.getByText('Mocked TaskBar - Step: 2, Completed: 1')
    ).toBeInTheDocument();
  });

  it('should show error toast when no address is selected', () => {
    mockUseSelector.mockReturnValue(mockCustomer);
    mockUseCustomerAddress.mockReturnValue({
      customerAddresses: [{ ...mockAddresses[0], deliveryAddress: false }],
      isAddressLoading: false,
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <Checkout />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    fireEvent.click(screen.getByText('Continue'));

    expect(mockDispatch).toHaveBeenCalledWith(
      setToast({
        type: 'error',
        message: 'Please select delivery address to proceed',
        disableAutoClose: true,
      })
    );
  });

  it('should go back to address selection when back button is clicked on payment page', () => {
    mockUseSelector.mockReturnValue(mockCustomer);
    mockUseCustomerAddress.mockReturnValue({
      customerAddresses: mockAddresses,
      isAddressLoading: false,
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <Checkout />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    fireEvent.click(screen.getByText('Continue'));
    fireEvent.click(screen.getByText('Mocked TaskBar - Step: 2, Completed: 1'));

    expect(screen.getByText('Checkout')).toBeInTheDocument();
    expect(screen.getByTestId('back_arrow_icon')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('back_arrow_icon'));

    expect(
      screen.getByText('Mocked TaskBar - Step: 1, Completed:')
    ).toBeInTheDocument();
  });
});
