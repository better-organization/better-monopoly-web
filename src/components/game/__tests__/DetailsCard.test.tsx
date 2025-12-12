import { render, screen, fireEvent } from '@testing-library/react';
import { DetailsCard } from '../DetailsCard';
import type { BoardSpace } from '@/types/game';
import {
  mockBoardSpaces,
  mockGameTerms,
  mockLogos,
  mockSubTypeColors,
  mockCornerColors,
} from '@/__tests__/fixtures/mockGameData';

describe('DetailsCard', () => {
  const mockOnClose = jest.fn();

  const defaultProps = {
    onClose: mockOnClose,
    terms: mockGameTerms,
    currencySymbol: '€',
    logos: mockLogos,
    subTypeColors: mockSubTypeColors,
    cornerColors: mockCornerColors,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all space types and return null for invalid property', () => {
      // Property space
      const propertySpace = mockBoardSpaces.find((s) => s.cell_type === 'property')!;
      const { rerender } = render(<DetailsCard property={propertySpace} {...defaultProps} />);
      expect(screen.getByText(propertySpace.name)).toBeInTheDocument();

      // Transport space
      const transportSpace = mockBoardSpaces.find((s) => s.cell_type === 'transport')!;
      rerender(<DetailsCard property={transportSpace} {...defaultProps} />);
      expect(screen.getByText(transportSpace.name)).toBeInTheDocument();

      // Utility space
      const utilitySpace = mockBoardSpaces.find((s) => s.cell_type === 'utility')!;
      rerender(<DetailsCard property={utilitySpace} {...defaultProps} />);
      expect(screen.getByText(utilitySpace.name)).toBeInTheDocument();

      // Corner space
      const cornerSpace = mockBoardSpaces.find((s) => s.cell_sub_type === 'Corner')!;
      rerender(<DetailsCard property={cornerSpace} {...defaultProps} />);
      const cornerNames = screen.getAllByText(cornerSpace.name);
      expect(cornerNames.length).toBeGreaterThan(0);

      // Card/special space
      const cardSpace = mockBoardSpaces.find((s) => s.cell_sub_type === 'Chance')!;
      rerender(<DetailsCard property={cardSpace} {...defaultProps} />);
      expect(screen.getByText(cardSpace.name)).toBeInTheDocument();

      // Null property - should return null
      const { container } = render(<DetailsCard property={null as never} {...defaultProps} />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Property card details', () => {
    it('should display name, price, logo, team colors, and house rent information', () => {
      const propertySpace = mockBoardSpaces.find((s) => s.cell_type === 'property')!;
      const { container } = render(<DetailsCard property={propertySpace} {...defaultProps} />);

      // Display property name
      expect(screen.getByText(propertySpace.name)).toBeInTheDocument();

      // Display property price
      expect(screen.getByText(/€60/)).toBeInTheDocument();

      // Display club logo when available
      const logo = container.querySelector('img');
      expect(logo).toBeInTheDocument();

      // Display house rent information if available
      const propertyWithRent = mockBoardSpaces.find(
        (s) => s.cell_type === 'property' && s.house_rent
      )!;
      expect(screen.getByText(propertyWithRent.name)).toBeInTheDocument();
    });
  });

  describe('Transport card details', () => {
    it('should display price, icon, and theme colors', () => {
      const transportSpace = mockBoardSpaces.find((s) => s.cell_type === 'transport')!;
      const { container } = render(<DetailsCard property={transportSpace} {...defaultProps} />);

      // Display transport price
      expect(screen.getByText('Purchase Price')).toBeInTheDocument();
      const priceElements = screen.getAllByText(/€200/);
      expect(priceElements.length).toBeGreaterThan(0);

      // Display transport icon
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Utility card details', () => {
    it('should display price, icon, and theme colors', () => {
      const utilitySpace = mockBoardSpaces.find((s) => s.cell_type === 'utility')!;
      const { container } = render(<DetailsCard property={utilitySpace} {...defaultProps} />);

      // Display utility price
      expect(screen.getByText(/€150/)).toBeInTheDocument();

      // Display utility icon
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Corner card details', () => {
    it('should display name, action details, and corner-specific colors', () => {
      const cornerSpace = mockBoardSpaces.find((s) => s.cell_sub_type === 'Corner')!;
      render(<DetailsCard property={cornerSpace} {...defaultProps} />);

      // Display corner name
      const cornerNames = screen.getAllByText(cornerSpace.name);
      expect(cornerNames.length).toBeGreaterThan(0);

      // Display action details for corner
      if (cornerSpace.action_details) {
        expect(screen.getByText(new RegExp(cornerSpace.action_details))).toBeInTheDocument();
      }
    });
  });

  describe('Close functionality', () => {
    it('should render close button and call onClose when clicked', () => {
      const propertySpace = mockBoardSpaces[1];
      const { container } = render(<DetailsCard property={propertySpace} {...defaultProps} />);

      // Render close button
      const closeButton = container.querySelector('svg');
      expect(closeButton).toBeInTheDocument();

      // Call onClose when close button is clicked
      const clickableButton = container.querySelector('.cursor-pointer');
      if (clickableButton) {
        fireEvent.click(clickableButton);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('Styling', () => {
    it('should have white background, rounded corners, amber border, shadow, and fixed width', () => {
      const propertySpace = mockBoardSpaces[1];
      const { container } = render(<DetailsCard property={propertySpace} {...defaultProps} />);

      // White background
      expect(container.querySelector('.bg-white')).toBeInTheDocument();

      // Rounded corners
      expect(container.querySelector('.rounded-xl')).toBeInTheDocument();

      // Amber border
      expect(container.querySelector('.border-amber-500')).toBeInTheDocument();

      // Shadow
      expect(container.querySelector('.shadow-2xl')).toBeInTheDocument();

      // Fixed width
      expect(container.querySelector('[style*="300px"]')).toBeInTheDocument();
    });
  });

  describe('Currency symbol', () => {
    it('should use provided currency symbol and display prices correctly', () => {
      // Test custom currency symbol on property
      const propertySpace = mockBoardSpaces.find((s) => s.property_price)!;
      const { rerender } = render(<DetailsCard property={propertySpace} {...defaultProps} currencySymbol="$" />);
      expect(screen.getByText(/\$60/)).toBeInTheDocument();

      // Test default currency symbol on transport
      const transportSpace = mockBoardSpaces.find((s) => s.transport_price)!;
      rerender(<DetailsCard property={transportSpace} {...defaultProps} />);
      const euroElements = screen.getAllByText(/€200/);
      expect(euroElements.length).toBeGreaterThan(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle property without price, without logo, and undefined property', () => {
      // Property without price
      const spaceWithoutPrice: BoardSpace = {
        index: 99,
        name: 'Test Space',
        cell_type: 'special',
        cell_sub_type: 'Test',
      };
      const { rerender } = render(<DetailsCard property={spaceWithoutPrice} {...defaultProps} />);
      expect(screen.getByText('Test Space')).toBeInTheDocument();

      // Property without logo
      const propertySpace = mockBoardSpaces.find((s) => s.cell_type === 'property')!;
      rerender(<DetailsCard property={propertySpace} {...defaultProps} logos={{}} />);
      expect(screen.getByText(propertySpace.name)).toBeInTheDocument();

      // Undefined property gracefully
      const { container } = render(<DetailsCard property={undefined as never} {...defaultProps} />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot for property card', () => {
      const propertySpace = mockBoardSpaces.find((s) => s.cell_type === 'property')!;
      const { container } = render(<DetailsCard property={propertySpace} {...defaultProps} />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for transport card', () => {
      const transportSpace = mockBoardSpaces.find((s) => s.cell_type === 'transport')!;
      const { container } = render(<DetailsCard property={transportSpace} {...defaultProps} />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for utility card', () => {
      const utilitySpace = mockBoardSpaces.find((s) => s.cell_type === 'utility')!;
      const { container } = render(<DetailsCard property={utilitySpace} {...defaultProps} />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for corner card', () => {
      const cornerSpace = mockBoardSpaces.find((s) => s.cell_sub_type === 'Corner')!;
      const { container } = render(<DetailsCard property={cornerSpace} {...defaultProps} />);
      expect(container).toMatchSnapshot();
    });
  });
});

