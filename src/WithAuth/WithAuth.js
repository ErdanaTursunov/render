import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const withAuth = (WrappedComponent, allowedRoles = []) => {
  return (props) => {
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      // Если токен отсутствует или роль не подходит
      if (!token || !allowedRoles.includes(role)) {
        navigate("/login");
      }
    }, [allowedRoles, navigate]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
