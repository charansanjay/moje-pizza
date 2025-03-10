import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ScrollToTopButton } from './ScrollToTopButton.tsx';

describe('ScrollToTopButton - COMPONENT', () => {
  beforeEach(() => {
    // Mock window.scrollTo
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    cleanup();
  });

  it('should not be visible on initial render', () => {
    render(<ScrollToTopButton />);

    const button = screen.queryByRole('button');
    expect(button).toBeNull();
  });

  it('should become visible when scrolled down 300px', () => {
    render(<ScrollToTopButton />);

    fireEvent.scroll(window, { target: { pageYOffset: 301 } });
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should scroll to top when clicked', () => {
    render(<ScrollToTopButton />);

    fireEvent.scroll(window, { target: { pageYOffset: 301 } });
    const button = screen.getByRole('button');

    fireEvent.click(button);
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('should hide the button when scrolled back up', () => {
    render(<ScrollToTopButton />);

    fireEvent.scroll(window, { target: { pageYOffset: 301 } });
    let button: HTMLElement | null = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    fireEvent.scroll(window, { target: { pageYOffset: 299 } });
    button = screen.queryByRole('button');
    expect(button).toBeNull();
  });
});
