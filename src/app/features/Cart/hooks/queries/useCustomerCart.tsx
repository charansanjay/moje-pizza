import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { fetchCustomerCart } from '../../services/apiCart';

import { setCustomerCart } from '../../slice/cartSlice';
import { setToast } from '../../../../store/slices/settingsSlice/settingsSlice';

import { type AppDispatch } from '../../../../store/store';
import { type CartType } from '../../types';

export const useCustomerCart = ({ cartId }: { cartId: string }) => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    data: customerCart,
    isLoading: isCartLoading,
    error,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ['customerCart'],
    queryFn: () => fetchCustomerCart(cartId),
  });

  if (isSuccess) {
    dispatch(setCustomerCart(customerCart.data as CartType));
  }

  if (isError) {
    dispatch(
      setToast({
        message: 'Failed to fetch customer cart',
        type: 'error',
      })
    );
  }

  return { customerCart, isCartLoading, error, isError, isSuccess };
};
