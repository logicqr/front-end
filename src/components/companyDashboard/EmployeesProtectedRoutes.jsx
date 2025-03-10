import React from 'react';
import { Navigate } from 'react-router-dom';

const EmployeesProtectedRoute = ({ children }) => {
  const accessToken = sessionStorage.getItem('accessToken');
  if (!accessToken) {
    
    return <Navigate to="/admin-login" />;
  }
  return children;
};

export default EmployeesProtectedRoute;