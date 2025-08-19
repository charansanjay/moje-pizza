import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { getOrders } from '../../services/apiOrder';

import { setToast } from '../../../../store/slices/settingsSlice/settingsSlice';
import { setCustomerOrders } from '../../slice/orderSlice';

import { type AppDispatch } from '../../../../store/store';

export const useCustomerOrders = ({ customerId }: { customerId: string }) => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    data: orders,
    isLoading,
    error,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ['customerOrders'],
    queryFn: () => getOrders(customerId),
  });

  if (isSuccess) {
    dispatch(setCustomerOrders(orders));
  }

  if (isError) {
    dispatch(
      setToast({
        message: 'Failed to fetch customer orders',
        type: 'error',
      })
    );
  }

  return { orders, isLoading, error, isError, isSuccess };
};
