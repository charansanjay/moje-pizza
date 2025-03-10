import { describe, it, expect, vi, Mock } from 'vitest';

import { fetchMenu } from './apiRestaurant.ts';
import supabase from '../utils/supabase.ts';

/* mock data */
import { mockMenuItems } from '../assets/mockData/mockMenuItems';

// Mock the supabase client
vi.mock('../utils/supabase.ts', () => ({
  default: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
  },
}));

describe('fetchMenu - SERVICE', () => {
  it('should fetch menu items successfully', async () => {
    (supabase.from('menu_items').select as Mock).mockResolvedValueOnce({
      data: mockMenuItems,
      error: null,
    });

    const data = await fetchMenu();

    expect(supabase.from).toHaveBeenCalledWith('menu_items');
    expect(supabase.from('menu_items').select).toHaveBeenCalledWith('*');
    expect(data).toEqual(mockMenuItems);
  });

  it('should throw an error when fetching menu items fails', async () => {
    (supabase.from('menu_items').select as Mock).mockResolvedValueOnce({
      data: null,
      error: new Error('Failed getting menu items'),
    });

    await expect(fetchMenu()).rejects.toThrow('Failed getting menu items');
  });
});
