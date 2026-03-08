import { describe, it, expect } from 'vitest';
import { render, screen } from '../helpers/render';
import HomePage from '@/app/page';

describe('HomePage', () => {
  it('should render the hero heading', () => {
    render(<HomePage />);
    expect(screen.getByText('Dzeecommerce')).toBeInTheDocument();
  });

  it('should render browse products button', () => {
    render(<HomePage />);
    expect(screen.getByText('Browse Products')).toBeInTheDocument();
  });

  it('should render create account button', () => {
    render(<HomePage />);
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });

  it('should render feature cards', () => {
    render(<HomePage />);
    expect(screen.getByText('Discover Products')).toBeInTheDocument();
    expect(screen.getByText('Secure Checkout')).toBeInTheDocument();
    expect(screen.getByText('Real-time Updates')).toBeInTheDocument();
  });
});
