import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: ("admin" | "user")[];
}

export const RoleRoute = ({ allowedRoles, children }: any) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};
