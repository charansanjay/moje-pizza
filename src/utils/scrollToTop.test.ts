import { describe, expect, it, vi } from 'vitest';

import { scrollToTop } from './scrollToTop.ts';

describe('scrollToTop', () => {
  it('should scroll to the top of the window with smooth behavior', () => {
    // Mock window.scrollTo
    window.scrollTo = vi.fn();

    scrollToTop();

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });
});
