import supabase from '../utils/supabase.ts';

import { CartType, createCart } from './apiCart.ts';
import { SignupFormType } from '../pages/Authorization/Signup/SignupForm/SignupForm.tsx';
import {
  addCustomerCartId,
  createCustomer,
  fetchCustomerByEmail,
  type CustomerType,
} from './apiCustomer.ts';
import { SigninFormType } from '../pages/Authorization/Signin/SigninForm/SigninForm.tsx';

export const signinCustomer = async (signinFormData: SigninFormType) => {
  const { error } = await supabase.auth.signInWithPassword({
    email: signinFormData.emailAddress,
    password: signinFormData.password,
  });

  if (error) {
    throw Error(error.message);
  }

  // Fetch customer
  const customerData = await fetchCustomerByEmail(signinFormData.emailAddress);

  return customerData;
};

export const signupCustomer = async (signupData: SignupFormType) => {
  const { emailAddress, password, firstName, lastName } = signupData;

  const { data, error } = await supabase.auth.signUp({
    email: emailAddress,
    password: password,
    options: {
      data: {
        role: 'customer',
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
      },
    },
  });

  if (error) {
    throw Error(error.message);
  }

  // CreateCustomer and add cart_id to customer
  const newCustomer: CustomerType = {
    emailAddress: data.user?.user_metadata?.email,
    uuid: data.user!.id,
    firstName: data.user?.user_metadata?.firstName,
    lastName: data.user?.user_metadata?.lastName,
    role: data.user?.user_metadata?.role,
    metaData: {
      email: data.user?.user_metadata?.email,
      emailAddress: data.user?.user_metadata?.email,
      email_verified: data.user?.user_metadata?.email_verified,
      firstName: data.user?.user_metadata?.firstName,
      lastName: data.user?.user_metadata?.lastName,
      role: data.user?.user_metadata?.role,
      phone_verified: data.user?.user_metadata?.phone_verified,
      sub: data.user?.user_metadata?.sub,
    },
    addresses: [],
    defaultBilling: '',
    defaultShipping: '',
    avatar: '',
  };

  const createCustomerResponse = await createCustomer(newCustomer);

  const newCart: CartType = {
    customer_id: createCustomerResponse[0].id,
    items: [],
    cartSummary: {
      subtotal: 0,
      deliveryCost: 0,
      vat: 0,
      discountAmount: 0,
      grandTotal: 0,
      vatRatePercentage: 0,
      discountPercentage: 0,
    },
    itemsQuantity: 0,
    itemsCount: 0,
    isActive: true,
  };

  const createCartResponse = await createCart(newCart);

  const updatedCustomer = await addCustomerCartId(
    createCustomerResponse[0].id,
    createCartResponse[0].id
  );

  return {
    customerData: updatedCustomer[0],
    customerCart: createCartResponse[0],
  };
};
