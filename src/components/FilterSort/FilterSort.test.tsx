import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { FilterSort } from './FilterSort.tsx';
import styles from './FilterSort.module.css';

describe('FilterSort - COMPONENT', () => {
  it('should render children correctly', () => {
    render(
      <FilterSort>
        <div>Test Child</div>
      </FilterSort>
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('should have the correct container and controls class', () => {
    const { container } = render(
      <FilterSort>
        <div>Test Child</div>
      </FilterSort>
    );

    expect(container.querySelector(`.${styles.container}`)).toBeInTheDocument();
    expect(container.querySelector(`.${styles.controls}`)).toBeInTheDocument();
  });
});
