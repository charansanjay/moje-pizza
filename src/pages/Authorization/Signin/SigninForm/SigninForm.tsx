import { useState } from 'react';

import styles from './SigninForm.module.css';

import { FormInput } from '../../../../components/FormInput/FormInput';
import { useForm } from 'react-hook-form';
import { FormSubmitButton } from '../../../../components/Button/FormSubmitButton/FormSubmitButton';

import { IoEyeOutline } from 'react-icons/io5';
import { IoEyeOffOutline } from 'react-icons/io5';

import { useSigninMutation } from '../../../../customHooks/mutationHooks/authMutations/useSigninMutation.tsx';

export interface SigninFormType {
  emailAddress: string;
  password: string;
  rememberMe: boolean;
}
 
export const SigninForm = () => {
  const { isSigning, error, signin } = useSigninMutation();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { handleSubmit, register, formState, getValues } =
    useForm<SigninFormType>({
      mode: 'onChange',
    });

  const { errors } = formState;

  const onFormSubmit = async (data: SigninFormType) => { 
    signin(data);
  };

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit(onFormSubmit)}>
      {/* Email */}
      <FormInput
        label='Email Address'
        id='emailAddress'
        type='email'
        error={errors.emailAddress?.message as string}
        maxLength={51}
        {...register('emailAddress', {
          required: 'Email is required',
          maxLength: {
            value: 50,
            message: 'Maximum 50 characters allowed',
          },
          pattern: {
            value: /\S+@\S+\.\S+/i,
            message: 'Invalid email format',
          },
        })}
      />

      {/* Password */}
      <FormInput
        label='Password'
        id='password'
        type={showPassword ? 'text' : 'password'}
        showIcon={true}
        icon={
          showPassword ? (
            <IoEyeOffOutline
              className={styles.icon}
              onClick={() => setShowPassword(!showPassword)}
              data-testid='toggle_password_visible'
            />
          ) : (
            <IoEyeOutline
              className={styles.icon}
              onClick={() => setShowPassword(!showPassword)}
              data-testid='toggle_password_invisible'
            />
          )
        }
        error={errors.password?.message as string}
        maxLength={17}
        {...register('password', {
          required: 'Password is required',
          maxLength: {
            value: 50,
            message: 'Maximum 16 characters allowed',
          },
          minLength: {
            value: 5,
            message: 'Minimum 5 characters required',
          },
        })}
      />

      {/* Checkbox */}
      <div className={styles.rememberMe}>
        Remember me
        <input
          type='checkbox'
          id='rememberMe'
          checked={getValues('rememberMe')}
          {...register('rememberMe')}
        />
      </div>

      <div>
        <FormSubmitButton
          disabled={isSigning}
          title={isSigning ? 'Processing...' : 'Signin'}
        />
      </div>
      {error && <div className='error'>{error.message}</div>}
    </form>
  );
};
