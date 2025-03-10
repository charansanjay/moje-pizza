import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';

/* component */
import { SigninForm } from './SigninForm.tsx';

/* customHooks */
import { useSigninMutation } from '../../../../customHooks/mutationHooks/authMutations/useSigninMutation.tsx';

// Mock the useSigninMutation hook
vi.mock(
  '../../../../customHooks/mutationHooks/authMutations/useSigninMutation.tsx',
  () => ({
    useSigninMutation: vi.fn(),
  })
);

const mockSignin = vi.fn();
const mockUseSigninMutation = useSigninMutation as Mock;

describe('SigninForm - PAGE - COMPONENT', () => {
  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();
    mockUseSigninMutation.mockReturnValue({
      isSigning: false,
      error: null,
      signin: mockSignin,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('should render the signin form', () => {
    render(<SigninForm />);

    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Remember me/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Signin/i })).toBeInTheDocument();
  });

  it('should show validation errors on invalid input', async () => {
    render(<SigninForm />);

    fireEvent.click(screen.getByRole('button', { name: /Signin/i }));

    await waitFor(() => {
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });
  });

  it('should call signin function on valid input', async () => {
    render(<SigninForm />);

    fireEvent.input(screen.getByLabelText(/Email Address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.input(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Signin/i }));

    await waitFor(() => {
      expect(mockSignin).toHaveBeenCalledWith({
        emailAddress: 'test@example.com',
        password: 'password123',
        rememberMe: false,
      });
    });
  });

  it('should toggle password visibility', () => {
    render(<SigninForm />);

    const passwordInput = screen.getByLabelText(/Password/i);
    const toggleIconVisible = screen.getByTestId('toggle_password_invisible');

    // Initially password should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click to show password
    fireEvent.click(toggleIconVisible);
    expect(passwordInput).toHaveAttribute('type', 'text');

    const toggleIconInvisible = screen.getByTestId(
      'toggle_password_visible'
    );

    // Click to hide password again
    fireEvent.click(toggleIconInvisible);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should show error message on signin failure', async () => {
    mockUseSigninMutation.mockReturnValueOnce({
      isSigning: false,
      error: { message: 'Invalid credentials' },
      signin: mockSignin,
    });

    render(<SigninForm />);

    fireEvent.input(screen.getByLabelText(/Email Address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.input(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Signin/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });
});
