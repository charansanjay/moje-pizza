import { AddressType } from '../redux/slices/addressSlice/addressSlice.ts';
import supabase from '../utils/supabase.ts';

import { CartType, resetCart } from './apiCart';
import { CustomerType } from './apiCustomer';

export type PaymentMethodType = 'paypal' | 'credit_debit_visa' | 'cash';
export type OrderStatusType = 'created' | 'pending' | 'processing' | 'complete';
export type PaymentStatusType = 'pending' | 'processing' | 'paid' | 'failed';
export type DeliveryStatusType = 'Processing' | 'Shipped' | 'Delivered';

export interface OrderType {
  id?: string;
  created_at?: string;
  updated_at?: string;
  customer_id: string;
  orderStatus: OrderStatusType;
  paymentMethod: PaymentMethodType;
  paymentStatus: PaymentStatusType;
  deliveryStatus: DeliveryStatusType;
  cart: CartType;
  customer: CustomerType;
  deliveryAddress: AddressType;
}

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
