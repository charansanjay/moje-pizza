import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { fetchCustomerCart, CartType } from '../services/apiCart';
import { setCustomerCart } from '../redux/slices/cartSlice/cartSlice.ts';
import { AppDispatch } from '../redux/store.ts';
import { setToast } from '../redux/slices/settingsSlice/settingsSlice.ts';

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
