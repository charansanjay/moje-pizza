import styles from './SignupForm.module.css';
import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { FormInput } from '../../../../components/FormInput/FormInput.tsx';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { FormSubmitButton } from '../../../../components/Button/FormSubmitButton/FormSubmitButton.tsx';
import { useSignupMutation } from '../../../../customHooks/mutationHooks/authMutations/useSignupMutation.tsx';
import { Loader } from '../../../../components/Loader/Loader.tsx';

export interface SignupFormType {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
}

export const SignupForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const { isLoading: isSigningUp, error, signup } = useSignupMutation();

  const { handleSubmit, register, formState } = useForm<SignupFormType>({
    mode: 'onChange',
  });

  const { errors } = formState;

  const onFormSubmit = async (data: SignupFormType) => {
    signup(data);
  };

  if (isSigningUp) {
    return <Loader />;
  }

  return (
    <form className={styles.signupForm} onSubmit={handleSubmit(onFormSubmit)}>
      {/* First name */}
      <FormInput
        type='text'
        id='firstName'
        label='First Name'
        maxLength={31}
        error={errors.firstName?.message as string}
        {...register('firstName', {
          required: 'First name is required',
          maxLength: {
            value: 30,
            message: 'Maximum 30 characters allowed',
          },
          pattern: {
            value: /^[A-Za-z\s]+$/i,
            message: 'Invalid format - must contain only alphabets (a-z)',
          },
        })}
      />

      {/* Last name */}
      <FormInput
        type='text'
        label='Last Name'
        id='lastName'
        error={errors.lastName?.message as string}
        maxLength={31}
        {...register('lastName', {
          required: 'Last name is required',
          maxLength: {
            value: 30,
            message: 'Maximum 30 characters allowed',
          },
          pattern: {
            value: /^[A-Za-z]+$/i,
            message: 'Invalid format - no spaces allowed',
          },
        })}
      />

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

      {/* Confirm Password */}
      <FormInput
        label='Confirm Password'
        id='confirmPassword'
        type={showConfirmPassword ? 'text' : 'password'}
        showIcon={true}
        icon={
          showConfirmPassword ? (
            <IoEyeOffOutline
              className={styles.icon}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              data-testid='toggle_confirm_password_visible'
            />
          ) : (
            <IoEyeOutline
              className={styles.icon}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              data-testid='toggle_confirm_password_invisible'
            />
          )
        }
        error={errors.password?.message as string}
        maxLength={17}
        {...register('confirmPassword', {
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

      {error && <div className={styles.error}>! {error.message}</div>}

      <div>
        <FormSubmitButton
          disabled={isSigningUp}
          title={isSigningUp ? 'Registering' : 'Signup'}
        />
      </div>
      {/* // todo: proper styles for error message or error component */}
    </form>
  ); 
};
