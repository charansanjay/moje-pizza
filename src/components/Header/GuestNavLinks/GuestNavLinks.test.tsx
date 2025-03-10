import { cleanup, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import { GuestNavLinks } from './GuestNavLinks.tsx';

/* mock data */
import { mockCustomer } from '../../../assets/mockData/mockCustomer.ts';

describe('GuestNavLinks - COMPONENT', () => {
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('renders Sign in and Register links when customer is not logged in', () => {
    render(
      <MemoryRouter>
        <GuestNavLinks customer={{...mockCustomer, id: ''}} />
      </MemoryRouter>
    );

    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('does not render Sign in and Register links when customer is logged in', () => {
    render(
      <MemoryRouter>
        <GuestNavLinks customer={{ ...mockCustomer }} />
      </MemoryRouter>
    );

    expect(screen.queryByText('Sign in')).not.toBeInTheDocument();
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
  });
});
