import supabase from '../utils/supabase.ts';

import { AddressType } from '../redux/slices/addressSlice/addressSlice.ts';

import { fetchCustomerCart, CartType } from './apiCart.ts';

interface CustomerMetadataType {
  email: string;
  emailAddress: string;
  email_verified: boolean;
  firstName: string;
  lastName: string;
  phone_verified: boolean;
  role: string;
  sub: string;
}

export interface CustomerType {
  id?: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  role: string;
  uuid: string;
  metaData: CustomerMetadataType | undefined;
  addresses: AddressType[] | [];
  cart_id?: string | null;
  defaultBilling: string;
  defaultShipping: string;
  avatar: string;
  customerCart?: CartType;
}

export const fetchCustomerByEmail = async (emailAddress: string) => {
  const { data: customerData, error } = await supabase
    .from('customers')
    .select('*')
    .eq('emailAddress', emailAddress);

  if (error) {
    throw Error('Failed fetching customer');
  }

  if (customerData.length === 0) {
    return null;
  }

  const customerCart = await fetchCustomerCart(customerData[0].cart_id);

  if (
    Object.keys(customerCart).length === 0 ||
    Object.keys(customerCart.data).length === 0
  ) {

    return {
      customerData: customerData[0] as CustomerType,
      customerCart: {} as CartType,
    };
  }

  return {
    customerData: customerData[0] as CustomerType,
    customerCart: customerCart.data as CartType,
  };
};

export const addCustomerCartId = async (customerId: string, cartId: string) => {
  const { data, error } = await supabase
    .from('customers')
    .update({ cart_id: cartId })
    .eq('id', customerId)
    .select();

  if (error) {
    throw Error('Failed to add cart id to customer');
  }

  return data;
};

/* Maybe for the ADMIN PORTAL feature */
export const fetchCustomerById = async (customerId: string) => {
  const { data: customerData, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', customerId);

  if (error) {
    throw Error('Failed fetching customer');
  }

  return customerData;
};

export const createCustomer = async (customer: CustomerType) => {
  const { data, error } = await supabase
    .from('customers')
    .insert([customer])
    .select();

  if (error) {
    throw Error(error.message);
  }

  return data;
};
