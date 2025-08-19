import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { App } from './App';

import settingsReducer from './store/slices/settingsSlice/settingsSlice';
import customerReducer from './shared/slices/customerSlice/customerSlice';
import cartReducer from './features/Cart/slice/cartSlice';

const queryClient = new QueryClient();

const store = configureStore({
  reducer: {
    settings: settingsReducer,
    customer: customerReducer,
    cart: cartReducer,
  },
});

describe('App - COMPONENT', () => {
  it('renders AppRoute component', async () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </Provider>
    );

    //  some text from the AppRoute components - /home
    await waitFor(() =>
      expect(screen.getByText(/Welcome to Moje Pizza/i)).toBeInTheDocument()
    );
  });
});
