import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Pagination } from './Pagination';

const mockOnPageChange = vi.fn();

describe('Pagination - COMPONENT', () => {
  const renderComponent = (
    currentPage: number,
    totalItems: number,
    itemsPerPage: number
  ) =>
    render(
      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={mockOnPageChange}
      />
    );

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it('renders the select element with correct options', () => {
    renderComponent(1, 50, 10);

    const select = screen.getByTestId('select_pagination');
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('1');

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(5);

    options.forEach((option, index) => {
      expect(option).toHaveValue((index + 1).toString());
      expect(option).toHaveTextContent((index + 1).toString());
    });
  });

  it(
    'calls onPageChange with the correct value when an option is selected',
    () => {
      renderComponent(1, 50, 10);
      const select = screen.getByTestId('select_pagination');
      fireEvent.change(select, { target: { value: '3' } });
      expect(mockOnPageChange).toHaveBeenCalledWith(3);
    }
  );

  it('disables the Previous button on the first page', () => {
    renderComponent(1, 50, 10);
    const prevButton = screen.getByText('Previous');
    expect(prevButton).toBeDisabled();
  });

  it('disables the Next button on the last page', () => {
    renderComponent(5, 50, 10);
    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  it('enables the Previous and Next buttons on a middle page', () => {
    renderComponent(3, 50, 10);
    const prevButton = screen.getByText('Previous');
    const nextButton = screen.getByText('Next');
    expect(prevButton).not.toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });
});
