import supabase from '../utils/supabase.ts';

import { type CustomerType } from './apiCustomer.ts';
import { type AddressType } from '../redux/slices/addressSlice/addressSlice.ts';

export const fetchCustomerAddress = async (customerId: string) => {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('customer_id', customerId);

  if (error) {
    throw Error('Failed to fetch customer address');
  }

  return data;
};

export const addNewAddress = async (
  newAddress: AddressType,
  customer: CustomerType
) => {
  const addressWithCustomerId = { ...newAddress, customer_id: customer.id };
  const { data, error } = await supabase
    .from('addresses')
    .insert([addressWithCustomerId])
    .select();

  if (error) {
    throw Error('Address could not be added');
  }

  return data;
};

export const updateAddress = async (updateObj: AddressType) => {
  const { data, error } = await supabase
    .from('addresses')
    .update(updateObj)
    .eq('id', updateObj.id)
    .select();

  if (error) {
    throw Error('Address could not be updated');
  }

  return data;
};

export const updateDeliveryAddress = async (
  addressesArray: AddressType[],
  address: AddressType
) => {
  const updates = addressesArray.map(async (item) => {
    const { data, error } = await supabase
      .from('addresses')
      .update({ deliveryAddress: item.id === address.id })
      .eq('id', item.id)
      .select();

    if (error) {
      throw Error(`Address with id ${address.id} could not be updated`);
    }

    return data;
  });

  return Promise.all(updates);
};

export const deleteAddress = async (address: AddressType) => {
  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', address.id);

  if (error) {
    throw Error('Address could not be deleted');
  }

  return true;
};
