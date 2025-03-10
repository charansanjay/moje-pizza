import { cleanup, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, Mock, beforeEach, afterEach } from 'vitest';
import { useNavigate } from 'react-router-dom';

import { EmptyPage } from './EmptyPage.tsx';

vi.mock('../Button/ContinueButton', () => ({
  ContinueButton: ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick}>Mocked Button</button>
  ),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const props = {
  message: 'No items found',
  icon: <span>Icon</span>,
  buttonText: 'Go Back',
  path: '/home',
};

const mockNavigate = useNavigate as Mock;

describe('EmptyPage - COMPONENT', () => {
  beforeEach(() => {
    mockNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('renders the message, icon, and button', () => {
    render(<EmptyPage {...props} />);

    expect(screen.getByText('No items found')).toBeInTheDocument();
    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Mocked Button')).toBeInTheDocument();
  });

  it('navigates to the specified path when the button is clicked', () => {
    render(<EmptyPage {...props} />);

    screen.getByText('Mocked Button').click();
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });
});
