
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import BookDetails from "@/components/books/BookDetails";
import AuthPage from "@/components/auth/AuthPage";

const BookDetailsPage: React.FC = () => {
  const { user } = useAuth();
  
  // If user is not logged in, redirect to auth page
  if (!user) {
    return <AuthPage />;
  }

  return <BookDetails />;
};

export default BookDetailsPage;
