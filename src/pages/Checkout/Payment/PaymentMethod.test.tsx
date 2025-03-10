import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/* component */
import { PaymentMethod } from './PaymentMethod.tsx';
import styles from './PaymentMethod.module.css';

const mockOnSelect = vi.fn();

describe('PaymentMethod - PAGE - COMPONENT', () => {
  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();

    mockOnSelect.mockReturnValue(mockOnSelect);
  });

  afterEach(() => {
    cleanup();
  });

  const defaultProps = {
    label: 'Credit Card',
    icon: '💳',
    isSelected: false,
    onSelect: mockOnSelect,
    selectable: true,
  };

  it('should render the payment method button', () => {
    render(<PaymentMethod {...defaultProps} />);

    expect(screen.getByText('💳')).toBeInTheDocument();
    expect(screen.getByText('Credit Card')).toBeInTheDocument();
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('should apply selected class when isSelected is true', () => {
    render(<PaymentMethod {...defaultProps} isSelected={true} />);

    const button = screen.getByRole('radio');
    expect(button).toHaveClass(styles.selected);
    expect(button).toHaveAttribute('aria-checked', 'true');
  });

  it('should apply selectable class when selectable is true', () => {
    render(<PaymentMethod {...defaultProps} selectable={true} />);

    const button = screen.getByRole('radio');
    expect(button).toHaveClass(styles.selectable);
  });

  it('should call onSelect when button is clicked', () => {
    render(<PaymentMethod {...defaultProps} />);

    const button = screen.getByRole('radio');
    fireEvent.click(button);

    expect(mockOnSelect).toHaveBeenCalled();
  });

  it('should not call onSelect when button is not selectable', () => {
    render(<PaymentMethod {...defaultProps} selectable={false} />);

    const button = screen.getByRole('radio');
    expect(button).not.toHaveClass(styles.selectable);
  });
});
