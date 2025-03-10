import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { PhoneInputWithValidation } from './PhoneInputWithValidation.tsx';

const mockSendDataToParent = vi.fn();

describe('PhoneInputWithValidation - COMPONENT', () => {
  const setup = (initialValue = '') => {
    render(
      <PhoneInputWithValidation
        sendDataToParent={mockSendDataToParent}
        initialValue={initialValue}
      />
    );
  };

  beforeEach(() => {
    mockSendDataToParent.mockReturnValue(mockSendDataToParent);
  });

  afterEach(() => {
    cleanup();
  });

  it('renders correctly with initial value', () => {
    setup('+1 234567890');
    const input = screen.getByPlaceholderText('Enter phone number');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('+1 234567890');
  });

  it('calls sendDataToParent with valid phone number', () => {
    setup('+420');
    const input = screen.getByPlaceholderText('Enter phone number');
    fireEvent.change(input, { target: { value: '+420 773 456 789' } });
    expect(mockSendDataToParent).toHaveBeenCalledWith('+420 773 456 789', true);
  });

  it('calls sendDataToParent with invalid phone number', () => {
    setup('+1 234567890');
    const input = screen.getByPlaceholderText('Enter phone number');
    fireEvent.change(input, { target: { value: '+1 234' } });
    expect(mockSendDataToParent).toHaveBeenCalledWith('+1 234', false);
  });

  it('shows country dropdown on button click', () => {
    setup();
    const button = screen.getByRole('button');
    fireEvent.click(button);
    const searchInput = screen.getByPlaceholderText('Search country...');
    expect(searchInput).toBeInTheDocument();
  });

  it('filters countries based on search term', () => {
    setup();
    const button = screen.getByRole('button');
    fireEvent.click(button);
    const searchInput = screen.getByPlaceholderText('Search country...');
    fireEvent.change(searchInput, { target: { value: 'Czech' } });
    const countryItems = screen.getAllByText(/Czech/i);
    expect(countryItems.length).toBeGreaterThan(0);
  });

  it('selects a country from the dropdown', () => {
    setup();
    const button = screen.getByRole('button');
    fireEvent.click(button);
    const searchInput = screen.getByPlaceholderText('Search country...');
    fireEvent.change(searchInput, { target: { value: 'United States' } });
    const countryItem = screen.getByText('United States');
    fireEvent.click(countryItem);
    const input = screen.getByPlaceholderText('Enter phone number');
    expect(input).toHaveValue('+1 ');
  });
});
