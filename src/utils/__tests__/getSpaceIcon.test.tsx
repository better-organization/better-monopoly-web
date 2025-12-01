import { render, screen } from '@testing-library/react';
import { getSpaceIcon } from '../getSpaceIcon';
import type { BoardSpace } from '@/types/game';
import { mockLogos } from '@/__tests__/fixtures/mockGameData';

describe('getSpaceIcon', () => {
  describe('Custom logo rendering', () => {
    it('should render custom HTTP logo images with correct attributes', () => {
      const space: BoardSpace = {
        index: 2,
        name: 'Fenerbahçe SK',
        cell_type: 'property',
        cell_sub_type: 'TURKIYE',
      };

      const icon = getSpaceIcon({ space, logos: mockLogos, size: 32 });
      expect(icon).not.toBeNull();
      render(<div>{icon}</div>);
      
      const img = screen.getByAltText('Fenerbahçe SK');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/_next/image?url=https%3A%2F%2Fexample.com%2Ffenerbahce.png&w=64&q=75');
      expect(img).toHaveAttribute('alt', 'Fenerbahçe SK');
      expect(img).toHaveStyle({ width: '32px', height: '32px' });
    });

    it('should apply custom size correctly', () => {
      const space: BoardSpace = {
        index: 2,
        name: 'Fenerbahçe SK',
        cell_type: 'property',
        cell_sub_type: 'TURKIYE',
      };

      const icon64 = getSpaceIcon({ space, logos: mockLogos, size: 64 });
      render(<div>{icon64}</div>);
      
      const img = screen.getByAltText('Fenerbahçe SK');
      expect(img).toHaveStyle({ width: '64px', height: '64px' });
    });

    it('should apply custom className correctly', () => {
      const space: BoardSpace = {
        index: 2,
        name: 'Fenerbahçe SK',
        cell_type: 'property',
        cell_sub_type: 'TURKIYE',
      };

      const iconWithClass = getSpaceIcon({ space, logos: mockLogos, className: 'custom-class', size: 32 });
      render(<div>{iconWithClass}</div>);
      
      const img = screen.getByAltText('Fenerbahçe SK');
      expect(img).toHaveClass('custom-class');
    });

    it('should apply invertColor filter when specified', () => {
      const transportSpace: BoardSpace = {
        index: 6,
        name: 'UEFA Champions League',
        cell_type: 'transport',
        cell_sub_type: 'Tournament',
      };

      const iconInverted = getSpaceIcon({ space: transportSpace, logos: mockLogos, invertColor: true, size: 32 });
      render(<div>{iconInverted}</div>);
      
      const img = screen.getByAltText('UEFA Champions League');
      expect(img).toHaveStyle({ filter: 'brightness(0) invert(1)' });
    });

    it('should not apply invertColor filter when not specified', () => {
      const transportSpace: BoardSpace = {
        index: 6,
        name: 'UEFA Champions League',
        cell_type: 'transport',
        cell_sub_type: 'Tournament',
      };

      const iconNotInverted = getSpaceIcon({ space: transportSpace, logos: mockLogos, invertColor: false, size: 32 });
      render(<div>{iconNotInverted}</div>);
      
      const img = screen.getByAltText('UEFA Champions League');
      expect(img).not.toHaveStyle({ filter: 'brightness(0) invert(1)' });
    });
  });

  describe('Fallback icons', () => {
    it('should return correct fallback icons for all cell types', () => {
      // Transport cell type (Trophy icon)
      const transportSpace: BoardSpace = {
        index: 6,
        name: 'UEFA Champions League',
        cell_type: 'transport',
        cell_sub_type: 'Tournament',
      };
      const transportIcon = getSpaceIcon({ space: transportSpace, logos: {}, size: 32 });
      expect(transportIcon).not.toBeNull();
      const { container: transportContainer } = render(<div>{transportIcon}</div>);
      const transportSvg = transportContainer.querySelector('svg');
      expect(transportSvg).toBeInTheDocument();
      expect(transportSvg).toHaveClass('w-8', 'h-8');

      // Utility cell type (Zap icon)
      const utilitySpace: BoardSpace = {
        index: 9,
        name: 'Broadcasting Rights',
        cell_type: 'utility',
        cell_sub_type: 'Income Stream',
      };
      const utilityIcon = getSpaceIcon({ space: utilitySpace, logos: {}, size: 32 });
      expect(utilityIcon).not.toBeNull();
      const { container: utilityContainer } = render(<div>{utilityIcon}</div>);
      const utilitySvg = utilityContainer.querySelector('svg');
      expect(utilitySvg).toBeInTheDocument();

      // Community Chest (Gift icon)
      const communitySpace: BoardSpace = {
        index: 3,
        name: 'CLUB FUNDS',
        cell_type: 'special',
        cell_sub_type: 'Community Chest',
      };
      const communityIcon = getSpaceIcon({ space: communitySpace, logos: {}, size: 32 });
      expect(communityIcon).not.toBeNull();
      const { container: communityContainer } = render(<div>{communityIcon}</div>);
      const communitySvg = communityContainer.querySelector('svg');
      expect(communitySvg).toBeInTheDocument();

      // Chance (Heart icon)
      const chanceSpace: BoardSpace = {
        index: 8,
        name: 'CLUB TOURS',
        cell_type: 'special',
        cell_sub_type: 'Chance',
      };
      const chanceIcon = getSpaceIcon({ space: chanceSpace, logos: {}, size: 32 });
      expect(chanceIcon).not.toBeNull();
      const { container: chanceContainer } = render(<div>{chanceIcon}</div>);
      const chanceSvg = chanceContainer.querySelector('svg');
      expect(chanceSvg).toBeInTheDocument();

      // Tax special cell (DollarSign icon)
      const taxSpace: BoardSpace = {
        index: 5,
        name: 'FOUL PLAY SANCTION',
        cell_type: 'special',
        cell_sub_type: 'Tax',
        action_keyword: 'tax',
      };
      const taxIcon = getSpaceIcon({ space: taxSpace, logos: {}, size: 32 });
      expect(taxIcon).not.toBeNull();
      const { container: taxContainer } = render(<div>{taxIcon}</div>);
      const taxSvg = taxContainer.querySelector('svg');
      expect(taxSvg).toBeInTheDocument();

      // Other special cell (Ban icon)
      const specialSpace: BoardSpace = {
        index: 11,
        name: 'REHABILITATION CENTER',
        cell_type: 'special',
        cell_sub_type: 'Corner',
        action_keyword: 'jail',
      };
      const specialIcon = getSpaceIcon({ space: specialSpace, logos: {}, size: 32 });
      expect(specialIcon).not.toBeNull();
      const { container: specialContainer } = render(<div>{specialIcon}</div>);
      const specialSvg = specialContainer.querySelector('svg');
      expect(specialSvg).toBeInTheDocument();

      // Property without logo (null)
      const propertySpace: BoardSpace = {
        index: 2,
        name: 'Fenerbahçe SK',
        cell_type: 'property',
        cell_sub_type: 'TURKIYE',
      };
      const propertyIcon = getSpaceIcon({ space: propertySpace, logos: {}, size: 32 });
      expect(propertyIcon).toBeNull();
    });
  });

  describe('Edge cases', () => {
    it('should handle non-HTTP logo values and fallback to icons', () => {
      const space: BoardSpace = {
        index: 6,
        name: 'UEFA Champions League',
        cell_type: 'transport',
        cell_sub_type: 'Tournament',
      };
      const nonHttpLogos = {
        'UEFA Champions League': 'trophy-icon',
      };
      const icon = getSpaceIcon({ space, logos: nonHttpLogos, size: 32 });
      expect(icon).not.toBeNull();
      const { container } = render(<div>{icon}</div>);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should handle missing logos object', () => {
      const space: BoardSpace = {
        index: 6,
        name: 'UEFA Champions League',
        cell_type: 'transport',
        cell_sub_type: 'Tournament',
      };
      const iconMissing = getSpaceIcon({ space, size: 32 });
      expect(iconMissing).not.toBeNull();
    });

    it('should handle empty logos object', () => {
      const space: BoardSpace = {
        index: 6,
        name: 'UEFA Champions League',
        cell_type: 'transport',
        cell_sub_type: 'Tournament',
      };
      const iconEmpty = getSpaceIcon({ space, logos: {}, size: 32 });
      expect(iconEmpty).not.toBeNull();
    });

    it('should use default size when not provided', () => {
      const propertySpace: BoardSpace = {
        index: 2,
        name: 'Fenerbahçe SK',
        cell_type: 'property',
        cell_sub_type: 'TURKIYE',
      };
      const iconDefault = getSpaceIcon({ space: propertySpace, logos: mockLogos });
      render(<div>{iconDefault}</div>);
      
      const img = screen.getByAltText('Fenerbahçe SK');
      expect(img).toHaveStyle({ width: '32px', height: '32px' });
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot for custom logo', () => {
      const propertySpace: BoardSpace = {
        index: 2,
        name: 'Fenerbahçe SK',
        cell_type: 'property',
        cell_sub_type: 'TURKIYE',
      };
      const logoIcon = getSpaceIcon({ space: propertySpace, logos: mockLogos, size: 32 });
      const { container } = render(<div>{logoIcon}</div>);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for transport icon', () => {
      const transportSpace: BoardSpace = {
        index: 6,
        name: 'UEFA Champions League',
        cell_type: 'transport',
        cell_sub_type: 'Tournament',
      };
      const transportIcon = getSpaceIcon({ space: transportSpace, logos: {}, size: 32 });
      const { container } = render(<div>{transportIcon}</div>);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for utility icon', () => {
      const utilitySpace: BoardSpace = {
        index: 9,
        name: 'Broadcasting Rights',
        cell_type: 'utility',
        cell_sub_type: 'Income Stream',
      };
      const utilityIcon = getSpaceIcon({ space: utilitySpace, logos: {}, size: 32 });
      const { container } = render(<div>{utilityIcon}</div>);
      expect(container).toMatchSnapshot();
    });
  });
});

