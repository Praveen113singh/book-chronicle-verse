
import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { Book } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("login");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
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
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm onToggleForm={() => handleTabChange("signup")} />
        </TabsContent>
        <TabsContent value="signup">
          <SignupForm onToggleForm={() => handleTabChange("login")} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthPage;
