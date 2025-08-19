import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NetworkStatus } from './NetworkStatus.tsx';

describe('NetworkStatus - COMPONENT', () => {
  beforeEach(() => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should not render the offline banner when online', () => {
    render(<NetworkStatus />);
    expect(
      screen.queryByText(
        "You're currently offline. Some features might not be available."
      )
    ).toBeNull();
  });

  it('should render the offline banner when offline', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    render(<NetworkStatus />);
    expect(
      screen.getByText(
        "You're currently offline. Some features might not be available."
      )
    ).toBeInTheDocument();
  });
});
