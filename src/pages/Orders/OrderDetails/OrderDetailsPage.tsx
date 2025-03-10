import styles from './OrderDetailsPage.module.css';
import { useSelector } from 'react-redux';

import { CartItems } from '../../Cart/CartItems/CartItems.tsx';
import { CartSummary } from '../../Cart/CartSummary/CartSummary.tsx';
import { OrderInfo } from './OrderInfo/OrderInfo.tsx';

import { OrderType } from '../../../services/apiOrder.ts';
import { PageHeading } from '../../../components/PageHeading/PageHeading.tsx';

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
