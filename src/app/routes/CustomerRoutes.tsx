import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Loader } from '../components';
import { CustomerLayout } from '../layouts/CustomerLayout.tsx';

import { ProtectedRoute } from './ProtectedRoute.tsx';

// Lazy-loaded components
const AddressBook = lazy(() =>
  import('../features/Address').then((module) => ({
    default: module.AddressBook,
  }))
);
const AddAddress = lazy(() =>
  import('../features/Address').then((module) => ({
    default: module.AddAddress,
  }))
);
const CartPage = lazy(() =>
  import('../features/Cart').then((module) => ({
    default: module.CartPage,
  }))
);
const Checkout = lazy(() =>
  import('../features/Checkout').then((module) => ({
    default: module.Checkout,
  }))
);
const PaymentSuccessPage = lazy(() =>
  import('../features/Checkout').then((module) => ({
    default: module.PaymentSuccessPage,
  }))
);
const OrdersList = lazy(() =>
  import('../features/Orders').then((module) => ({
    default: module.OrdersList,
  }))
);
const OrderDetailsPage = lazy(() =>
  import('../features/Orders').then((module) => ({
    default: module.OrderDetailsPage,
  }))
);

export const CustomerRoutes = () => {
  return (
    <Routes>
      <Route
        path='/*'
        element={
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <CustomerLayout />
            </Suspense>
          </ProtectedRoute>
        }
      >
        <Route path='address-book' element={<AddressBook />} />
        <Route path='address-new' element={<AddAddress />} />

        <Route path='cart' element={<CartPage />} />

        <Route path='checkout' element={<Checkout />} />
        <Route path='payment-success' element={<PaymentSuccessPage />} />

        <Route path='orders' element={<OrdersList />} />
        <Route path='order-details' element={<OrderDetailsPage />} />
      </Route>
    </Routes>
  );
};
