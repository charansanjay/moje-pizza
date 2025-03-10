import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

/* components */
import { Loader } from '../components/Loader/Loader.tsx';
import { CustomerLayout } from '../layouts/CustomerLayout.tsx';

import { ProtectedRoute } from './ProtectedRoute.tsx';

// Lazy-loaded components
const AddressBook = lazy(() =>
  import('../pages/Address/AddressBook/AddressBook.tsx').then((module) => ({
    default: module.AddressBook,
  }))
);
const AddAddress = lazy(() =>
  import('../pages/Address/AddAddress/AddAddress.tsx').then((module) => ({
    default: module.AddAddress,
  }))
);
const CartPage = lazy(() =>
  import('../pages/Cart/CartPage.tsx').then((module) => ({
    default: module.CartPage,
  }))
);
const Checkout = lazy(() =>
  import('../pages/Checkout/Checkout.tsx').then((module) => ({
    default: module.Checkout,
  }))
);
const PaymentSuccessPage = lazy(() =>
  import(
    '../pages/Checkout/Payment/PaymentSuccessPage/PaymentSuccessPage.tsx'
  ).then((module) => ({
    default: module.PaymentSuccessPage,
  }))
);
const OrdersList = lazy(() =>
  import('../pages/Orders/OrdersList/OrdersList.tsx').then((module) => ({
    default: module.OrdersList,
  }))
);
const OrderDetailsPage = lazy(() =>
  import('../pages/Orders/OrderDetails/OrderDetailsPage.tsx').then(
    (module) => ({
      default: module.OrderDetailsPage,
    })
  )
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
