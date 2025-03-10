import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';

import { Sort } from './Sort.tsx';

import { mockMenuItems } from '../../../assets/mockData/mockMenuItems.ts';
import { options } from '../../../pages/Menu/Menu.tsx';

const mockSetSortedItems = vi.fn();

describe('Sort - COMPONENT', () => {
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('should render without crashing', async () => {
    render(
      <Sort
        options={options}
        itemsToSort={mockMenuItems}
        setSortedItems={mockSetSortedItems}
      />
    );
    expect(screen.getByText('Sort by: Name')).toBeInTheDocument();
  });

  it('sorts menu items by name ascending', async () => {
    render(
      <Sort
        options={options}
        itemsToSort={mockMenuItems}
        setSortedItems={mockSetSortedItems}
      />
    );

    // Simulate selecting "Sort by: Name Asc"
    const select = screen.getByText('Sort by: Name');
    fireEvent.mouseDown(select);
    const option = screen.getAllByText('Sort by: Name')[0];
    fireEvent.click(option);

    expect(mockSetSortedItems).toHaveBeenCalledWith([
      mockMenuItems[2], // Pizza Funghi
      mockMenuItems[0], // Pizza Margherita
      mockMenuItems[1], // Pizza Pepperoni
    ]);
  });

  it('sorts menu items by name descending', async () => {
    render(
      <Sort
        options={options}
        itemsToSort={mockMenuItems}
        setSortedItems={mockSetSortedItems}
      />
    );

    // Simulate selecting "Sort by: Name Desc"
    const select = screen.getByText('Sort by: Name');
    fireEvent.mouseDown(select);
    const option = screen.getAllByRole('option');
    fireEvent.click(option[1]);

    expect(mockSetSortedItems).toHaveBeenCalledWith([
      mockMenuItems[1], // Pizza Pepperoni
      mockMenuItems[0], // Pizza Margherita
      mockMenuItems[2], // Pizza Funghi
    ]);
  });

  it('sorts menu items by price ascending', async () => {
    render(
      <Sort
        options={options}
        itemsToSort={mockMenuItems}
        setSortedItems={mockSetSortedItems}
      />
    );

    // Simulate selecting "Sort by: Price Desc"
    const select = screen.getByText('Sort by: Name');
    fireEvent.mouseDown(select);
    const option = screen.getAllByText('Sort by: Price')[0];
    fireEvent.click(option);

    expect(mockSetSortedItems).toHaveBeenCalledWith([
      mockMenuItems[0], // Pizza Pepperoni
      mockMenuItems[2], // Pizza Funghi
      mockMenuItems[1], // Pizza Margherita
    ]);
  });

  it('sorts menu items by price descending', async () => {
    render(
      <Sort
        options={options}
        itemsToSort={mockMenuItems}
        setSortedItems={mockSetSortedItems}
      />
    );

    // Simulate selecting "Sort by: Price Desc"
    const select = screen.getByText('Sort by: Name');
    fireEvent.mouseDown(select);
    const option = screen.getAllByText('Sort by: Price')[1];
    fireEvent.click(option);

    expect(mockSetSortedItems).toHaveBeenCalledWith([
      mockMenuItems[1], // Pizza Pepperoni
      mockMenuItems[2], // Pizza Funghi
      mockMenuItems[0], // Pizza Margherita
    ]);
  });
});
