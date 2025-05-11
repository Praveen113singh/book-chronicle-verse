
import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ProfileView from "@/components/profile/ProfileView";

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();

  if (!username) {
    return <Navigate to="/" />;
  }

  // For MVP, we only render the current user's profile
  // In a real app, we would fetch the profile data for the requested username
  return <ProfileView />;
};

export default ProfilePage;
