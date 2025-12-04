import { render } from '@testing-library/react';
import { FieldLines } from '../FieldLines';

describe('FieldLines', () => {
  it('should render SVG with correct attributes, positioning, and styling', () => {
    const { container } = render(<FieldLines />);

    const svg = container.querySelector('svg');

    // SVG element rendering
    expect(svg).toBeInTheDocument();

    // SVG attributes
    expect(svg).toHaveAttribute('viewBox', '0 0 100 100');
    expect(svg).toHaveAttribute('preserveAspectRatio', 'none');

    // CSS classes
    expect(svg).toHaveClass('pointer-events-none');
    expect(svg).toHaveClass('absolute');
    expect(svg).toHaveClass('inset-0', 'w-full', 'h-full');
  });

  it('should render field boundary with correct dimensions and styling', () => {
    const { container } = render(<FieldLines />);

    const boundary = container.querySelector('rect[x="2"][y="2"]');

    // Boundary exists
    expect(boundary).toBeInTheDocument();

    // Dimensions
    expect(boundary).toHaveAttribute('width', '96');
    expect(boundary).toHaveAttribute('height', '96');

    // Styling
    expect(boundary).toHaveAttribute('stroke', 'white');
    expect(boundary).toHaveAttribute('fill', 'none');
    expect(boundary).toHaveAttribute('stroke-width', '0.5');
    expect(boundary).toHaveAttribute('opacity', '0.6');
  });

  it('should render halfway line spanning from left to right with correct styling', () => {
    const { container } = render(<FieldLines />);

    const halfwayLine = container.querySelector('line[y1="50"][y2="50"]');

    // Halfway line exists
    expect(halfwayLine).toBeInTheDocument();

    // Position (spans from left to right)
    expect(halfwayLine).toHaveAttribute('x1', '2');
    expect(halfwayLine).toHaveAttribute('x2', '98');

    // Styling
    expect(halfwayLine).toHaveAttribute('stroke', 'white');
    expect(halfwayLine).toHaveAttribute('stroke-width', '0.5');
    expect(halfwayLine).toHaveAttribute('opacity', '0.6');
  });

  it('should render center circle and center spot with correct positioning and styling', () => {
    const { container } = render(<FieldLines />);

    const circles = container.querySelectorAll('circle');
    const centerCircle = Array.from(circles).find(
      (circle) => circle.getAttribute('r') === '10'
    );
    const centerSpot = Array.from(circles).find(
      (circle) => circle.getAttribute('r') === '0.6' && circle.getAttribute('cx') === '50' && circle.getAttribute('cy') === '50'
    );

    // Center circle
    expect(centerCircle).toBeInTheDocument();
    expect(centerCircle).toHaveAttribute('cx', '50');
    expect(centerCircle).toHaveAttribute('cy', '50');
    expect(centerCircle).toHaveAttribute('r', '10');
    expect(centerCircle).toHaveAttribute('stroke', 'white');
    expect(centerCircle).toHaveAttribute('fill', 'none');

    // Center spot
    expect(centerSpot).toBeInTheDocument();
    expect(centerSpot).toHaveAttribute('cx', '50');
    expect(centerSpot).toHaveAttribute('cy', '50');
    expect(centerSpot).toHaveAttribute('fill', 'white');
  });

  it('should render penalty areas with correct positioning and styling', () => {
    const { container } = render(<FieldLines />);

    const rects = container.querySelectorAll('rect');
    const penaltyAreas = Array.from(rects).filter(
      (rect) => rect.getAttribute('x') === '20'
    );
    const whiteStrokeRects = container.querySelectorAll('rect[stroke="white"]');

    // Multiple rectangles including boundary and penalty areas
    expect(rects.length).toBeGreaterThan(1);

    // Penalty areas exist
    expect(penaltyAreas.length).toBeGreaterThan(0);

    // White stroke styling
    expect(whiteStrokeRects.length).toBeGreaterThan(0);
  });

  it('should have consistent visual styling across all field markings', () => {
    const { container } = render(<FieldLines />);

    const svg = container.querySelector('svg');
    const whitelines = container.querySelectorAll('[stroke="white"]');
    const whiteCircles = container.querySelectorAll('circle[fill="white"]');
    const opacityElements = container.querySelectorAll('[opacity="0.6"]');
    const strokeWidthElements = container.querySelectorAll('[stroke-width="0.5"]');

    // All field markings rendered
    expect(svg?.children.length).toBeGreaterThan(5);

    // Consistent white color
    expect(whitelines.length).toBeGreaterThan(0);
    expect(whiteCircles.length).toBeGreaterThan(0);

    // Consistent opacity
    expect(opacityElements.length).toBeGreaterThan(0);

    // Consistent stroke width
    expect(strokeWidthElements.length).toBeGreaterThan(0);
  });

  it('should render as a single SVG without errors and be decorative', () => {
    const { container } = render(<FieldLines />);

    const svg = container.querySelector('svg');
    const svgs = container.querySelectorAll('svg');

    // Renders without errors
    expect(container.firstChild).toBeInTheDocument();

    // Single SVG
    expect(svgs.length).toBe(1);

    // Decorative (pointer-events-none for accessibility)
    expect(svg).toHaveClass('pointer-events-none');
  });

  it('should match snapshot and have consistent structure across renders', () => {
    const { container } = render(<FieldLines />);
    const { container: container2 } = render(<FieldLines />);

    // Snapshot match
    expect(container).toMatchSnapshot();

    // Consistent structure
    expect(container.innerHTML).toBe(container2.innerHTML);
  });
});

