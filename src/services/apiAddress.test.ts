import { cleanup, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock, afterEach } from 'vitest';

import {
  fetchCustomerAddress,
  addNewAddress,
  updateAddress,
  updateDeliveryAddress,
  deleteAddress,
} from './apiAddress.ts';
import supabase from '../utils/supabase.ts';

/* mock data */
import { mockAddresses } from '../assets/mockData/mockAddress.ts';
import { mockCustomer } from '../assets/mockData/mockCustomer.ts';

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

describe('apiAddress - SERVICE', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  describe('fetchCustomerAddress - SUPABASE API', () => {
    it('should fetch customer addresses successfully', async () => {
      // Mock successful response
      (
        supabase.from('addresses').select().eq as unknown as Mock
      ).mockResolvedValueOnce({
        data: mockAddresses,
        error: null,
      });

      const result = await fetchCustomerAddress(mockCustomer.id!);
      expect(result[0]).toEqual(mockAddresses[0]);
      expect(supabase.from).toHaveBeenCalledWith('addresses');
      expect(supabase.from('addresses').select).toHaveBeenCalledWith('*');
      expect(supabase.from('addresses').select().eq).toHaveBeenCalledWith(
        'customer_id',
        mockCustomer.id
      );
    });

    it('should throw an error if fetching fails', async () => {
      // Mock error response
      (
        supabase.from('addresses').select().eq as unknown as Mock
      ).mockResolvedValueOnce({
        data: null,
        error: new Error('Failed to fetch'),
      });

      await expect(fetchCustomerAddress(mockCustomer.id!)).rejects.toThrow(
        'Failed to fetch customer address'
      );
    });
  });

  describe('addNewAddress - SUPABASE API', () => {
    it('should add a new address successfully', async () => {
      // Mock successful response
      (
        supabase.from('addresses').insert([mockAddresses[0]]).select as Mock
      ).mockResolvedValueOnce({
        data: mockAddresses,
        error: null,
      });

      const result = await addNewAddress(mockAddresses[0], mockCustomer);
      expect(result).toEqual(mockAddresses);
      expect(supabase.from).toHaveBeenCalledWith('addresses');
      expect(supabase.from('addresses').insert).toHaveBeenCalledWith([
        mockAddresses[0],
      ]);
    });

    it('should throw an error if adding fails', async () => {
      // Mock error response
      (
        supabase.from('addresses').insert([mockAddresses[0]]).select as Mock
      ).mockResolvedValueOnce({
        data: null,
        error: new Error('Failed to add'),
      });

      await expect(
        addNewAddress(mockAddresses[0], mockCustomer)
      ).rejects.toThrow('Address could not be added');
    });
  });

  describe('updateAddress - SUPABASE API', () => {
    it('should update an address successfully', async () => {
      // Mock successful response
      (
        supabase
          .from('addresses')
          .update(mockAddresses[0])
          .eq('id', mockAddresses[0].id).select as Mock
      ).mockResolvedValueOnce({
        data: mockAddresses,
        error: null,
      });

      const result = await updateAddress(mockAddresses[0]);

      expect(result).toEqual(mockAddresses);
      expect(supabase.from).toHaveBeenCalledWith('addresses');
      expect(supabase.from('addresses').update).toHaveBeenCalledWith(
        mockAddresses[0]
      );
      expect(
        supabase.from('addresses').update(mockAddresses[0]).eq
      ).toHaveBeenCalledWith('id', mockAddresses[0].id);
    });

    it('should throw an error if updating fails', async () => {
      // Mock error response
      (
        supabase
          .from('addresses')
          .update(mockAddresses[0])
          .eq('id', mockAddresses[0].id).select as Mock
      ).mockResolvedValueOnce({
        data: null,
        error: new Error('Failed to update'),
      });

      await expect(updateAddress(mockAddresses[0])).rejects.toThrow(
        'Address could not be updated'
      );
    });
  });

  describe('updateDeliveryAddress - SUPABASE API', () => {
    it('should update delivery addresses successfully', async () => {
      // Mock successful response
      (
        supabase
          .from('addresses')
          .update(mockAddresses[0].deliveryAddress)
          .eq('id', mockAddresses[0].id).select as Mock
      ).mockResolvedValueOnce({
        data: mockAddresses[0],
        error: null,
      });

      const result = await updateDeliveryAddress(
        mockAddresses,
        mockAddresses[0]
      );

      // check deeply equal
      await waitFor(() => expect(result).toEqual(mockAddresses));

      expect(supabase.from).toHaveBeenCalledWith('addresses');
      expect(supabase.from('addresses').update).toHaveBeenCalledWith({
        deliveryAddress: true,
      });
      expect(
        supabase.from('addresses').update(mockAddresses[0].deliveryAddress).eq
      ).toHaveBeenCalledWith('id', mockAddresses[0].id);
    });

    it('should throw an error if updating fails', async () => {
      // Mock error response
      (
        supabase
          .from('addresses')
          .update(mockAddresses[0].deliveryAddress)
          .eq('id', mockAddresses[0].id).select as Mock
      ).mockResolvedValueOnce({
        data: null,
        error: new Error('Failed to update'),
      });

      await expect(
        updateDeliveryAddress(mockAddresses, mockAddresses[0])
      ).rejects.toThrow(
        `Address with id ${mockAddresses[0].id} could not be updated`
      );
    });
  });

  describe('deleteAddress - SUPABASE API', () => {
    it('should delete an address successfully', async () => {
      // Mock successful response
      (
        supabase.from('addresses').delete().eq as unknown as Mock
      ).mockResolvedValueOnce({
        data: true,
        error: null,
      });

      const result = await deleteAddress(mockAddresses[0]);
      expect(result).toBe(true);
      expect(supabase.from).toHaveBeenCalledWith('addresses');
      expect(supabase.from('addresses').delete).toHaveBeenCalled();
      expect(supabase.from('addresses').delete().eq).toHaveBeenCalledWith(
        'id',
        mockAddresses[0].id
      );
    });

    it('should throw an error if deleting fails', async () => {
      // Mock error response
      (
        supabase.from('addresses').delete().eq as unknown as Mock
      ).mockResolvedValueOnce({
        error: new Error('Failed to delete'),
      });

      await expect(deleteAddress(mockAddresses[0])).rejects.toThrow(
        'Address could not be deleted'
      );
    });
  });
});
