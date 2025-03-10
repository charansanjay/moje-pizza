import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';

/* component */
import { PaymentSuccessPage } from './PaymentSuccessPage.tsx';

/* Mock components */
vi.mock('../../../../components/Button/ContinueButton.tsx', () => ({
  ContinueButton: ({ text, onClick }: { text: string; onClick: () => void }) => (
    <button onClick={onClick}>{text}</button>
  ),
}));


vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const mockNavigate = useNavigate as Mock

describe('PaymentSuccessPage - PAGE - COMPONENT', () => {
;

  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();

    mockNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    cleanup();
  });

  it('should render the payment success page', () => {
    render(
      <MemoryRouter>
        <PaymentSuccessPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Payment Successful! 🎉')).toBeInTheDocument();
    expect(screen.getByText('Your order has been placed successfully. And will be delivered soon.')).toBeInTheDocument();
    expect(screen.getByText('View Order Details')).toBeInTheDocument();
  });

  it('should navigate to order details page when "View Order Details" button is clicked', () => {
    render(
      <MemoryRouter>
        <PaymentSuccessPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('View Order Details'));

    expect(mockNavigate).toHaveBeenCalledWith('/customer/order-details', { replace: true });
  });
});