import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useSort } from './useSort.tsx';

import { type SortOptionsType } from '../pages/Menu/Menu.tsx';
import { FaLongArrowAltDown, FaLongArrowAltUp } from 'react-icons/fa';

describe('useSort - HOOK', () => {
  const itemsToSort = [
    { name: 'Pizza Margherita', price: 8, created_at: '2023-01-01' },
    { name: 'Pizza Pepperoni', price: 10, created_at: '2023-02-01' },
    { name: 'Pizza Funghi', price: 9, created_at: '2023-03-01' },
  ];

  const setSortedItems = vi.fn();

  const renderUseSortHook = (selectedOption: SortOptionsType) =>
    renderHook(() =>
      useSort({
        itemsToSort,
        selectedOption,
        setSortedItems,
      })
    );

  it('should sort items by name ascending', () => {
    const selectedOption = {
      value: 'name_asc',
      label: 'Sort by: Name',
      icon: <FaLongArrowAltUp />,
    };
    renderUseSortHook(selectedOption);
    expect(setSortedItems).toHaveBeenCalledWith([
      { name: 'Pizza Funghi', price: 9, created_at: '2023-03-01' },
      { name: 'Pizza Margherita', price: 8, created_at: '2023-01-01' },
      { name: 'Pizza Pepperoni', price: 10, created_at: '2023-02-01' },
    ]);
  });

  it('should sort items by name descending', () => {
    const selectedOption = {
      value: 'name_desc',
      label: 'Sort by: Name',
      icon: <FaLongArrowAltDown />,
    };
    renderUseSortHook(selectedOption);
    expect(setSortedItems).toHaveBeenCalledWith([
      { name: 'Pizza Pepperoni', price: 10, created_at: '2023-02-01' },
      { name: 'Pizza Margherita', price: 8, created_at: '2023-01-01' },
      { name: 'Pizza Funghi', price: 9, created_at: '2023-03-01' },
    ]);
  });

  it('should sort items by price ascending', () => {
    const selectedOption = {
      value: 'price_asc',
      label: 'Sort by: Price',
      icon: <FaLongArrowAltUp />,
    };
    renderUseSortHook(selectedOption);
    expect(setSortedItems).toHaveBeenCalledWith([
      { name: 'Pizza Margherita', price: 8, created_at: '2023-01-01' },
      { name: 'Pizza Funghi', price: 9, created_at: '2023-03-01' },
      { name: 'Pizza Pepperoni', price: 10, created_at: '2023-02-01' },
    ]);
  });

  it('should sort items by price descending', () => {
    const selectedOption = {
      value: 'price_desc',
      label: 'Sort by: Price',
      icon: <FaLongArrowAltDown />,
    };
    renderUseSortHook(selectedOption);
    expect(setSortedItems).toHaveBeenCalledWith([
      { name: 'Pizza Pepperoni', price: 10, created_at: '2023-02-01' },
      { name: 'Pizza Funghi', price: 9, created_at: '2023-03-01' },
      { name: 'Pizza Margherita', price: 8, created_at: '2023-01-01' },
    ]);
  });

  it('should sort items by date ascending', () => {
    const selectedOption = {
      value: 'date_asc',
      label: 'Sort by: Price',
      icon: <FaLongArrowAltUp />,
    };
    renderUseSortHook(selectedOption);
    expect(setSortedItems).toHaveBeenCalledWith([
      { name: 'Pizza Funghi', price: 9, created_at: '2023-03-01' },
      { name: 'Pizza Pepperoni', price: 10, created_at: '2023-02-01' },
      { name: 'Pizza Margherita', price: 8, created_at: '2023-01-01' },
    ]);
  });

  it('should sort items by date descending', () => {
    const selectedOption = {
      value: 'date_desc',
      label: 'Sort by: Price',
      icon: <FaLongArrowAltDown />,
    };
    renderUseSortHook(selectedOption);
    expect(setSortedItems).toHaveBeenCalledWith([
      { name: 'Pizza Margherita', price: 8, created_at: '2023-01-01' },
      { name: 'Pizza Pepperoni', price: 10, created_at: '2023-02-01' },
      { name: 'Pizza Funghi', price: 9, created_at: '2023-03-01' },
    ]);
  });
});
