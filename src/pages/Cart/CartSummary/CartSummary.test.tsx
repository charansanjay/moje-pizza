import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

/* component */
import { CartSummary } from './CartSummary.tsx';

/* mock data */
import { mockCart } from '../../../assets/mockData/mockCart.ts';

describe('CartSummary - Page - COMPONENT', () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render the cart summary', () => {
    render(<CartSummary cartData={mockCart} />);

    expect(screen.getByText('Order Summary')).toBeInTheDocument();
    expect(screen.getByText('Subtotal:')).toBeInTheDocument();
    expect(screen.getByText(`${mockCart.cartSummary.subtotal.toFixed(2)} ${mockCart.currency}`)).toBeInTheDocument();
    expect(screen.getByText('Delivery Cost:')).toBeInTheDocument();
    expect(screen.getByText(`${mockCart.cartSummary.deliveryCost.toFixed(2)} ${mockCart.currency}`)).toBeInTheDocument();
    expect(screen.getByText(`VAT (${mockCart.cartSummary.vatRatePercentage}%):`)).toBeInTheDocument();
    expect(screen.getByText(`${mockCart.cartSummary.vat.toFixed(2)} ${mockCart.currency}`)).toBeInTheDocument();
    expect(screen.getByText('Grand Total:')).toBeInTheDocument();
    expect(screen.getByText(`${mockCart.cartSummary.grandTotal.toFixed(2)} ${mockCart.currency}`)).toBeInTheDocument();
  });

  it('should render the discount row when discount is available', () => {
    const cartWithDiscount = {
      ...mockCart,
      cartSummary: {
        ...mockCart.cartSummary,
        discountAmount: 10,
        discountPercentage: 5,
      },
    };

    render(<CartSummary cartData={cartWithDiscount} />);

    expect(screen.getByText(`Discount (${cartWithDiscount.cartSummary.discountPercentage}%):`)).toBeInTheDocument();
    expect(screen.getByText(`-${cartWithDiscount.cartSummary.discountAmount.toFixed(2)} ${cartWithDiscount.currency}`)).toBeInTheDocument();
  });

  it('should not render the discount row when discount is not available', () => {
    const cartWithoutDiscount = {
      ...mockCart,
      cartSummary: {
        ...mockCart.cartSummary,
        discountAmount: 0,
        discountPercentage: 0,
      },
    };

    render(<CartSummary cartData={cartWithoutDiscount} />);

    expect(screen.queryByText('Discount:')).not.toBeInTheDocument();
  });
});