// components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem("token"); // Update logic as needed

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
