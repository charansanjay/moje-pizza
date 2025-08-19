import { AddressType } from '../Address';
import { CartType } from '../Cart';

export interface SigninFormType {
  emailAddress: string;
  password: string;
  rememberMe: boolean;
}

export interface SignupFormType {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
}

interface CustomerMetadataType {
  email: string;
  emailAddress: string;
  email_verified: boolean;
  firstName: string;
  lastName: string;
  phone_verified: boolean;
  role: string;
  sub: string;
}

export interface CustomerType {
  id?: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  role: string;
  uuid: string;
  metaData: CustomerMetadataType | undefined;
  addresses: AddressType[] | [];
  cart_id?: string | null;
  defaultBilling: string;
  defaultShipping: string;
  avatar: string;
  customerCart?: CartType;
}
