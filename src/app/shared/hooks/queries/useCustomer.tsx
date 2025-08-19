import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { setToast } from '../../../store/slices/settingsSlice/settingsSlice';
import { setCustomer } from '../../slices/customerSlice/customerSlice';

import { fetchCustomerById } from '../../../features/Authorization';

import { type AppDispatch } from '../../../store/store';

export const useCustomer = ({ customerId }: { customerId: string }) => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    isLoading: isCustomerLoading,
    isError,
    error,
    data: customer,
    isSuccess,
  } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => fetchCustomerById(customerId),
  });

  if (isSuccess) {
    dispatch(setCustomer(customer[0]));
  }

  if (isError) {
    dispatch(
      setToast({
        message: 'Failed to fetch customer',
        type: 'error',
      })
    );
  }

  return { customer, isCustomerLoading, isError, error, isSuccess };
};
