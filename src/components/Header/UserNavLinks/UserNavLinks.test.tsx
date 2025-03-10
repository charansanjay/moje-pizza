import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, afterEach } from 'vitest';

import { UserNavLinks } from './UserNavLinks.tsx';

import { mockCustomer } from '../../../assets/mockData/mockCustomer.ts';
import { mockCart, mockEmptyCart } from '../../../assets/mockData/mockCart.ts';

const mockSetIsDropdownOpen = vi.fn();

describe('UserNavLinks - COMPONENT', () => {
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('renders the shopping cart icon', () => {
    render(
      <MemoryRouter>
        <UserNavLinks
          isDropdownOpen={false}
          customer={mockCustomer}
          customerCart={mockCart}
          setIsDropdownOpen={mockSetIsDropdownOpen}
        />
      </MemoryRouter>
    );

    const cartIcon = screen.getByTestId('cart-icon');
    expect(cartIcon).toBeInTheDocument();
  });

  it('renders cart badge with 0 when there are no items in the cart', () => {
    render(
      <MemoryRouter>
        <UserNavLinks
          isDropdownOpen={false}
          customer={mockCustomer}
          customerCart={mockEmptyCart}
          setIsDropdownOpen={mockSetIsDropdownOpen}
        />
      </MemoryRouter>
    );

    const cartBadge = screen.getByText('0');
    expect(cartBadge).toBeInTheDocument();
  });

  it('renders the cart icon with the correct quantity', () => {
    render(
      <MemoryRouter>
        <UserNavLinks
          isDropdownOpen={false}
          customer={mockCustomer}
          customerCart={mockCart}
          setIsDropdownOpen={mockSetIsDropdownOpen}
        />
      </MemoryRouter>
    );

    const cartBadge = screen.getByText('2');
    expect(cartBadge).toBeInTheDocument();
  });

  it('renders the user icon and toggles dropdown on click', () => {
    render(
      <MemoryRouter>
        <UserNavLinks
          isDropdownOpen={false}
          customer={mockCustomer}
          customerCart={mockCart}
          setIsDropdownOpen={mockSetIsDropdownOpen}
        />
      </MemoryRouter>
    );

    const userIcon = screen.getByTestId('user-icon');
    expect(userIcon).toBeInTheDocument();

    fireEvent.click(userIcon);
    expect(mockSetIsDropdownOpen).toHaveBeenCalledWith(true);
  });
});
