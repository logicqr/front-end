import React from 'react';
import { Navigate } from 'react-router-dom';

const UserProtectedRoutes = ({ children }) => {
  const accessToken = sessionStorage.getItem('accessToken');
  if (!accessToken) {
    
    return <Navigate to="/login" />;
  }
  return children;
};

export default UserProtectedRoutes;