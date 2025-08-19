import { AddressType } from "../Address";
import { CustomerType } from "../Authorization";
import { CartType } from "../Cart";

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