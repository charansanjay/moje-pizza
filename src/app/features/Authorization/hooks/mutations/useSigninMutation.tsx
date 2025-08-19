import { type NavigateFunction, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { setCustomer } from '../../../../shared/slices/customerSlice/customerSlice';
import { setToast } from '../../../../store/slices/settingsSlice/settingsSlice';
import { signinCustomer } from '../../services/apiAuth';
import { login } from '../../slice/authSlice';
import { setCustomerCart } from '../../../Cart';

import { type AppDispatch } from '../../../../store/store';
import { type SigninFormType } from '../../types';

export const useSigninMutation = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate: NavigateFunction = useNavigate();

  const signinMutation = useMutation({
    mutationFn: async (signinFormData: SigninFormType) => {
      const data = await signinCustomer({ ...signinFormData });
      return data;
    },
    onSuccess: (data) => {
      if (data) {
        dispatch(login());
        dispatch(setCustomer(data.customerData));
        dispatch(setCustomerCart(data.customerCart));
        navigate('/');
        dispatch(
          setToast({
            message: 'Signin Successful',
            type: 'success',
          })
        );
      } else {
        dispatch(
          setToast({
            message: 'Signin FAILED: Customer not found',
            type: 'error',
          })
        );
      }
    },
    onError: (error: Error) => {
      dispatch(
        setToast({
          message: error.message,
          type: 'error',
        })
      );
    },
  });

  return {
    isSigning: signinMutation.isLoading,
    error: signinMutation.error,
    signin: signinMutation.mutate,
  };
};
