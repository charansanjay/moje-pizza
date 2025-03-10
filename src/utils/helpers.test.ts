import { describe, it, expect } from 'vitest';

import { formatDate } from './helpers.ts';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const dateStr = '2022-02-26T12:00:00Z';
    const formattedDate = formatDate(dateStr);
    expect(formattedDate).toBe('26/02/2022');
  });

  it('should handle different date formats', () => {
    const dateStr = '2022-12-31T23:59:59Z';
    const formattedDate = formatDate(dateStr);
    expect(formattedDate).toBe('01/01/2023');
  });

  it('should handle invalid date strings', () => {
    const dateStr = 'invalid-date';
    const formattedDate = formatDate(dateStr);
    expect(formattedDate).toBe('Invalid Date');
  });
});