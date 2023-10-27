/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import React from "react"; // Import React (if not already imported)

const ProtectedRoute = () => {
  const { loading, isAuthenticated } = useSelector((state) => state.user);

  if (loading === false) {
    if (!isAuthenticated) {
      return <Navigate to="/login"/>;
    } 
  }
};

export default ProtectedRoute;
