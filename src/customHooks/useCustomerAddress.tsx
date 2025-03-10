import { useQuery } from '@tanstack/react-query';

import { fetchCustomerAddress } from '../services/apiAddress';

import { useDispatch } from 'react-redux';
import { setCustomerAddresses } from '../redux/slices/addressSlice/addressSlice.ts';
import { setToast } from '../redux/slices/settingsSlice/settingsSlice.ts';

import { type AppDispatch } from '../redux/store.ts';
export const useCustomerAddress = ({ customerId }: { customerId: string }) => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    data: customerAddresses,
    isLoading: isAddressLoading,
    error,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ['customerAddresses'],
    queryFn: () => fetchCustomerAddress(customerId),
  });

  if (isSuccess) {
    dispatch(setCustomerAddresses(customerAddresses));
  }

  if (isError) {
    dispatch(
      setToast({
        message: 'Failed to fetch customer address',
        type: 'error',
      })
    );
  }

  return { customerAddresses, isAddressLoading, error, isError, isSuccess };
};
