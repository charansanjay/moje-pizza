import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Loader } from './Loader.tsx';

describe('Loader - COMPONENT', () => {
  it('renders without crashing', () => {
    const { container } = render(<Loader />);
    expect(container).toBeInTheDocument();
  });

  it('displays the pizza image', () => {
    render(<Loader />);
    
    const pizzaImage = screen.getByAltText('Pizza');
    expect(pizzaImage).toBeInTheDocument();
    expect(pizzaImage).toHaveAttribute(
      'src',
      expect.stringContaining('pizza.svg')
    );
  });
});
