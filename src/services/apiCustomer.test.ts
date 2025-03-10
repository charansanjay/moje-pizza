import { cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock, afterEach } from 'vitest';

import supabase from '../utils/supabase.ts';
import {
  fetchCustomerByEmail,
  addCustomerCartId,
  fetchCustomerById,
  createCustomer,
} from './apiCustomer.ts';
import { fetchCustomerCart } from './apiCart.ts';

/* mock data */
import { mockCart } from '../assets/mockData/mockCart.ts';
import { mockCustomer } from '../assets/mockData/mockCustomer.ts';

// Mock the fetchCustomerCart function
vi.mock('./apiCart.ts', () => ({
  fetchCustomerCart: vi.fn(),
}));

// Mock the supabase client
vi.mock('../utils/supabase.ts', () => ({
  default: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
  },
}));

describe('apiCustomer - SERVICE', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it('fetchCustomerByEmail should fetch customer data by email', async () => {
    (
      supabase.from('customers').select('*').eq as unknown as Mock
    ).mockResolvedValueOnce({
      data: [mockCustomer],
      error: null,
    });

    (fetchCustomerCart as Mock).mockResolvedValueOnce({
      data: [mockCart],
      error: null,
    });

    const result = await fetchCustomerByEmail(mockCustomer.emailAddress);
    expect(result?.customerData).toEqual(mockCustomer);
    expect(supabase.from).toHaveBeenCalledWith('customers');
    expect(supabase.from('customers').select).toHaveBeenCalledWith('*');
    expect(supabase.from('customers').select('*').eq).toHaveBeenCalledWith(
      'emailAddress',
      mockCustomer.emailAddress
    );
    expect(fetchCustomerCart).toHaveBeenCalledWith(mockCustomer.cart_id);
  });

  it('addCustomerCartId should add cart id to customer', async () => {
    (
      supabase
        .from('customers')
        .update({ cart_id: mockCart.id })
        .eq('id', mockCustomer.id).select as unknown as Mock
    ).mockResolvedValueOnce({
      data: [mockCustomer],
      error: null,
    });

    const result = await addCustomerCartId(mockCustomer.id!, mockCart.id!);
    expect(supabase.from).toHaveBeenCalledWith('customers');
    expect(supabase.from('customers').update).toHaveBeenCalledWith({
      cart_id: mockCart.id,
    });
    expect(
      supabase.from('customers').update({ cart_id: mockCart.id }).eq
    ).toHaveBeenCalledWith('id', mockCustomer.id);
    expect(result).toEqual([mockCustomer]);
  });

  it('fetchCustomerById should fetch customer data by id', async () => {
    (
      supabase.from('customers').select('*').eq as unknown as Mock
    ).mockResolvedValueOnce({
      data: [mockCustomer],
      error: null,
    });

    const result = await fetchCustomerById(mockCustomer.id!);
    expect(supabase.from).toHaveBeenCalledWith('customers');
    expect(supabase.from('customers').select).toHaveBeenCalledWith('*');
    expect(supabase.from('customers').select().eq).toHaveBeenCalledWith(
      'id',
      mockCustomer.id
    );
    expect(result).toEqual([mockCustomer]);
  });

  it('createCustomer should create a new customer', async () => {
    (
      supabase.from('customers').insert([mockCustomer])
        .select as unknown as Mock
    ).mockResolvedValueOnce({
      data: [mockCustomer],
      error: null,
    });

    const result = await createCustomer(mockCustomer);
    expect(supabase.from).toHaveBeenCalledWith('customers');
    expect(supabase.from('customers').insert).toHaveBeenCalledWith([
      mockCustomer,
    ]);
    expect(result).toEqual([mockCustomer]);
  });
});
