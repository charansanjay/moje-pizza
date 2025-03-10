import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { Home } from './Home.tsx';

/* Mock components */
vi.mock('../../components/Button/ContinueButton.tsx', () => ({
  ContinueButton: ({
    text,
    onClick,
  }: {
    text: string;
    onClick: () => void;
  }) => <button onClick={onClick}>{text}</button>,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const mockNavigate = useNavigate as Mock;

describe('Home - PAGE', () => {
  

  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();

    mockNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    cleanup();
  });

  it('should render the home page', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText('Welcome to Moje Pizza 🍕')).toBeInTheDocument();
    expect(
      screen.getByText('Order your favorite pizza now!')
    ).toBeInTheDocument();
    expect(screen.getByText('Check Menu')).toBeInTheDocument();
  });

  it('should navigate to menu page when "Check Menu" button is clicked', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Check Menu'));

    expect(mockNavigate).toHaveBeenCalledWith('/menu');
  });
});
