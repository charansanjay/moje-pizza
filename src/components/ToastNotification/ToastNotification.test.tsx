import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ToastContainer, ToastNotification } from './ToastNotification.tsx';
import { describe, expect, it, vi } from 'vitest';

const mockStore = configureStore({
  reducer: {
    settings: (state = { toast: null }, action) => {
      switch (action.type) {
        case 'SET_TOAST':
          return { ...state, toast: action.payload };
        default:
          return state;
      }
    },
  },
});

describe('ToastNotification - COMPONENT', () => {
  it('renders ToastNotification component', () => {
    render(
      <Provider store={mockStore}>
        <ToastNotification />
      </Provider>
    );
    expect(screen.queryByText(/success/i)).toBeNull();
  });

  it('displays a toast message', () => {
    mockStore.dispatch({
      type: 'SET_TOAST',
      payload: { message: 'Test Message', type: 'success' },
    });

    render(
      <Provider store={mockStore}>
        <ToastNotification />
      </Provider>
    );

    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();

    render(
      <ToastContainer
        id='test-toast'
        message='Test Message'
        type='success'
        disableAutoClose
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByTestId('close_toast_icon'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
