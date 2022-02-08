import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from '../layout/Spinner';

const PrivateRoute = ({ component: Component }) => {
  const auth = useSelector((state) => state.auth);
  const { isAuthenticated, loading } = auth;
  if (loading) return <Spinner />;
  if (isAuthenticated) return <Component />;

  return <Navigate to='/login' />;
};

export default PrivateRoute;
