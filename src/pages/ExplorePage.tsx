
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import ExploreTabs from "@/components/explore/ExploreTabs";
import AuthPage from "@/components/auth/AuthPage";

const ExplorePage: React.FC = () => {
  const { user } = useAuth();
  
  // Allow non-authenticated users to view the explore page
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-8">Explore Books</h1>
      <ExploreTabs />
    </div>
  );
};

export default ExplorePage;
