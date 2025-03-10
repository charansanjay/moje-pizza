import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from './App';
import { describe, expect, it } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';

import settingsReducer from './redux/slices/settingsSlice/settingsSlice.ts';
import customerReducer from './redux/slices/customerSlice/customerSlice.ts';
import cartReducer from './redux/slices/cartSlice/cartSlice.ts';
import { Provider } from 'react-redux';

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
