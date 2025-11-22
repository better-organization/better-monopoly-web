import { render, screen } from '@testing-library/react';
import Home from '../page';

describe('Home Page', () => {
  it('renders the welcome message', () => {
    render(<Home />);
    const heading = screen.getByText(/Better Monopoly/i);
    expect(heading).toBeInTheDocument();
  });

  it('displays the port information', () => {
    render(<Home />);
    const portInfo = screen.getByText(/port 8081/i);
    expect(portInfo).toBeInTheDocument();
  });
});
