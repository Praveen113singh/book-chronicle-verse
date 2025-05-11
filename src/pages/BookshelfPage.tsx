
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import BookStatusTabs from "@/components/books/BookStatusTabs";
import AddBookForm from "@/components/books/AddBookForm";
import AuthPage from "@/components/auth/AuthPage";

const BookshelfPage: React.FC = () => {
  const { user } = useAuth();
  
  // If user is not logged in, redirect to auth page
  if (!user) {
    return <AuthPage />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold">My Bookshelf</h1>
        <AddBookForm />
      </div>
      
      <BookStatusTabs />
    </div>
  );
};

export default BookshelfPage;
