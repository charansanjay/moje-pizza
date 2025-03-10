import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';

import { ItemsPerPage } from './ItemsPerPage.tsx';

const onItemsPerPageChange = vi.fn();

describe('ItemsPerPage - COMPONENT', () => {
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('renders without crashing', () => {
    render(<ItemsPerPage onItemsPerPageChange={() => {}} itemsPerPage={8} />);
    expect(screen.getByText('8 per page')).toBeInTheDocument();
  });

  it('renders with default value', () => {
    render(<ItemsPerPage onItemsPerPageChange={() => {}} itemsPerPage={8} />);
    const selectElement = screen.getByText('8 per page');
    expect(selectElement).toBeInTheDocument();
  });

  it('calls onItemsPerPageChange when a new option is selected', () => {
    render(
      <ItemsPerPage
        onItemsPerPageChange={onItemsPerPageChange}
        itemsPerPage={8}
      />
    );

    const selectElement = screen.getByText('8 per page');
    fireEvent.keyDown(selectElement, { key: 'ArrowDown', code: 'ArrowDown' });

    const optionElement = screen.getByText('12 per page');
    fireEvent.click(optionElement);

    expect(onItemsPerPageChange).toHaveBeenCalledWith(12);
  });

  it('updates the selected option when a new option is selected', () => {
    render(
      <ItemsPerPage
        onItemsPerPageChange={onItemsPerPageChange}
        itemsPerPage={8}
      />
    );

    const selectElement = screen.getByText('8 per page');
    fireEvent.keyDown(selectElement, { key: 'ArrowDown', code: 'ArrowDown' });
    const optionElement = screen.getByText('12 per page');
    fireEvent.click(optionElement);

    const updatedSelectElement = screen.getByText('12 per page');
    expect(updatedSelectElement).toBeInTheDocument();
  });
});
