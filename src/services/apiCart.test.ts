import { cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock, afterEach } from 'vitest';

import supabase from '../utils/supabase.ts';
import {
  fetchCustomerCart,
  createCart,
  addOrUpdateCartItem,
  updateCartItemQuantity,
  deleteCartItem,
  applyCouponDiscount,
  resetCart,
} from './apiCart.ts';

/* mock data */
import { mockCart } from '../assets/mockData/mockCart.ts';
import { mockMenuItems } from '../assets/mockData/mockMenuItems.ts';

// Mock the supabase client
vi.mock('../utils/supabase.ts', () => ({
  default: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
  },
}));

describe('apiCart service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it('fetchCustomerCart should fetch cart data', async () => {
    (
      supabase.from('carts').select('*').eq as unknown as Mock
    ).mockResolvedValueOnce({
      data: [mockCart],
      error: null,
    });

    const result = await fetchCustomerCart(mockCart.id!);
    expect(supabase.from).toHaveBeenCalledWith('carts');
    expect(supabase.from('carts').select).toHaveBeenCalledWith('*');
    expect(supabase.from('carts').select().eq).toHaveBeenCalledWith(
      'id',
      mockCart.id
    );
    expect(result.data).toEqual(mockCart);
  });

  it('createCart should create a new cart', async () => {
    (
      supabase.from('carts').insert([mockCart]).select as unknown as Mock
    ).mockResolvedValueOnce({
      data: [mockCart],
      error: null,
    });

    const result = await createCart(mockCart);
    expect(supabase.from).toHaveBeenCalledWith('carts');
    expect(supabase.from('carts').insert).toHaveBeenCalledWith([mockCart]);
    expect(result).toEqual([mockCart]);
  });

  it('addOrUpdateCartItem should add a new item to the cart', async () => {
    (
      supabase.from('carts').update(mockCart).eq('id', mockCart.id)
        .select as unknown as Mock
    ).mockResolvedValueOnce({
      data: [{ ...mockCart, items: [...mockCart.items, mockMenuItems[0]] }],
      error: null,
    });

    const result = await addOrUpdateCartItem(mockMenuItems[0], mockCart);
    expect(result).toEqual({
      ...mockCart,
      items: [...mockCart.items, mockMenuItems[0]],
    });
  });

  it('updateCartItemQuantity should update the quantity of an item', async () => {
    const updatedCartItem = {
      ...mockCart.items[0],
      quantity: 2,
      rowTotal: 548,
    };
    const updatedCart = {
      ...mockCart,
      items: mockCart.items.map((item) =>
        item.item_id === updatedCartItem.item_id ? updatedCartItem : item
      ),
    };
    (
      supabase.from('carts').update(updatedCart).eq('id', mockCart.id)
        .select as unknown as Mock
    ).mockResolvedValueOnce({
      data: [updatedCart],
      error: null,
    });

    const result = await updateCartItemQuantity(updatedCartItem, mockCart);
    expect(supabase.from).toHaveBeenCalledWith('carts');
    expect(supabase.from('carts').update).toHaveBeenCalledWith(updatedCart);
    expect(supabase.from('carts').update(updatedCart).eq).toHaveBeenCalledWith(
      'id',
      mockCart.id
    );
    expect(result.items[0].quantity).toBe(2);
  });

  it('deleteCartItem should remove an item from the cart', async () => {
    const updatedCart = { ...mockCart, items: [mockCart.items[1]] };
    (
      supabase.from('carts').update(updatedCart).eq('id', mockCart.id)
        .select as unknown as Mock
    ).mockResolvedValueOnce({
      data: [updatedCart],
      error: null,
    });

    const result = await deleteCartItem(mockCart.items[0], mockCart);
    expect(supabase.from).toHaveBeenCalledWith('carts');
    expect(supabase.from('carts').update).toHaveBeenCalledWith(updatedCart);
    expect(supabase.from('carts').update(updatedCart).eq).toHaveBeenCalledWith(
      'id',
      mockCart.id
    );
    expect(result).toEqual(updatedCart);
  });

  it('applyCouponDiscount should apply a discount to the cart', async () => {
    const updatedCart = {
      ...mockCart,
      cartSummary: { ...mockCart.cartSummary, discountPercentage: 15 },
    };
    (
      supabase.from('carts').update(updatedCart).eq('id', mockCart.id)
        .select as Mock
    ).mockResolvedValueOnce({
      data: [updatedCart],
      error: null,
    });

    const result = await applyCouponDiscount(mockCart, 'DISCOUNT15');
    expect(supabase.from).toHaveBeenCalledWith('carts');
    expect(supabase.from('carts').update).toHaveBeenCalledWith(updatedCart);
    expect(supabase.from('carts').update(updatedCart).eq).toHaveBeenCalledWith(
      'id',
      mockCart.id
    );
    expect(result.cartSummary.discountPercentage).toBe(15);
  });

  it('resetCart should reset the cart', async () => {
    const resetCartData = {
      ...mockCart,
      items: [],
      cartSummary: {
        subtotal: 0,
        deliveryCost: 5.0,
        vat: 0,
        discountAmount: 0,
        grandTotal: 0,
        vatRatePercentage: 10,
        discountPercentage: 0,
      },
      itemsCount: 0,
      itemsQuantity: 0,
    };
    (
      supabase.from('carts').update(resetCartData).eq('id', mockCart.id)
        .select as Mock
    ).mockResolvedValueOnce({
      data: [resetCartData],
      error: null,
    });
    const result = await resetCart(mockCart.id!);
    expect(supabase.from).toHaveBeenCalledWith('carts');
    expect(supabase.from('carts').update).toHaveBeenCalledWith(resetCartData);
    expect(
      supabase.from('carts').update(resetCartData).eq
    ).toHaveBeenCalledWith('id', mockCart.id);
    expect(result).toEqual(resetCartData);
  });
});
