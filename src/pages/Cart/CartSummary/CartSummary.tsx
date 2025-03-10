import styles from './CartSummary.module.css';

import { CartType } from '../../../services/apiCart.ts';

interface CartSummaryPropsType {
  cartData: CartType;
}

export const CartSummary = ({ cartData }: CartSummaryPropsType) => {
  const {
    subtotal,
    deliveryCost,
    vat,
    discountAmount,
    grandTotal,
    discountPercentage,
    vatRatePercentage,
  } = cartData.cartSummary;

  return (
    <div className={styles.summary}>
      <div className={styles.heading}>Order Summary</div>

      <table className={styles.summaryTable}>
        <tbody>
          <tr>
            <td className={styles.rowTitle}>Subtotal:</td>
            <td className={styles.rowValue}>
              {subtotal.toFixed(2)}&nbsp;{cartData.currency}
            </td>
          </tr>
          <tr>
            <td className={styles.rowTitle}>Delivery Cost:</td>
            <td className={styles.rowValue}>
              {deliveryCost.toFixed(2)}&nbsp;{cartData.currency}
            </td>
          </tr>
          <tr>
            <td className={styles.rowTitle}>VAT ({vatRatePercentage}%):</td>
            <td className={styles.rowValue}>
              {vat.toFixed(2)}&nbsp;{cartData.currency}
            </td>
          </tr>
          {discountAmount > 0 && (
            <tr>
              <td className={styles.rowTitle}>
                Discount ({discountPercentage}%):
              </td>
              <td className={styles.rowValue}>
                -{discountAmount.toFixed(2)}&nbsp;{cartData.currency}
              </td>
            </tr>
          )}
          <tr>
            <td className={styles.rowTitle}>
              <strong>Grand Total:</strong>
            </td>
            <td className={styles.rowValue}>
              <strong>
                {grandTotal.toFixed(2)}&nbsp;{cartData.currency}
              </strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
