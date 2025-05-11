
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthPageComponent from "@/components/auth/AuthPage";

const AuthPage: React.FC = () => {
  const { user, isLoading } = useAuth();

  // If already authenticated, redirect to bookshelf
  if (user) {
    return <Navigate to="/bookshelf" />;
  }

  // While checking auth status, show nothing or a loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return <AuthPageComponent />;
};

export default AuthPage;
