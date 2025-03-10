import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';

/* component */
import { SignupForm } from './SignupForm.tsx';

/* customHooks */
import { useSignupMutation } from '../../../../customHooks/mutationHooks/authMutations/useSignupMutation.tsx';

// Mock the useSignupMutation hook
vi.mock(
  '../../../../customHooks/mutationHooks/authMutations/useSignupMutation.tsx',
  () => ({
    useSignupMutation: vi.fn(),
  })
);

const mockSignup = vi.fn();
const mockUseSignupMutation = useSignupMutation as Mock;

describe('SignupForm', () => {
  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();
    mockUseSignupMutation.mockReturnValue({
      isSigningUp: false,
      error: null,
      signup: mockSignup,
    });

    mockSignup.mockReturnValue(mockSignup);
  });

  afterEach(() => {
    cleanup();
  });

  it('should render the signup form', () => {
    render(<SignupForm />);

    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Signup/i })).toBeInTheDocument();
  });

  it('should show validation errors on invalid input', async () => {
    render(<SignupForm />);

    fireEvent.click(screen.getByRole('button', { name: /Signup/i }));

    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument();
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getAllByText('Password is required')).toHaveLength(2);
    });
  });

  it('should call signup function on valid input', async () => {
    render(<SignupForm />);

    fireEvent.input(screen.getByLabelText(/First Name/i), {
      target: { value: 'John' },
    });
    fireEvent.input(screen.getByLabelText(/Last Name/i), {
      target: { value: 'Doe' },
    });
    fireEvent.input(screen.getByLabelText(/Email Address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.input(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.input(screen.getByLabelText('Confirm Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Signup/i }));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
    });
  });

  it('should toggle password visibility', () => {
    render(<SignupForm />);

    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');

    const invisiblePasswordIcon = screen.getByTestId(
      'toggle_password_invisible'
    );
    const invisibleConfirmPasswordIcon = screen.getByTestId(
      'toggle_confirm_password_invisible'
    );

    // Initially password should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    // Click to show password
    fireEvent.click(invisiblePasswordIcon);
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Click to show confirm password
    fireEvent.click(invisibleConfirmPasswordIcon);
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');

    const visiblePasswordIcon = screen.getByTestId('toggle_password_visible');
    const visibleConfirmPasswordIcon = screen.getByTestId(
      'toggle_confirm_password_visible'
    );

    // Click to hide password again
    fireEvent.click(visiblePasswordIcon);
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click to hide confirm password again
    fireEvent.click(visibleConfirmPasswordIcon);
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });

  it('should show error message on signup failure', async () => {
    mockUseSignupMutation.mockReturnValueOnce({
      isSigningUp: false,
      error: { message: 'Signup failed' },
      signup: mockSignup,
    });

    render(<SignupForm />);

    fireEvent.input(screen.getByLabelText(/First Name/i), {
      target: { value: 'John' },
    });
    fireEvent.input(screen.getByLabelText(/Last Name/i), {
      target: { value: 'Doe' },
    });
    fireEvent.input(screen.getByLabelText(/Email Address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.input(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.input(screen.getByLabelText('Confirm Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Signup/i }));

    await waitFor(() => {
      expect(screen.getByText(/Signup failed/i)).toBeInTheDocument();
    });
  });
});
