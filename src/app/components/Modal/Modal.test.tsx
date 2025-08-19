import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { Modal } from './Modal.tsx';

const mockOnClose = vi.fn();
const mockOnConfirm = vi.fn();

describe('Modal - COMPONENT', () => {
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
    title: 'Test Title',
    message: 'Test Message',
  };

  it('should render the modal with title and message', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('should call onClose when clicking on the overlay', () => {
    render(<Modal {...defaultProps} />);
    fireEvent.click(screen.getByTestId('modal_overlay'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onConfirm when clicking the Delete button', () => {
    render(<Modal {...defaultProps} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(mockOnConfirm).toHaveBeenCalled();
  });

  it('should call onClose when clicking the Cancel button', () => {
    render(<Modal {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should not render the modal when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Message')).not.toBeInTheDocument();
  });
});
