import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { TaskBar } from './TaskBar.tsx';
import styles from './TaskBar.module.css';

describe('TaskBar - COMPONENT', () => {
  it('renders correctly with currentStep and completedSteps', () => {
    render(<TaskBar currentStep={1} completedSteps={[1]} />);
    expect(document.querySelector(`.${styles.active}`)).toBeTruthy();
    expect(document.querySelector(`.${styles.completed}`)).toBeTruthy();
  });

  it('renders step 1 as active when currentStep is 1', () => {
    render(<TaskBar currentStep={1} completedSteps={[]} />);
    const step1 = screen.getByText('1').parentElement;
    expect(step1).toHaveClass(styles.active);
  });

  it('renders step 2 as active when currentStep is 2', () => {
    render(<TaskBar currentStep={2} completedSteps={[]} />);
    const step2 = screen.getByText('2').parentElement;
    expect(step2).toHaveClass(styles.active);
  });

  it('renders step 1 as completed when it is in completedSteps', () => {
    render(<TaskBar currentStep={2} completedSteps={[1]} />);
    const step1 = screen.getByText('1').parentElement;
    expect(step1).toHaveClass(styles.completed);
  });

  it('renders step 2 as completed when it is in completedSteps', () => {
    render(<TaskBar currentStep={1} completedSteps={[2]} />);
    const step2 = screen.getByText('2').parentElement;
    expect(step2).toHaveClass(styles.completed);
  });
});
