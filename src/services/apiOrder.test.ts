import { mockCart, mockEmptyCart } from './../assets/mockData/mockCart';
import { describe, it, expect, vi, Mock } from 'vitest';
import { createOrder, getOrders, OrderType } from './apiOrder';
import supabase from '../utils/supabase';
import { resetCart } from './apiCart';
import { mockCustomer } from '../assets/mockData/mockCustomer';
import { mockAddress } from '../assets/mockData/mockAddress';
import { mockOrders } from '../assets/mockData/mockOrders';

// Mock the supabase client
vi.mock('../utils/supabase.ts', () => ({
  default: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
  },
}));
vi.mock('./apiCart');

describe('apiOrder - SERVICE', () => {
  describe('createOrder - SUPABASE API ', () => {
    it('should create an order and reset the cart', async () => {
      const mockOrder: OrderType = {
        customer_id: 'customer123',
        orderStatus: 'created',
        paymentMethod: 'paypal',
        paymentStatus: 'pending',
        deliveryStatus: 'Processing',
        cart: mockCart,
        customer: mockCustomer,
        deliveryAddress: mockAddress,
      };

      (
        supabase.from('orders').insert(mockOrder).select as Mock
      ).mockReturnValueOnce({
        data: [mockOrders[0]],
        error: null,
      });

      (resetCart as Mock).mockResolvedValue(mockEmptyCart);

      const result = await createOrder(mockOrder);

      expect(result.data.id).toBe('10');
      expect(result.resetCartData).toEqual(mockEmptyCart);
      expect(supabase.from).toHaveBeenCalledWith('orders');
      expect(resetCart).toHaveBeenCalledWith('44');
    });

    it('should throw an error if cart ID is undefined', async () => {
      const mockOrder: OrderType = {
        customer_id: 'customer123',
        orderStatus: 'created',
        paymentMethod: 'paypal',
        paymentStatus: 'pending',
        deliveryStatus: 'Processing',
        cart: { ...mockCart, id: undefined },
        customer: mockCustomer,
        deliveryAddress: mockAddress,
      };

      (
        supabase.from('orders').insert(mockOrder).select as Mock
      ).mockReturnValueOnce({
        data: null,
        error: { message: 'Cart ID is undefined' },
      });

      await expect(createOrder(mockOrder)).rejects.toThrow(
        'Cart ID is undefined'
      );
    });
  });

  describe('getOrders - SUPABASE API', () => {
    it('should fetch orders for a customer', async () => {
      (
        supabase.from('orders').select('*').eq as unknown as Mock
      ).mockResolvedValueOnce({
        data: mockOrders,
        error: null,
      });

      const result = await getOrders('customer123');

      expect(result).toEqual(mockOrders);
      expect(supabase.from).toHaveBeenCalledWith('orders');
      expect(supabase.from('orders').select('*').eq).toHaveBeenCalledWith(
        'customer_id',
        'customer123'
      );
    });

    it('should throw an error if fetching orders fails', async () => {
      (
        supabase.from('orders').select('*').eq as unknown as Mock
      ).mockResolvedValueOnce({
        data: null,
        error: { message: 'Error fetching orders' },
      });

      await expect(getOrders('customer123')).rejects.toThrow(
        'Error fetching orders'
      );
    });
  });
});
