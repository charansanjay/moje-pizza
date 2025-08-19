import { supabase } from '../../../utils/supabase';

import { resetCart } from '../../Cart/services/apiCart';

import { type OrderType } from '../types';

export const createOrder = async (orderObject: OrderType) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderObject])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  let resetCartResponse = null;

  if (orderObject.cart.id) {
    resetCartResponse = await resetCart(orderObject.cart.id);
  } else {
    throw new Error('Cart ID is undefined');
  }

  return { data: data[0], resetCartData: resetCartResponse };
};

export const getOrders = async (customerId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_id', customerId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
