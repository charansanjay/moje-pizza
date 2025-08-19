import styles from './Coupon.module.css';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setToast } from '../../../../store/slices/settingsSlice/settingsSlice';

import { useCartMutation } from '../../hooks/mutations/useCartMutation';

import { type AppDispatch } from '../../../../store/store';
import { type CartType } from '../../types';

interface CouponPropsType {
  cartData: CartType;
}

export const Coupon = ({ cartData }: CouponPropsType) => {
  const dispatch = useDispatch<AppDispatch>();

  const customerCart = useSelector(
    (state: { cart: { customerCart: CartType } }) => state.cart.customerCart
  );

  // local states
  const [couponCode, setCouponCode] = useState('');

  // APPLY coupon code
  const { isLoading: isCouponApplying, applyCouponDiscount } =
    useCartMutation();

  // Handle coupon code application
  const handleApplyCoupon = () => {
    if (!couponCode) {
      dispatch(
        setToast({ message: 'Please enter coupon code', type: 'error' })
      );
      return;
    }

    const cartObject = {
      cartData: customerCart,
      couponCode,
    };
    applyCouponDiscount(cartObject);
  };

  if (cartData.cartSummary.discountPercentage) {
    return null;
  }

  return (
    <div className={styles.couponSection}>
      <input
        type='text'
        placeholder='Enter code - DISCOUNT15'
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
      />
      <button disabled={isCouponApplying} onClick={handleApplyCoupon}>
        {isCouponApplying ? 'Applying...' : 'Apply Coupon'}
      </button>
    </div>
  );
};
