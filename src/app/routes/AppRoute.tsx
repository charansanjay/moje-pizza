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

// Lazy-loaded components
const Home = lazy(() =>
  import('../pages/Home/Home').then((module) => ({
    default: module.Home,
  }))
);
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
const AppLayout = lazy(() =>
  import('../layouts/AppLayout').then((module) => ({
    default: module.AppLayout,
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
