import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';

import { FormInput } from './FormInput.tsx';

describe('FormInput - COMPONENT', () => {
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('renders the input with the correct id', () => {
    render(
      <FormInput
        type='text'
        label='Test Label'
        id='test-id'
        error={undefined}
        onChange={() => {}}
      />
    );

    const inputElement = screen.getByLabelText('Test Label');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('id', 'test-id');
  });

  it('displays the error message when error is provided', () => {
    render(
      <FormInput
        type='text'
        label='Test Label'
        id='test-id'
        error='Test error message'
        onChange={() => {}}
      />
    );

    const errorMessage = screen.getByText('Test error message');
    expect(errorMessage).toBeInTheDocument();
  });

  it('renders the icon when showIcon is true', () => {
    render(
      <FormInput
        type='text'
        label='Test Label'
        id='test-id'
        error={undefined}
        icon={<span data-testid='test-icon'>Icon</span>}
        showIcon={true}
        onChange={() => {}}
      />
    );

    const iconElement = screen.getByTestId('test-icon');
    expect(iconElement).toBeInTheDocument();
  });

  it('calls onChange handler when input value changes', async () => {
    const handleChange = vi.fn();
    render(
      <FormInput
        type='text'
        label='Test Label'
        id='test-id'
        error={undefined}
        onChange={handleChange}
      />
    );

    const inputElement = screen.getByLabelText('Test Label');
    fireEvent.change(inputElement, { target: { value: 'test input' } });

    expect(inputElement).toHaveValue('test input');
  });
});
