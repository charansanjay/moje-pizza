import styles from './Checkout.module.css';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import PaymentPage from './Payment/PaymentPage';
import {
  TaskBar,
  ContinueButton,
  EmptyPage,
  Loader,
  PageHeading,
} from '../../components';
/* import { AddressBook } from '../Address/AddressBook/AddressBook.tsx'; */

import { type AddressType, AddressItem, useCustomerAddress } from '../Address';

import { setToast } from '../../store/slices/settingsSlice/settingsSlice';
import { scrollToTop } from '../../utils/scrollToTop';

import { IoArrowBack } from 'react-icons/io5';
import { FaAddressCard } from 'react-icons/fa6';

import { type AppDispatch } from '../../store/store';
import { type CustomerType } from '../Authorization';

export const Checkout = () => {
  const dispatch = useDispatch<AppDispatch>();

  const customer = useSelector(
    (state: { customer: { customerData: CustomerType } }) =>
      state.customer.customerData
  );

  // fetch address from server
  const { customerAddresses = [], isAddressLoading } = useCustomerAddress({
    customerId: customer.id ?? '',
  });

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Handle step completion
  const handleNextStep = () => {
    const hasDefaultAddress = customerAddresses.some(
      (address: AddressType) => address.deliveryAddress
    );

    if (!hasDefaultAddress) {
      dispatch(
        setToast({
          type: 'error',
          message: 'Please select delivery address to proceed',
          disableAutoClose: true,
        })
      );
      return;
    }

    setCompletedSteps((prev) => [...prev, currentStep]);
    setCurrentStep((prev) => prev + 1);
    scrollToTop();
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1);
    setCompletedSteps((prev) => {
      const index = prev.indexOf(currentStep - 1);
      return [...prev.slice(0, index)];
    });
    scrollToTop();
  };

  if (isAddressLoading) {
    return <Loader />;
  }

  return (
    <div className={styles.checkoutPage}>
      {currentStep === 1 && <PageHeading title='Checkout' />}
      {currentStep === 2 && (
        <div className={styles.title}>
          <IoArrowBack
            onClick={handlePreviousStep}
            className={styles.backIcon}
            data-testid='back_arrow_icon'
          />
          <h1>Checkout</h1>
        </div>
      )}

      <TaskBar currentStep={currentStep} completedSteps={completedSteps} />

      {currentStep === 1 && (
        <>
          {customerAddresses.length === 0 && (
            <div className={styles.addressContainer}>
              <EmptyPage
                message='No Saved Address !!'
                buttonText='Add Address'
                path='/customer/address-new'
                icon={<FaAddressCard className={styles.cartIcon} />}
              />
            </div>
          )}

          {customerAddresses.length > 0 && (
            <div className={styles.addressContainer}>
              {/* <AddressBook showHeading={false} /> */}
              <ul className={styles.addressList}>
                {customerAddresses.map((address: AddressType) => (
                  <AddressItem
                    key={address.id}
                    address={address}
                    showButtons={true}
                  />
                ))}
              </ul>
              <div>
                <ContinueButton
                  text='Continue'
                  type='primary'
                  float='right'
                  showIcon
                  onClick={() => handleNextStep()}
                />
              </div>
            </div>
          )}
        </>
      )}

      {currentStep === 2 && <PaymentPage />}
    </div>
  );
};
