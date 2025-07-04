import React, { createContext, useState, useEffect, useContext } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  updateUsername: (newUsername: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database for demo purposes
const MOCK_USERS = [
  {
    id: "1",
    email: "demo@bookburst.com",
    username: "bookworm",
    password: "password123",
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved auth in localStorage
    const savedUser = localStorage.getItem("bookburst_user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("bookburst_user");
      }
    }
    setIsLoading(false);
  }, []);

  const updateUsername = (newUsername: string) => {
    if (!user) return;
    
    try {
      // In a real app, this would make an API call to update the username
      // For our mock implementation, we'll update the MOCK_USERS array
      const userIndex = MOCK_USERS.findIndex(u => u.id === user.id);
      
      if (userIndex >= 0) {
        // Check if username is already taken
        const usernameExists = MOCK_USERS.some(
          u => u.username.toLowerCase() === newUsername.toLowerCase() && u.id !== user.id
        );
        
        if (usernameExists) {
          toast.error("Username already taken");
          return;
        }
        
        // Update the mock database
        MOCK_USERS[userIndex].username = newUsername;
        
        // Update the current user state
        const updatedUser = { ...user, username: newUsername };
        setUser(updatedUser);
        
        // Update localStorage
        localStorage.setItem("bookburst_user", JSON.stringify(updatedUser));
        
        // Show success message
        toast.success("Username updated successfully");
        
        // Navigate to the new profile URL
        navigate(`/profile/${newUsername}`);
      }
    } catch (error) {
      console.error("Failed to update username:", error);
      toast.error("Failed to update username");
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // For debugging
      console.log("Attempting login with:", { email, password });
      console.log("Available users:", MOCK_USERS);
      
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Find user by email and password - case insensitive email comparison
      const foundUser = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (!foundUser) {
        console.log("No matching user found");
        throw new Error("Invalid email or password");
      }
      
      // Create sanitized user object (without password)
      const authenticatedUser = {
        id: foundUser.id,
        email: foundUser.email,
        username: foundUser.username,
      };
      
      setUser(authenticatedUser);
      localStorage.setItem("bookburst_user", JSON.stringify(authenticatedUser));
      toast.success(`Welcome back, ${authenticatedUser.username}!`);
    } catch (error) {
      console.error("Login error:", error);
      toast.error(`Login failed: ${(error as Error).message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Check if user exists - case insensitive email comparison
      if (MOCK_USERS.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("User with this email already exists");
      }
      
      if (MOCK_USERS.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
        throw new Error("Username already taken");
      }
      
      // Create new user (in a real app, this would be an API call)
      const newUser = {
        id: `${MOCK_USERS.length + 1}`,
        email,
        password,
        username,
      };
      
      // In a real app, we would save this to a database
      MOCK_USERS.push(newUser);
      
      // For signup, we don't automatically log in - just return success
      toast.success("Account created successfully!");
      return;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(`Signup failed: ${(error as Error).message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("bookburst_user");
    toast.info("Logged out successfully");
    // Navigate to the home page after logout
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUsername }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
