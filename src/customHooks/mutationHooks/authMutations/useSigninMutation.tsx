import { type NavigateFunction, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

/* redux-slice/services */
import { AppDispatch } from '../../../redux/store.ts';
import { setToast } from '../../../redux/slices/settingsSlice/settingsSlice.ts';
import { login } from '../../../redux/slices/authSlice/authSlice.ts';
import { setCustomer } from '../../../redux/slices/customerSlice/customerSlice.ts';
import { setCustomerCart } from '../../../redux/slices/cartSlice/cartSlice.ts';
import { signinCustomer } from '../../../services/apiAuth.ts';

/* types */
import { type SigninFormType } from '../../../pages/Authorization/Signin/SigninForm/SigninForm.tsx';

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
