import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';

/* css */
import styles from './AddressForm.module.css';

/* components */
import { FormInput } from '../../../components/FormInput/FormInput.tsx';
import { PhoneInputWithValidation } from '../../../components/PhoneInputWithValidation/PhoneInputWithValidation.tsx';
import { FormSubmitButton } from '../../../components/Button/FormSubmitButton/FormSubmitButton.tsx';
import { Loader } from '../../../components/Loader/Loader';

/* utils and redux */
import { type AddressType } from '../../../redux/slices/addressSlice/addressSlice.ts';
import { CustomerType } from '../../../services/apiCustomer.ts';
import { useAddressMutation } from '../../../customHooks/mutationHooks/useAddressMutation.tsx';

interface AddressFormProps {
  title?: string;
}

export const AddressForm = ({ title }: AddressFormProps) => {
  const customer = useSelector(
    (state: { customer: { customerData: CustomerType } }) =>
      state.customer.customerData
  );

  const addressToEdit = useSelector(
    (state: { address: { addressToEdit: AddressType } }) =>
      state.address.addressToEdit
  );

  /* react-query mutation hook */
  const { isLoading, addAddress, editAddress } = useAddressMutation();

  const [phoneValidationError, setPhoneValidationError] = useState<string>('');

  const { handleSubmit, register, getValues, formState, control } =
    useForm<AddressType>({
      mode: 'onChange',
      defaultValues: addressToEdit ? addressToEdit : {},
    });

  const { errors } = formState;

  const onFormSubmit = (data: AddressType) => {
    if (phoneValidationError) {
      return;
    }

    if (data.id) {
      editAddress(data);
      return;
    }

    const addAddressObject = {
      newAddress: { ...data },
      customer: { ...customer },
    };
    addAddress(addAddressObject);
  };

  const getPhoneNumberValidationData = (
    phoneNumber: string,
    isValid: boolean
  ) => {
    {
      (!phoneNumber || !isValid) &&
        setPhoneValidationError('Phone number is required');
    }
    {
      phoneNumber &&
        !isValid &&
        setPhoneValidationError('Invalid phone number');
    }
    {
      phoneNumber && isValid && setPhoneValidationError('');
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <form className={styles.addressForm} onSubmit={handleSubmit(onFormSubmit)}>
      {/* Heading */}
      <h2>{title}</h2>

      <div className={styles.formContainer}>
        {/* LEFT SECTION*/}
        <div className={styles.nameGroup}>
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

          {/* Mobile phone */}
          <div className={styles.formGroup}>
            <label htmlFor='phoneNumber'>Mobile Phone</label>
            <Controller
              name='phoneNumber'
              control={control}
              rules={{
                required: 'Phone number is required',
              }}
              render={({ field }) => (
                <PhoneInputWithValidation
                  initialValue={getValues().phoneNumber}
                  sendDataToParent={(phoneNumber, isValid) => {
                    field.onChange(phoneNumber);
                    getPhoneNumberValidationData(phoneNumber, isValid);
                  }}
                />
              )}
            />

            {(errors.phoneNumber || phoneValidationError) && (
              <div className={styles.errorMessage}>
                {errors.phoneNumber?.message || phoneValidationError}
              </div>
            )}
          </div>

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
        </div>

        {/* RIGHT SECTION*/}
        <div className={styles.addressGroup}>
          {/* Address */}
          <FormInput
            label='Address'
            id='houseAddress'
            type='text'
            error={errors.houseAddress?.message as string}
            maxLength={71}
            {...register('houseAddress', {
              required: 'Address is required',
              maxLength: {
                value: 70,
                message: 'Maximum 70 characters allowed',
              },
            })}
          />

          {/* City and PinCode */}
          <div className={styles.cityPincodeGroup}>
            {/* City */}
            <FormInput
              type='text'
              label='City'
              id='city'
              error={errors.city?.message as string}
              maxLength={31}
              {...register('city', {
                required: 'City is required',

                maxLength: {
                  value: 30,
                  message: 'Maximum 30 characters allowed',
                },
              })}
            />

            {/* Pin Code */}
            <FormInput
              type='tel'
              label='Pin Code'
              id='pinCode'
              error={errors.pinCode?.message as string}
              maxLength={7}
              {...register('pinCode', {
                required: 'Pin code is required',
                maxLength: {
                  value: 6,
                  message: 'Maximum 6 characters allowed',
                },
              })}
            />
          </div>

          {/* Landmark */}
          <FormInput
            type='text'
            label='Landmark (Optional)'
            id='landmark'
            maxLength={51}
            error={errors.landmark?.message as string}
            {...register('landmark', {
              maxLength: {
                value: 50,
                message: 'Maximum 50 characters allowed',
              },
            })}
          />

          {/* Checkbox */}
          <div className={styles.formAddressDeclaration}>
            Set as delivery address
            <input type='checkbox' id='useForBilling' />
          </div>

          <div>
            <FormSubmitButton
              title={addressToEdit.id ? 'Save Address' : 'Submit'}
            />
          </div>
        </div>
      </div>
    </form>
  );
};
