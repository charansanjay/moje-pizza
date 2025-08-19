import styles from './OrderDetailsPage.module.css';
import { useSelector } from 'react-redux';

import { CartItems, CartSummary } from '../../Cart';
import { PageHeading } from '../../../components';
import { OrderInfo } from './OrderInfo/OrderInfo';

import { type OrderType } from '../types';

export const OrderDetailsPage = () => {
  const selectedOrder = useSelector(
    (state: { order: { selectedOrder: OrderType } }) =>
      state.order.selectedOrder
  );
  return (
    <div className={styles.orderDetailsContainer}>
      <PageHeading title={`Order (#${selectedOrder.id})`} />
      <CartItems cartData={selectedOrder.cart} showActions={false} />
      <div className={styles.section2}>
        <OrderInfo />
        <CartSummary cartData={selectedOrder.cart} />
      </div>
    </div>
  );
};
