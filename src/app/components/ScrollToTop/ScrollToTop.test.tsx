import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { ScrollToTop } from './ScrollToTop.tsx';

describe('ScrollToTop - COMPONENT', () => {
  it('should scroll to top on route change', () => {
    window.scrollTo = vi.fn();

    render(
      <MemoryRouter initialEntries={['/new-route']}>
        <Routes>
          <Route path="/new-route" element={<ScrollToTop />} />
        </Routes>
      </MemoryRouter>
    );

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});