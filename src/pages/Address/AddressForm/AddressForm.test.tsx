import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

/* component */
import { AddressForm } from './AddressForm.tsx';

/* redux-slice */
import addressReducer from '../../../redux/slices/addressSlice/addressSlice.ts';
import customerReducer from '../../../redux/slices/customerSlice/customerSlice.ts';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useHistory: () => ({
      push: vi.fn(),
    }),
  };
});

const queryClient = new QueryClient();

const store = configureStore({
  reducer: {
    address: addressReducer,
    customer: customerReducer,
  },
});

describe('AddressForm - PAGE', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  it('renders the form with all input fields', () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <AddressForm title='Test Address Form' />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Mobile Phone')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Address')).toBeInTheDocument();
    expect(screen.getByLabelText('City')).toBeInTheDocument();
    expect(screen.getByLabelText('Pin Code')).toBeInTheDocument();
    expect(screen.getByLabelText('Landmark (Optional)')).toBeInTheDocument();
  });

  it('shows validation errors when required fields are empty', async () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <AddressForm title='Test Address Form' />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    fireEvent.click(screen.getByText(/Submit/i));

    expect(
      await screen.findByText(/First name is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Last name is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Phone number is required/i)
    ).toBeInTheDocument();
    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Address is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/City is required/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/Pin code is required/i)
    ).toBeInTheDocument();
  });

  it('submits the form when all fields are valid', async () => {

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <AddressForm title='Test Address Form' />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'firstName' },
    });
    fireEvent.change(screen.getByLabelText('Last Name'), {
      target: { value: 'lastName' },
    });
    fireEvent.change(screen.getByLabelText('Mobile Phone'), {
      target: { value: '1234567890' },
    });
    fireEvent.change(screen.getByLabelText('Email Address'), {
      target: { value: 'charan@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Address'), {
      target: { value: 'house address' },
    });
    fireEvent.change(screen.getByLabelText('City'), {
      target: { value: 'City' },
    });
    fireEvent.change(screen.getByLabelText('Pin Code'), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByText('Submit'));
  });
});
