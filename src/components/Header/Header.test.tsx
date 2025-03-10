import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { Header } from './Header.tsx';

const mockStore = configureStore([]);

describe('Header - COMPONENT', () => {
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('renders header with logo and navigation links', () => {
    const store = mockStore({
      customer: { customerData: {} },
      cart: { customerCart: [] },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(screen.getByAltText('Moje Pizza')).toBeInTheDocument();
  });

  it('shows guest navigation links when no user is logged in', () => {
    const store = mockStore({
      customer: { customerData: {} },
      cart: { customerCart: [] },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  it('shows user navigation links when a user is logged in', () => {
    const store = mockStore({
      customer: { customerData: { id: 1, name: 'Charan' } },
      cart: { customerCart: [] },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    const userIcon = screen.getByTestId('user-icon');
    expect(userIcon).toBeInTheDocument();

    fireEvent.click(userIcon);

    expect(screen.getByText(/orders/i)).toBeInTheDocument();
    expect(screen.getByText(/addresses/i)).toBeInTheDocument();
    expect(screen.getByText(/add new address/i)).toBeInTheDocument();
    expect(screen.getByText(/signout/i)).toBeInTheDocument();
  });

  it('toggles dropdown when user clicks on the profile link', () => {
    const store = mockStore({
      customer: { customerData: { id: 1, name: 'Charan' } },
      cart: { customerCart: [] },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    const userIcon = screen.getByTestId('user-icon');
    expect(userIcon).toBeInTheDocument();

    // opens the dropdown
    fireEvent.click(userIcon);
    expect(screen.getByText(/orders/i)).toBeInTheDocument();
    expect(screen.getByText(/addresses/i)).toBeInTheDocument();
    expect(screen.getByText(/add new address/i)).toBeInTheDocument();
    expect(screen.getByText(/signout/i)).toBeInTheDocument();

    // closes the dropdown
    fireEvent.click(userIcon);
    expect(screen.queryByText(/orders/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/addresses/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/add new address/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/signout/i)).not.toBeInTheDocument();
  });
});
