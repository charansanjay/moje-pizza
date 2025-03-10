import { cleanup, render, screen } from '@testing-library/react';
import { describe, it, expect, afterEach, beforeEach } from 'vitest';

import { FormSubmitButton } from './FormSubmitButton.tsx';

describe('FormSubmitButton - COMPONENT', () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders with the correct title', () => {
    render(<FormSubmitButton title='Submit' />);
    const button = screen.getByDisplayValue('Submit');
    expect(button).toBeInTheDocument();
  });

  it('is enabled by default', () => {
    render(<FormSubmitButton title='Submit' />);
    const button = screen.getByDisplayValue('Submit');
    expect(button).not.toBeDisabled();
  });

  it('can be disabled', () => {
    render(<FormSubmitButton title='Submit' disabled />);
    const button = screen.getByDisplayValue('Submit');
    expect(button).toBeDisabled();
  });
});
