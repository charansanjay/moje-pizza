import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Loader } from '../components';
import { CustomerRoutes } from './CustomerRoutes';

// Non-lazy loaded components
import {
  ToastNotification,
  NetworkStatus,
  ScrollToTopButton,
  ScrollToTop,
} from '../components';
import { Home } from '../pages/Home/Home';
import { AppLayout } from '../layouts/AppLayout';

// Lazy-loaded components
const Menu = lazy(() =>
  import('../features/Menu/Menu').then((module) => ({
    default: module.Menu,
  }))
);
const Signin = lazy(() =>
  import('../features/Authorization').then((module) => ({
    default: module.Signin,
  }))
);
const Signup = lazy(() =>
  import('../features/Authorization').then((module) => ({
    default: module.Signup,
  }))
);
const NotFound = lazy(() =>
  import('../pages/NotFound/NotFound').then((module) => ({
    default: module.NotFound,
  }))
);

export const AppRoute = () => {
  return (
    <>
      <ToastNotification />
      <NetworkStatus />
      <ScrollToTopButton />
      <ScrollToTop />

      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path='/' element={<AppLayout />}>
            <Route index element={<Navigate replace to='home' />} />
            <Route path='home' element={<Home />} />
            <Route path='menu' element={<Menu />} />

            {/* Protected */}
            <Route path='customer/*' element={<CustomerRoutes />} />

            <Route path='signin' element={<Signin />} />
            <Route path='signup' element={<Signup />} />

            <Route path='*' element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};
