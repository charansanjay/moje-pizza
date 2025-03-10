import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Menu } from './Menu.tsx';
import { useMenuItems } from '../../customHooks/useMenuItems.tsx';
import { mockMenuItems } from '../../assets/mockData/mockMenuItems.ts';

import cartReducer from '../../redux/slices/cartSlice/cartSlice.ts';
import customerReducer from '../../redux/slices/customerSlice/customerSlice.ts';
import settingsReducer from '../../redux/slices/settingsSlice/settingsSlice.ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/* Mock components */
vi.mock('../../components/Loader/Loader.tsx', () => ({
  Loader: () => <div>Mocked Loader</div>,
}));

vi.mock('../../components/FilterSort/FilterSort.tsx', () => ({
  FilterSort: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('../../components/FilterSort/ItemsPerPage/ItemsPerPage.tsx', () => ({
  ItemsPerPage: ({ onItemsPerPageChange, itemsPerPage }: any) => (
    <div>
      Mocked ItemsPerPage
      <button onClick={() => onItemsPerPageChange(itemsPerPage)}>
        Change Items Per Page
      </button>
    </div>
  ),
}));

vi.mock('../../components/Pagination/Pagination.tsx', () => ({
  Pagination: ({ currentPage, onPageChange }: any) => (
    <div>
      Mocked Pagination
      <button onClick={() => onPageChange(currentPage + 1)}>Next Page</button>
    </div>
  ),
}));

/* Mock hooks */
vi.mock('../../customHooks/useMenuItems.tsx', () => ({
  useMenuItems: vi.fn(),
}));

const store = configureStore({
  reducer: {
    cart: cartReducer,
    customer: customerReducer,
    settings: settingsReducer,
  },
});

const queryClient = new QueryClient();

const mockUseMenuItems = useMenuItems as Mock;

describe('Menu - PAGE', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    cleanup();
    mockUseMenuItems.mockReturnValue(mockUseMenuItems);
  });

  afterEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  it('should show loader when menu is loading', () => {
    mockUseMenuItems.mockReturnValue({
      menuItems: [],
      isMenuLoading: true,
    });

    render(
      <Provider store={store}>
        <Menu />
      </Provider>
    );

    expect(screen.getByText('Mocked Loader')).toBeInTheDocument();
  });

  it('should show empty state when no pizzas are found', () => {
    mockUseMenuItems.mockReturnValue({
      menuItems: [],
      isMenuLoading: false,
    });

    render(
      <Provider store={store}>
        <Menu />
      </Provider>
    );

    expect(
      screen.getByText('No pizzas found. Try adjusting your filters!')
    ).toBeInTheDocument();
  });

  it('should render the menu items after fetching', async () => {
    mockUseMenuItems.mockReturnValue({
      menuItems: mockMenuItems,
      isMenuLoading: false,
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Menu />
        </QueryClientProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(
        screen.getByText('All pizzas are prepared with tomatoes and cheese.')
      ).toBeInTheDocument();
      mockMenuItems.forEach((item) => {
        expect(screen.getByText(item.name)).toBeInTheDocument();
      });
    });
  });

  it('should show only available items when clicked Available Only checkbox', () => {
    mockUseMenuItems.mockReturnValue({
      menuItems: mockMenuItems,
      isMenuLoading: false,
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Menu />
        </QueryClientProvider>
      </Provider>
    );

    fireEvent.click(screen.getByText('Available Only'));
    // expect only two items available on the screen
    expect(screen.getByText('Pizza Pepperoni')).toBeInTheDocument();
    expect(screen.getByText('Pizza Funghi')).toBeInTheDocument();
  });

  it('should call setCurrentPage when changing page', () => {
    mockUseMenuItems.mockReturnValue({
      menuItems: mockMenuItems,
      isMenuLoading: false,
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Menu />
        </QueryClientProvider>
      </Provider>
    );

    mockMenuItems.forEach((item) => {
      expect(screen.getByText(new RegExp(item.name))).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Next Page'));

    expect(
      screen.getByText('No pizzas found. Try adjusting your filters!')
    ).toBeInTheDocument();
  });
});
