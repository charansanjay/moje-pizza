import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { vi, describe, it, beforeEach, afterEach, expect } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { QueryClientProvider } from '@tanstack/react-query';

import { UserNavLinksDropdown } from './UserNavLinksDropdown.tsx';

import {
  resetAddressSlice,
  resetAddressToEdit,
} from '../../../redux/slices/addressSlice/addressSlice.ts';
import { logout } from '../../../redux/slices/authSlice/authSlice.ts';
import { resetCustomerSlice } from '../../../redux/slices/customerSlice/customerSlice.ts';
import { resetCartSlice } from '../../../redux/slices/cartSlice/cartSlice.ts';
import { resetSettingsSlice } from '../../../redux/slices/settingsSlice/settingsSlice.ts';
import { resetOrderSlice } from '../../../redux/slices/orderSlice/orderSlice.ts';
import { queryClient } from '../../../services/queryClient.ts';

import { mockCustomer } from '../../../assets/mockData/mockCustomer.ts';

import { type CustomerType } from '../../../services/apiCustomer.ts';

const mockStore = configureStore([]);
const store = mockStore({});
store.dispatch = vi.fn();

queryClient.removeQueries = vi.fn();

const mockSetIsDropdownOpen = vi.fn();
const mockIsDropdownOpen = true;

describe('UserNavLinksDropdown - COMPONENT', () => {
  const renderComponent = (isDropdownOpen: boolean, customer: CustomerType) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UserNavLinksDropdown
              isDropdownOpen={isDropdownOpen}
              customer={customer}
              setIsDropdownOpen={mockSetIsDropdownOpen}
            />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );
  };

  beforeEach(() => {
    store.clearActions();
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('should render dropdown links when isDropdownOpen is true and customer has id', () => {
    renderComponent(mockIsDropdownOpen, mockCustomer);
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Addresses')).toBeInTheDocument();
    expect(screen.getByText('Add New Address')).toBeInTheDocument();
    expect(screen.getByText('Signout')).toBeInTheDocument();
  });

  it('should not render dropdown links when isDropdownOpen is false', () => {
    renderComponent(!mockIsDropdownOpen, mockCustomer);

    expect(screen.queryByTestId('orders_link')).not.toBeInTheDocument();
    expect(screen.queryByTestId('address_book_link')).not.toBeInTheDocument();
    expect(screen.queryByTestId('address_new_link')).not.toBeInTheDocument();
    expect(screen.queryByTestId('signout_icon')).not.toBeInTheDocument();
  });

  it('should call setIsDropdownOpen with false when a link is clicked', () => {
    renderComponent(mockIsDropdownOpen, mockCustomer);

    fireEvent.click(screen.getByTestId('orders_link'));
    expect(mockSetIsDropdownOpen).toHaveBeenCalledWith(false);
  });

  it('should dispatch resetAddressToEdit when Add New Address is clicked', () => {
    renderComponent(mockIsDropdownOpen, mockCustomer);

    fireEvent.click(screen.getByTestId('address_new_link'));
    expect(store.dispatch).toHaveBeenCalledWith(resetAddressToEdit());
    expect(mockSetIsDropdownOpen).toHaveBeenCalledWith(false);
  });

  it('should dispatch signout and reset slices when Signout is clicked', () => {
    renderComponent(mockIsDropdownOpen, mockCustomer);

    fireEvent.click(screen.getByText('Signout'));
    expect(store.dispatch).toHaveBeenCalledWith(logout());
    expect(store.dispatch).toHaveBeenCalledWith(resetCustomerSlice());
    expect(store.dispatch).toHaveBeenCalledWith(resetCartSlice());
    expect(store.dispatch).toHaveBeenCalledWith(resetAddressSlice());
    expect(store.dispatch).toHaveBeenCalledWith(resetSettingsSlice());
    expect(store.dispatch).toHaveBeenCalledWith(resetOrderSlice());
    expect(queryClient.removeQueries).toHaveBeenCalled();
    expect(mockSetIsDropdownOpen).toHaveBeenCalledWith(false);
  });
});
