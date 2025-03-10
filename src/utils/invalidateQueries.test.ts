import { describe, it, expect, vi } from 'vitest';

import { invalidateQueries } from './invalidateQueries.ts';
import { queryClient } from '../services/queryClient.ts';

vi.mock('../services/queryClient', () => ({
  queryClient: {
    invalidateQueries: vi.fn(),
  },
}));

describe('invalidateQueries - UTILS', () => {
  it('should call queryClient.invalidateQueries with the correct query key', () => {
    const key = 'testKey';
    invalidateQueries(key);
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [key],
    });
  });

  it('should convert the key to string before passing it to queryClient.invalidateQueries', () => {
    const key = 123;
    invalidateQueries(key as unknown as string);
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [key.toString()],
    });
  });
});
