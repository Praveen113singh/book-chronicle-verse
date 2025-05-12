
import React, { createContext, useState, useEffect, useContext } from "react";
import { toast } from "sonner";

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

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Find user by email
      const foundUser = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );
      
      if (!foundUser) {
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
      
      // Check if user exists
      if (MOCK_USERS.some((u) => u.email === email)) {
        throw new Error("User with this email already exists");
      }
      
      if (MOCK_USERS.some((u) => u.username === username)) {
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
    // In a production app, we'd also invalidate tokens, etc.
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
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
