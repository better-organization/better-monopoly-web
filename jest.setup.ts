import '@testing-library/jest-dom';

// Mock d3-array to avoid ES module issues
jest.mock('d3-array', () => ({
  range: (start: number, stop?: number, step?: number) => {
    if (stop === undefined) {
      stop = start;
      start = 0;
    }
    if (step === undefined) {
      step = 1;
    }
    const result = [];
    for (let i = start; i < stop; i += step) {
      result.push(i);
    }
    return result;
  },
}));

