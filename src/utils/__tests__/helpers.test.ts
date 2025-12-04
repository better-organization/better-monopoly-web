import { formatCurrency, formatDate, debounce, generateId } from '../helpers';

describe('formatCurrency', () => {
  it('should format positive numbers as USD currency', () => {
    expect(formatCurrency(100)).toBe('$100.00');
    expect(formatCurrency(1500)).toBe('$1,500.00');
  });

  it('should format zero as currency', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should format negative numbers as currency', () => {
    expect(formatCurrency(-50)).toBe('-$50.00');
    expect(formatCurrency(-1500)).toBe('-$1,500.00');
  });

  it('should format decimal numbers as currency', () => {
    expect(formatCurrency(99.99)).toBe('$99.99');
    expect(formatCurrency(100.5)).toBe('$100.50');
    expect(formatCurrency(100.123)).toBe('$100.12');
  });

  it('should format large numbers with thousand separators', () => {
    expect(formatCurrency(1000000)).toBe('$1,000,000.00');
    expect(formatCurrency(12345678.90)).toBe('$12,345,678.90');
  });
});

describe('formatDate', () => {
  it('should format Date object correctly', () => {
    const date = new Date('2025-12-01T10:30:00');
    const formatted = formatDate(date);
    expect(formatted).toContain('December');
    expect(formatted).toContain('1');
    expect(formatted).toContain('2025');
    expect(formatted).toContain('10:30');
  });

  it('should format date string correctly', () => {
    const dateString = '2025-12-01T15:45:00';
    const formatted = formatDate(dateString);
    expect(formatted).toContain('December');
    expect(formatted).toContain('1');
    expect(formatted).toContain('2025');
    expect(formatted).toContain('3:45'); // 15:45 in 12-hour format
  });

  it('should handle different date formats', () => {
    const date1 = formatDate('2025-01-15T00:00:00');
    expect(date1).toContain('January');
    expect(date1).toContain('15');

    const date2 = formatDate(new Date('2025-06-30T23:59:59'));
    expect(date2).toContain('June');
    expect(date2).toContain('30');
  });
});

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should delay function execution', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 500);

    debouncedFn();
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should cancel previous calls if called multiple times', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 500);

    debouncedFn();
    jest.advanceTimersByTime(200);
    debouncedFn();
    jest.advanceTimersByTime(200);
    debouncedFn();

    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments to the debounced function', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 500);

    debouncedFn();
    jest.advanceTimersByTime(500);

    expect(mockFn).toHaveBeenCalledWith();
  });

  it('should handle multiple separate debounced calls', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 300);

    debouncedFn();
    jest.advanceTimersByTime(300);
    expect(mockFn).toHaveBeenCalledTimes(1);

    debouncedFn();
    jest.advanceTimersByTime(300);
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('should work with different wait times', () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const debouncedFn1 = debounce(mockFn1, 100);
    const debouncedFn2 = debounce(mockFn2, 500);

    debouncedFn1();
    debouncedFn2();

    jest.advanceTimersByTime(100);
    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn2).not.toHaveBeenCalled();

    jest.advanceTimersByTime(400);
    expect(mockFn2).toHaveBeenCalledTimes(1);
  });
});

describe('generateId', () => {
  it('should generate a unique ID', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it('should generate ID with correct format (timestamp-random)', () => {
    const id = generateId();
    expect(id).toMatch(/^\d+-[a-z0-9]+$/);
  });

  it('should contain timestamp component', () => {
    const beforeTime = Date.now();
    const id = generateId();
    const afterTime = Date.now();

    const timestamp = parseInt(id.split('-')[0]);
    expect(timestamp).toBeGreaterThanOrEqual(beforeTime);
    expect(timestamp).toBeLessThanOrEqual(afterTime);
  });

  it('should contain random component', () => {
    const id = generateId();
    const parts = id.split('-');
    expect(parts).toHaveLength(2);
    expect(parts[1]).toBeTruthy();
    expect(parts[1].length).toBeGreaterThan(0);
  });

  it('should generate multiple unique IDs', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      ids.add(generateId());
    }
    expect(ids.size).toBe(100);
  });
});

