import { cleanup, render, screen } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import { CompanyLogo } from './CompanyLogo.tsx';

describe('CompanyLogo - COMPONENT', () => {
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('should render the company logo with the correct alt text', () => {
    render(
      <MemoryRouter>
        <CompanyLogo />
      </MemoryRouter>
    );
    const logo = screen.getByAltText('Moje Pizza');
    expect(logo).toBeInTheDocument();
  });

  it('should render the company name', () => {
    render(
      <MemoryRouter>
        <CompanyLogo />
      </MemoryRouter>
    );
    const companyName = screen.getByText('Moje Pizza');
    expect(companyName).toBeInTheDocument();
  });

  it('should link to the home page', () => {
    render(
      <MemoryRouter>
        <CompanyLogo />
      </MemoryRouter>
    );

    const logoLink = screen.getByTestId('logo_link');
    expect(logoLink).toBeInTheDocument();
  });
});
