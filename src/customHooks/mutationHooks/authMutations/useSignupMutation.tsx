import { type NavigateFunction, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

/* redux-slice/service */
import { setToast } from '../../../redux/slices/settingsSlice/settingsSlice.ts';
import { signupCustomer } from '../../../services/apiAuth.ts';

/* types */
import { type SignupFormType } from '../../../pages/Authorization/Signup/SignupForm/SignupForm.tsx';
import { type AppDispatch } from '../../../redux/store.ts';

export const useSignupMutation = () => {
  const navigate: NavigateFunction = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const signupMutation = useMutation({
    mutationFn: async (signupData: SignupFormType) => {
      const data = await signupCustomer({ ...signupData });
      return data;
    },
    onSuccess: (data) => {
      if (data) {
        dispatch(
          setToast({
            message: 'Account CREATED successfully',
            type: 'success',
          })
        );
        navigate('/signin');
      } else {
        dispatch(
          setToast({
            message: 'Signup FAILED: could not create customer',
            type: 'error',
          })
        );
      }
    },
    onError: (error: Error) => {
      // Error from database/API
      dispatch(
        setToast({
          message: error.message,
          type: 'error',
        })
      );
    },
  });
  return {
    isLoading: signupMutation.isLoading,
    error: signupMutation.error,
    signup: signupMutation.mutate,
  };
};
