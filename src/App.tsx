
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { BookProvider } from "@/contexts/BookContext";

import Layout from "@/components/layout/Layout";
import Index from "@/pages/Index";
import AuthPage from "@/pages/AuthPage";
import BookshelfPage from "@/pages/BookshelfPage";
import BookDetailsPage from "@/pages/BookDetailsPage";
import ExplorePage from "@/pages/ExplorePage";
import TimelinePage from "@/pages/TimelinePage";
import ProfilePage from "@/pages/ProfilePage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <BookProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="auth" element={<AuthPage />} />
                <Route path="bookshelf" element={<BookshelfPage />} />
                <Route path="books/:bookId" element={<BookDetailsPage />} />
                <Route path="explore" element={<ExplorePage />} />
                <Route path="timeline" element={<TimelinePage />} />
                <Route path="profile/:username" element={<ProfilePage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </TooltipProvider>
        </BookProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
