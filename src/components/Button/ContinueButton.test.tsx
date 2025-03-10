import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom';

import styles from './ContinueButton.module.css';
import { ContinueButton } from './ContinueButton.tsx';
import { FaArrowRightLong } from 'react-icons/fa6';

describe('ContinueButton - COMPONENT', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders with text', () => {
    render(<ContinueButton text='Continue' type='primary' showIcon={false} />);
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });

  it('renders with icon when showIcon is true', () => {
    render(
      <ContinueButton
        text='Continue'
        type='primary'
        showIcon={true}
        icon={<FaArrowRightLong aria-label='icon' />}
      />
    );
    expect(screen.getByText('Continue')).toBeInTheDocument();
    expect(screen.getByLabelText('icon')).toBeInTheDocument();
  });

  it('does not render icon when showIcon is false', () => {
    render(<ContinueButton text='Continue' type='primary' showIcon={false} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(
      <ContinueButton
        text='Continue'
        type='primary'
        showIcon={false}
        onClick={handleClick}
      />
    );
    fireEvent.click(screen.getByText('Continue'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct float style', () => {
    render(
      <ContinueButton
        text='Continue'
        type='primary'
        showIcon={false}
        float='left'
      />
    );
    expect(screen.getByText('Continue')).toHaveStyle({ float: 'left' });
  });

  it('applies correct type class', () => {
    render(
      <ContinueButton text='Continue' type='secondary' showIcon={false} />
    );
    expect(screen.getByText('Continue')).toHaveClass(styles.secondary);
  });
});
