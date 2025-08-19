import { type NavigateFunction, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { signupCustomer } from '../../services/apiAuth';
import { setToast } from '../../../../store/slices/settingsSlice/settingsSlice';

import { type SignupFormType } from '../../types';
import { type AppDispatch } from '../../../../store/store';

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
