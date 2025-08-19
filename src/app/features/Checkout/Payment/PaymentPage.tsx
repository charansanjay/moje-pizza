import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';

import styles from './PaymentPage.module.css';

import { PaymentMethod } from './PaymentMethod';

import { useOrderMutation } from '../../Orders';

import {
  type DeliveryStatusType,
  type OrderStatusType,
  type PaymentMethodType,
  type PaymentStatusType,
} from '../../Orders';
import { type CartType } from '../../Cart';
import { type CustomerType } from '../../Authorization';
import { type AddressType } from '../../Address';

// Should come from the server - DEMO purpose only
const paymentMethods = [
  { id: 'paypal' as const, label: 'PayPal', icon: '💰' },
  {
    id: 'credit_debit_visa' as const,
    label: 'Credit / Debit / Visa Card',
    icon: '💳',
  },
  {
    id: 'cash' as const,
    label: 'Cash on Delivery',
    icon: '📦',
  },
];

const PaymentPage = () => {
  const customer = useSelector(
    (state: { customer: { customerData: CustomerType } }) =>
      state.customer.customerData
  );

  // Customer Cart
  const customerCart = useSelector(
    (state: { cart: { customerCart: CartType } }) => state.cart.customerCart
  );

  // delivery Address
  const deliveryAddress = useSelector(
    (state: { address: { deliveryAddress: AddressType } }) =>
      state.address.deliveryAddress
  );

  /* react-query order mutation */
  const { createOrder } = useOrderMutation();

  // local states
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethodType | null>(null);
  const [orderPaymentStatus, setPaymentStatus] =
    useState<PaymentStatusType>('paid');
  const [selectable, setSelectable] = useState<boolean>(false);
  const orderStatus: OrderStatusType = 'complete';
  const deliveryStatus: DeliveryStatusType = 'Processing';

  const handlePaymentSubmit = useCallback(async () => {
    // If no payment method is selected, return
    if (!selectedPaymentMethod) return;

    // make the selectable property to true
    setSelectable(true);

    // Todo - make network request to book order and then process payment for the order id.
    setPaymentStatus('processing');

    const newOrderObject = {
      customer_id: customer.id || '',
      orderStatus: orderStatus,
      paymentMethod: selectedPaymentMethod,
      paymentStatus: orderPaymentStatus,
      deliveryStatus,
      cart: customerCart,
      customer: customer,
      deliveryAddress,
    };

    createOrder(newOrderObject);
  }, [selectedPaymentMethod]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Select Payment Method</h1>

      <div className={styles.paymentMethods}>
        {paymentMethods.map((method) => (
          <PaymentMethod
            key={method.id}
            label={method.label}
            icon={method.icon}
            selectable={selectable}
            isSelected={selectedPaymentMethod === method.id}
            onSelect={() => setSelectedPaymentMethod(method.id)}
          />
        ))}
      </div>

      <button
        className={styles.payButton}
        disabled={!selectedPaymentMethod || orderPaymentStatus === 'processing'}
        onClick={handlePaymentSubmit}
      >
        {orderPaymentStatus === 'processing'
          ? 'Processing...'
          : `Pay Now ${customerCart.cartSummary.grandTotal}`}
      </button>

      {orderPaymentStatus === 'failed' && (
        <p className={styles.errorMessage}>
          Payment failed. Please try another method.
        </p>
      )}
    </div>
  );
};

export default PaymentPage;
