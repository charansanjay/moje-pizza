import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { OnlyAvailable } from './OnlyAvailable.tsx';

const mockSetShowAvailabilityOnly = vi.fn();

describe('OnlyAvailable -COMPONENT', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    mockSetShowAvailabilityOnly.mockReturnValue(mockSetShowAvailabilityOnly);
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the checkbox', () => {
    render(
      <OnlyAvailable
        showAvailableOnly={false}
        setShowAvailableOnly={mockSetShowAvailabilityOnly}
      />
    );
    const checkbox = screen.getByLabelText(/Available Only/i);
    expect(checkbox).toBeInTheDocument();
  });

  it('calls setShowAvailableOnly when the checkbox is clicked', () => {
    render(
      <OnlyAvailable
        showAvailableOnly={false}
        setShowAvailableOnly={mockSetShowAvailabilityOnly}
      />
    );
    const checkbox = screen.getByLabelText(/Available Only/i);
    fireEvent.click(checkbox);
    expect(mockSetShowAvailabilityOnly).toHaveBeenCalled();
  });

  it('calls setShowAvailableOnly with the correct value when the checkbox is clicked', () => {
    render(
      <OnlyAvailable
        showAvailableOnly={false}
        setShowAvailableOnly={mockSetShowAvailabilityOnly}
      />
    );
    const checkbox = screen.getByLabelText(/Available Only/i);
    fireEvent.click(checkbox);
    expect(mockSetShowAvailabilityOnly).toHaveBeenCalledWith(true);
  });

  it('calls setShowAvailableOnly with the correct value when the checkbox is clicked again', () => {
    render(
      <OnlyAvailable
        showAvailableOnly={true}
        setShowAvailableOnly={mockSetShowAvailabilityOnly}
      />
    );
    const checkbox = screen.getByLabelText(/Available Only/i);
    fireEvent.click(checkbox);
    expect(mockSetShowAvailabilityOnly).toHaveBeenCalledWith(false);
  });


});
