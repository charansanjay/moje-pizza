import { cleanup, render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { AddressDetails } from './AddressDetails';
import { type AddressType } from '../../../../redux/slices/addressSlice/addressSlice.ts';
import { mockAddress } from '../../../../assets/mockData/mockAddress.ts';

describe('AddressDetails - PAGE - COMPONENT', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  afterEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  it('renders address details correctly', () => {
    render(<AddressDetails address={mockAddress} />);

    expect(screen.getByText('firstName lastName')).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => {
        return element?.textContent === 'Street: streetAddress';
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => {
        return element?.textContent === 'Phone: +420 771 234 567';
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => {
        return element?.textContent === 'Email: charan@example.com';
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => {
        return element?.textContent === 'City: city';
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => {
        return element?.textContent === 'PinCode: 123456';
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => {
        return element?.textContent === 'Land Mark: N/A';
      })
    ).toBeInTheDocument();
  });

  it('renders N/A for missing optional fields', () => {
    const incompleteAddress: AddressType = {
      ...mockAddress,
      city: '',
      pinCode: '',
      landmark: '',
    };

    render(<AddressDetails address={incompleteAddress} />);

    expect(
      screen.getByText((_, element) => {
        return element?.textContent === 'City: N/A';
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => {
        return element?.textContent === 'PinCode: N/A';
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText((_, element) => {
        return element?.textContent === 'Land Mark: N/A';
      })
    ).toBeInTheDocument();
  });
});
