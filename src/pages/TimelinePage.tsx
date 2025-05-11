
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import ReadingTimeline from "@/components/timeline/ReadingTimeline";
import AuthPage from "@/components/auth/AuthPage";

const TimelinePage: React.FC = () => {
  const { user } = useAuth();
  
  // If user is not logged in, redirect to auth page
  if (!user) {
    return <AuthPage />;
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-8">Reading Timeline</h1>
      <ReadingTimeline />
    </div>
  );
};

export default TimelinePage;
