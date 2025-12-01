import { render, screen, fireEvent } from '@testing-library/react';
import { ClubLogo } from '../ClubLogo';
import { mockLogos } from '@/__tests__/fixtures/mockGameData';

describe('ClubLogo', () => {
  describe('Logo URL rendering', () => {
    it('should render image with correct attributes, styles, and custom props', () => {
      // Test image rendering with URL, src, and alt
      const { container, rerender } = render(
        <ClubLogo clubName="Fenerbahçe SK" logos={mockLogos} />
      );

      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/fenerbahce.png');
      expect(img).toHaveAttribute('alt', 'Fenerbahçe SK logo');
      expect(img).toHaveStyle({
        height: '100%',
        width: 'auto',
        objectFit: 'contain',
      });

      // Test custom style prop
      const customStyle = { maxWidth: '100px', maxHeight: '100px' };
      rerender(<ClubLogo clubName="Liverpool FC" logos={mockLogos} style={customStyle} />);
      const logoContainer = container.querySelector('div');
      expect(logoContainer).toHaveStyle(customStyle);
    });
  });

  describe('Fallback to initials', () => {
    it('should generate correct initials for various club name formats', () => {
      // Single word
      const { rerender } = render(<ClubLogo clubName="Arsenal" logos={{}} />);
      expect(screen.getByText('AR')).toBeInTheDocument();

      // Two words
      rerender(<ClubLogo clubName="Manchester United" logos={{}} />);
      expect(screen.getByText('MU')).toBeInTheDocument();

      // Three words
      rerender(<ClubLogo clubName="Real Madrid CF" logos={{}} />);
      expect(screen.getByText('RMC')).toBeInTheDocument();

      // Multiple words (max 3)
      rerender(<ClubLogo clubName="Some Very Long Club Name" logos={{}} />);
      const initials = screen.getByText('SVL');
      expect(initials).toBeInTheDocument();

      // Names with special characters
      rerender(<ClubLogo clubName="Fenerbahçe SK" logos={{}} />);
      expect(screen.getByText('FS')).toBeInTheDocument();
    });

    it('should render fallback badge with correct styling', () => {
      const { container } = render(
        <ClubLogo clubName="Test Club" logos={{}} />
      );

      // Check badge exists with gradient background
      const badge = container.querySelector('.bg-gradient-to-br');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('from-gray-700', 'to-gray-800');

      // Check Shield icon exists
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();

      // Check initials text styling
      const initialsText = screen.getByText('TC');
      expect(initialsText).toHaveClass('text-[10px]', 'z-10', 'text-white');
      expect(initialsText).toHaveStyle({
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontWeight: '700',
      });
    });
  });

  describe('Image error handling', () => {
    it('should handle image load errors', () => {
      const { container } = render(
        <ClubLogo clubName="Test Club" logos={{ 'Test Club': 'https://broken-url.com/logo.png' }} />
      );

      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();

      // Simulate image load error
      fireEvent.error(img!);

      // Image should be hidden
      expect(img).toHaveStyle({ display: 'none' });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty, whitespace, and missing club names', () => {
      // Empty club name
      const { container, rerender } = render(<ClubLogo clubName="" logos={{}} />);
      expect(container).toBeInTheDocument();

      // Club name with only spaces
      rerender(<ClubLogo clubName="   " logos={{}} />);
      expect(container).toBeInTheDocument();

      // Very long club names
      const longName = 'This Is A Very Long Football Club Name That Should Still Work';
      rerender(<ClubLogo clubName={longName} logos={{}} />);
      expect(container).toBeInTheDocument();

      // Club name with numbers
      rerender(<ClubLogo clubName="Team 42" logos={{}} />);
      expect(screen.getByText('T4')).toBeInTheDocument();
    });

    it('should handle missing or undefined logos prop', () => {
      // Missing logos prop
      const { rerender } = render(<ClubLogo clubName="Test Club" />);
      expect(screen.getByText('TC')).toBeInTheDocument();

      // Undefined logos
      rerender(<ClubLogo clubName="Test Club" logos={undefined} />);
      expect(screen.getByText('TC')).toBeInTheDocument();
    });
  });

  describe('Position prop', () => {
    it('should accept all position values without affecting rendering', () => {
      const positions: Array<'top' | 'right' | 'bottom' | 'left'> = ['top', 'right', 'bottom', 'left'];

      positions.forEach((position) => {
        const { container } = render(
          <ClubLogo clubName="Test Club" logos={{}} position={position} />
        );
        expect(container).toBeInTheDocument();
      });
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot with logo image', () => {
      const { container } = render(
        <ClubLogo clubName="Fenerbahçe SK" logos={mockLogos} />
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with fallback initials', () => {
      const { container } = render(
        <ClubLogo clubName="Arsenal FC" logos={{}} />
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with custom styling', () => {
      const { container } = render(
        <ClubLogo
          clubName="Liverpool FC"
          logos={mockLogos}
          className="custom-class"
          style={{ width: '80px', height: '80px' }}
        />
      );
      expect(container).toMatchSnapshot();
    });
  });
});

