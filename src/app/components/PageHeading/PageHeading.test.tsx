import { fireEvent, render, screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { describe, it, expect, vi, Mock, beforeEach } from 'vitest';

import { PageHeading } from './PageHeading.tsx';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const mockNavigate = useNavigate as Mock;

describe('PageHeading - COMPONENT', () => {
  beforeEach(() => {
    mockNavigate.mockReturnValue(mockNavigate);
  });

  it('renders the title', () => {
    render(<PageHeading title='Test Title' />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders the back button when showBackButton is true', () => {
    render(<PageHeading title='Test Title' showBackButton={true} />);
    expect(screen.getByTestId('back_button')).toBeInTheDocument();
  });

  it('does not render the back button when showBackButton is false', () => {
    render(<PageHeading title='Test Title' showBackButton={false} />);
    expect(screen.queryByTestId('back_button')).not.toBeInTheDocument();
  });

  it('navigates back when the back button is clicked', () => {
    render(<PageHeading title='Test Title' showBackButton={true} />);

    const backButton = screen.getByTestId('back_button');
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
