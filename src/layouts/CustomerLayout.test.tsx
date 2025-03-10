import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { CustomerLayout } from './CustomerLayout.tsx';

describe('CustomerLayout - LAYOUT', () => {
  it('should render the Outlet component', () => {
    const { container } = render(
      <MemoryRouter>
        <CustomerLayout />
      </MemoryRouter>
    );
    expect(container).toMatchSnapshot();
  });
});