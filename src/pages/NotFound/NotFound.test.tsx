import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, Mock, afterEach, beforeEach } from 'vitest';
import { useNavigate } from 'react-router-dom';

/* Component */
import { NotFound } from './NotFound.tsx';

// Mocking react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const mockNavigate = useNavigate as Mock;

describe('NotFound - PAGE', () => {
  // Reset Mocks
  beforeEach(() => {
    mockNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('should render 404 title and text', () => {
    // Act
    render(<NotFound />);

    // Assert
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Oops! Page not found.')).toBeInTheDocument();
    expect(
      screen.getByText(
        "The page you're looking for doesn't exist or has been moved."
      )
    ).toBeInTheDocument();
  });

  it('should navigate to homepage when button is clicked', () => {
    // Act
    render(<NotFound />);

    // Assert
    const button = screen.getByText('Go to Homepage');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });
});
