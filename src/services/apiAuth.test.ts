import { describe, it, expect, vi, Mock } from 'vitest';
import { signinCustomer, signupCustomer } from './apiAuth';
import supabase from '../utils/supabase';
import { fetchCustomerByEmail, createCustomer, addCustomerCartId } from './apiCustomer';
import { createCart } from './apiCart';
import { mockCustomer } from '../assets/mockData/mockCustomer';

vi.mock('../utils/supabase');
vi.mock('./apiCustomer');
vi.mock('./apiCart');

describe('apiAuth - SERVICE', () => {
  describe('signinCustomer - SUPABASE API', () => {
    it('should sign in a customer and fetch customer data', async () => {
      const signinFormData = {
        emailAddress: 'test@example.com',
        password: 'password123',
        rememberMe: false
      };

      const mockSignInResponse = {
        data: { user: { id: 'user-id' } },
        error: null,
      };

      (supabase.auth.signInWithPassword as Mock).mockResolvedValue(mockSignInResponse);
      (fetchCustomerByEmail as Mock).mockResolvedValue(mockCustomer);

      const result = await signinCustomer(signinFormData);

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: signinFormData.emailAddress,
        password: signinFormData.password,
      });
      expect(fetchCustomerByEmail).toHaveBeenCalledWith(signinFormData.emailAddress);
      expect(result).toEqual(mockCustomer);
    });

    it('should throw an error if sign in fails', async () => {
      const signinFormData = {
        emailAddress: 'test@example.com',
        password: 'password123',
        rememberMe: false
      };

      const mockSignInResponse = {
        data: null,
        error: { message: 'Sign in error' },
      };

      (supabase.auth.signInWithPassword as Mock).mockResolvedValue(mockSignInResponse);

      await expect(signinCustomer(signinFormData)).rejects.toThrow('Sign in error');
    });
  });

  describe('signupCustomer - SUPABASE API', () => {
    it('should sign up a customer, create customer and cart, and update customer with cart id', async () => {
      const signupData = {
        emailAddress: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'firstName',
        lastName: 'lastName',
      };

      const mockSignUpResponse = {
        data: {
          user: {
            id: 'user-id',
            user_metadata: {
              email: 'test@example.com',
              firstName: 'firstName',
              lastName: 'lastName',
              role: 'customer',
            },
          },
        },
        error: null,
      };

      const mockCreateCustomerResponse = [{ id: 'customer-id' }];
      const mockCreateCartResponse = [{ id: 'cart-id' }];
      const mockUpdatedCustomer = [{ id: 'customer-id', cart_id: 'cart-id' }];

      (supabase.auth.signUp as Mock).mockResolvedValue(mockSignUpResponse);
      (createCustomer as Mock).mockResolvedValue(mockCreateCustomerResponse);
      (createCart as Mock).mockResolvedValue(mockCreateCartResponse);
      (addCustomerCartId as Mock).mockResolvedValue(mockUpdatedCustomer);

      const result = await signupCustomer(signupData);

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: signupData.emailAddress,
        password: signupData.password,
        options: {
          data: {
            role: 'customer',
            firstName: signupData.firstName,
            lastName: signupData.lastName,
            emailAddress: signupData.emailAddress,
          },
        },
      });
      expect(createCustomer).toHaveBeenCalledWith({
        emailAddress: 'test@example.com',
        uuid: 'user-id',
        firstName: 'firstName',
        lastName: 'lastName',
        role: 'customer',
        metaData: {
          email: 'test@example.com',
          emailAddress: 'test@example.com',
          email_verified: undefined,
          firstName: 'firstName',
          lastName: 'lastName',
          role: 'customer',
          phone_verified: undefined,
          sub: undefined,
        },
        addresses: [],
        defaultBilling: '',
        defaultShipping: '',
        avatar: '',
      });
      expect(createCart).toHaveBeenCalledWith({
        customer_id: 'customer-id',
        items: [],
        cartSummary: {
          subtotal: 0,
          deliveryCost: 0,
          vat: 0,
          discountAmount: 0,
          grandTotal: 0,
          vatRatePercentage: 0,
          discountPercentage: 0,
        },
        itemsQuantity: 0,
        itemsCount: 0,
        isActive: true,
      });
      expect(addCustomerCartId).toHaveBeenCalledWith('customer-id', 'cart-id');
      expect(result).toEqual({
        customerData: mockUpdatedCustomer[0],
        customerCart: mockCreateCartResponse[0],
      });
    });

    it('should throw an error if sign up fails', async () => {
      const signupData = {
        emailAddress: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockSignUpResponse = {
        data: null,
        error: { message: 'Sign up error' },
      };

      (supabase.auth.signUp as Mock).mockResolvedValue(mockSignUpResponse);

      await expect(signupCustomer(signupData)).rejects.toThrow('Sign up error');
    });
  });
});