import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { getOrders } from '../services/apiOrder.ts';

import { setToast } from '../redux/slices/settingsSlice/settingsSlice.ts';
import { setCustomerOrders } from '../redux/slices/orderSlice/orderSlice.ts';

import { type AppDispatch } from '../redux/store.ts';

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
