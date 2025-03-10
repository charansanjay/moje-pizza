import styles from './Checkout.module.css';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/* components */
import PaymentPage from './Payment/PaymentPage.tsx';
import { TaskBar } from '../../components/TaskBar/TaskBar.tsx';
import { AddressItem } from '../Address/AddressBook/AddressItem/AddressItem.tsx';
import { ContinueButton } from '../../components/Button/ContinueButton.tsx';
/* import { AddressBook } from '../Address/AddressBook/AddressBook.tsx'; */
import { EmptyPage } from '../../components/EmptyPage/EmptyPage.tsx';
import { useCustomerAddress } from '../../customHooks/useCustomerAddress.tsx';
import { Loader } from '../../components/Loader/Loader.tsx';
import { PageHeading } from '../../components/PageHeading/PageHeading.tsx';

/* redux slice / utils */
import { scrollToTop } from '../../utils/scrollToTop.ts';
import { setToast } from '../../redux/slices/settingsSlice/settingsSlice.ts';

/* icons */
import { IoArrowBack } from 'react-icons/io5';
import { FaAddressCard } from 'react-icons/fa6';

import { type CustomerType } from '../../services/apiCustomer.ts';
import { type AddressType } from '../../redux/slices/addressSlice/addressSlice.ts';
import { type AppDispatch } from '../../redux/store.ts';

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
