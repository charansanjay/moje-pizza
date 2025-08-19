import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { type NavigateFunction, useNavigate } from 'react-router-dom';

/* Custom Hooks */
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate: NavigateFunction = useNavigate();

  // custom hooks
  const isAuthenticated = useSelector(
    (state: { auth: { isAuthenticated: boolean } }) =>
      state.auth.isAuthenticated
  );

  useEffect(
    function () {
      if (!isAuthenticated) navigate('/');
    },
    [isAuthenticated, navigate]
  );

  return isAuthenticated ? children : null;
};
