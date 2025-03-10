import { describe, expect, it } from 'vitest';

import { queryClient } from './queryClient.ts';

describe('queryClient - SERVICE', () => {
  it('should have the correct default options', () => {
    const defaultOptions = queryClient.getDefaultOptions();
    expect(defaultOptions.queries?.staleTime).toBe(1000 * 60 * 30);
  });
});
