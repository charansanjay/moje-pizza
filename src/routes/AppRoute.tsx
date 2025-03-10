import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

/* components */
import { Loader } from '../components/Loader/Loader.tsx';
import { CustomerRoutes } from './CustomerRoutes.tsx';

// Non-lazy loaded components
import { ToastNotification } from '../components/ToastNotification/ToastNotification.tsx';
import { NetworkStatus } from '../components/NetworkStatus/NetworkStatus.tsx';
import { ScrollToTopButton } from '../components/ScrollToTop/ScrollToTopButton.tsx';
import { ScrollToTop } from '../components/ScrollToTop/ScrollToTop.tsx';

// Lazy-loaded components
const Home = lazy(() =>
  import('../pages/Home/Home.tsx').then((module) => ({
    default: module.Home,
  }))
);
const Menu = lazy(() =>
  import('../pages/Menu/Menu.tsx').then((module) => ({
    default: module.Menu,
  }))
);
const Signin = lazy(() =>
  import('../pages/Authorization/Signin/Signin.tsx').then((module) => ({
    default: module.Signin,
  }))
);
const Signup = lazy(() =>
  import('../pages/Authorization/Signup/Signup.tsx').then((module) => ({
    default: module.Signup,
  }))
);
const AppLayout = lazy(() =>
  import('../layouts/AppLayout.tsx').then((module) => ({
    default: module.AppLayout,
  }))
);
const NotFound = lazy(() =>
  import('../pages/NotFound/NotFound.tsx').then((module) => ({
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
