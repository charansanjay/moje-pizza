import {
  render,
  screen,
  cleanup,
  fireEvent,
} from '@testing-library/react';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import { Footer } from './Footer.tsx';

describe('Footer - COMPONENT', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('should render the footer', () => {
    const footer = screen.getByTestId('footer');
    expect(footer).toBeInTheDocument();
  });

  it('should render correct number of footer rows', () => {
    const footerRows = screen.getAllByTestId('row');
    expect(footerRows).toHaveLength(2);
  });

  it('should render correct number of footer sections', () => {
    const footerSections = screen.getAllByTestId('section');
    expect(footerSections).toHaveLength(5);
  });

  it('should render all footer section headings', () => {
    const addressHeading = screen.getByText(/Address/i);
    const openingHoursHeading = screen.getByText(/Opening/i);
    const contactHeading = screen.getByText(/Contact/i);
    const companyHeading = screen.getByText(/Company/i);
    const socialHeading = screen.getByText(/Follow US/i);

    expect(addressHeading).toBeInTheDocument();
    expect(openingHoursHeading).toBeInTheDocument();
    expect(contactHeading).toBeInTheDocument();
    expect(companyHeading).toBeInTheDocument();
    expect(socialHeading).toBeInTheDocument();
  });

  it('should navigate to home when logo is clicked', async () => {
    const logo = screen.getByTestId('logo-link');
    fireEvent.click(logo);

    expect(logo).toHaveAttribute('href', '/');
  });
});
