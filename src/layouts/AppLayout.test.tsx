import { screen, render, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { AppLayout } from './AppLayout.tsx';

// Mock redux store
const mockStore = configureStore([]);
const store = mockStore({
  customer: { customerData: {} },
  cart: { customerCart: {} },
});

describe('AppLayout - LAYOUT', () => {
  it('should render ScrollToTopButton', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <AppLayout />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Menu')).toBeInTheDocument();

    const footer = screen.getByTestId('footer');
    expect(footer).toBeInTheDocument();

    fireEvent.scroll(window, { target: { pageYOffset: 301 } });
    const button = screen.queryByTestId('scroll_to_top_icon');
    expect(button).toBeInTheDocument();
  });
});
