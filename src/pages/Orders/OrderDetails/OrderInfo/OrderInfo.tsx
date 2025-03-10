import { useSelector } from 'react-redux';

import styles from './OrderInfo.module.css';
import { OrderType } from '../../../../services/apiOrder.ts';
import { formatDate } from '../../../../utils/helpers.ts';

export const OrderInfo = () => {
  const selectedOrder = useSelector(
    (state: { order: { selectedOrder: OrderType } }) =>
      state.order.selectedOrder
  );

  const {
    created_at,
    deliveryAddress,
    customer,
    paymentMethod,
    paymentStatus,
    orderStatus,
    deliveryStatus,
  } = selectedOrder;

  const { firstName, lastName, emailAddress } = customer?.metaData || {};
  const { houseAddress, city, pinCode, phoneNumber } = deliveryAddress || {};

  return (
    <div className={styles.orderInfoContainer}>
      <div className={styles.heading}>Order Information</div>

      <table className={styles.orderInfoTable}>
        <tbody>
          <tr>
            <td className={styles.rowTitle}>
              <strong>Name:</strong>
            </td>
            <td className={styles.rowValue}>
              {firstName}&nbsp;{lastName}
            </td>
          </tr>

          <tr>
            <td className={styles.rowTitle}>
              <strong>Order Date:</strong>
            </td>
            <td className={styles.rowValue}>{formatDate(created_at!)}</td>
          </tr>

          <tr>
            <td className={styles.rowTitle}>
              <strong>Order Status:</strong>
            </td>
            <td className={styles.rowValue}>{orderStatus}</td>
          </tr>

          <tr>
            <td className={styles.rowTitle}>
              <strong>Payment Method:</strong>
            </td>
            <td className={styles.rowValue}>{paymentMethod}</td>
          </tr>

          <tr>
            <td className={styles.rowTitle}>
              <strong>Payment Status:</strong>
            </td>
            <td className={styles.rowValue}>{paymentStatus}</td>
          </tr>

          <tr>
            <td className={styles.rowTitle}>
              <strong>Delivery Status:</strong>
            </td>
            <td className={styles.rowValue}>{deliveryStatus}</td>
          </tr>

          <tr>
            <td className={styles.rowTitle}>
              <strong>Email:</strong>
            </td>
            <td className={styles.rowValue}>{emailAddress}</td>
          </tr>

          <tr>
            <td className={styles.rowTitle}>
              <strong>Delivery Address:</strong>
            </td>
            <td
              className={styles.rowValue}
              style={{ fontSize: 'small', lineHeight: '1.5' }}
            >
              <b>
                {firstName}&nbsp;{lastName}
              </b>
              <br />
              <b>Street:</b> {houseAddress}
              <br />
              <b>City:</b> {city}
              <br />
              <b>PinCode:</b> {pinCode}
              <br />
              <b>Phone number: </b>
              {phoneNumber}
            </td>
          </tr>

          <tr>
            <td className={styles.rowTitle}>
              <strong>Download Invoice:</strong>
            </td>
            <td className={styles.rowValue}>
              <div className={styles.downloadButton}>Download</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
