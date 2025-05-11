
import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { Book } from "lucide-react";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md mb-8 text-center">
        <div className="inline-flex items-center justify-center mb-4">
          <Book className="h-10 w-10 text-primary" />
          <h1 className="font-serif text-4xl font-bold ml-2">BookBurst</h1>
        </div>
        <p className="text-muted-foreground">
          Track your reading journey, share reviews, and discover new books
        </p>
      </div>
      
      {isLogin ? (
        <LoginForm onToggleForm={toggleForm} />
      ) : (
        <SignupForm onToggleForm={toggleForm} />
      )}
    </div>
  );
};

export default AuthPage;
