import { type NavigateFunction, useNavigate } from 'react-router-dom';
import styles from './PaymentSuccessPage.module.css';

import { ContinueButton } from '../../../../components/Button/ContinueButton.tsx';

export const PaymentSuccessPage = () => {
  const navigate: NavigateFunction = useNavigate();
  return (
    <div className={styles.successContainer}>
      <div className={styles.successHeading}>Payment Successful! 🎉</div>
      <p className={styles.successMessage}>
        Your order has been placed successfully. And will be delivered soon.
      </p>
      <ContinueButton
        type='primary'
        float='right'
        text='View Order Details'
        showIcon
        onClick={() => navigate('/customer/order-details', { replace: true })}
      />
    </div>
  );
};
