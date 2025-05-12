
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface LoginFormProps {
  onToggleForm: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    
    try {
      await login(email, password);
      // Success is handled in the auth context with redirect
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage((error as Error).message || "Login failed. Please check your credentials.");
      toast.error("Login failed. Please check your credentials.");
      setIsSubmitting(false);
    }
  };

  // Helper function to fill in demo credentials
  const fillDemoCredentials = () => {
    setEmail("demo@bookburst.com");
    setPassword("password123");
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>
          Enter your credentials to access your bookshelf
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="text-sm text-right">
            <a href="#" className="text-primary hover:underline">
              Forgot password?
            </a>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onToggleForm}
              className="text-primary hover:underline"
            >
              Sign up
            </button>
          </p>
          <div className="text-xs text-center text-muted-foreground mt-4">
            <p>Demo credentials:</p>
            <button 
              type="button" 
              onClick={fillDemoCredentials}
              className="text-primary hover:underline"
            >
              Click to fill in demo account
            </button>
            <p>Email: demo@bookburst.com</p>
            <p>Password: password123</p>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
