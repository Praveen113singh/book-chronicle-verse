
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Book, Star, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-[calc(100vh-180px)] flex flex-col">
      {/* Hero Section */}
      <section className="py-12 md:py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Track your reading journey with BookBurst
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Organize your books, share your thoughts, and discover new titles to add to your collection.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {user ? (
              <Link to="/bookshelf">
                <Button size="lg" className="px-8">
                  Go to My Bookshelf
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button size="lg" className="px-8">
                    Get Started
                  </Button>
                </Link>
                <Link to="/explore">
                  <Button variant="outline" size="lg" className="px-8">
                    Explore Books
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 md:py-20 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Book className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-medium mb-2">Personal Bookshelf</h3>
              <p className="text-muted-foreground">
                Organize your books by reading status. Keep track of what you're reading, what you've finished, and what's next.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-medium mb-2">Share Reviews</h3>
              <p className="text-muted-foreground">
                Write reviews for your finished books and share your thoughts with the community. Rate books and recommend them to others.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-medium mb-2">Discover Books</h3>
              <p className="text-muted-foreground">
                Explore trending books, read reviews from other users, and find your next great read through our community recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 md:py-20 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold mb-4">Ready to start your reading journey?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join BookBurst today and start tracking your books, sharing reviews, and connecting with fellow readers.
          </p>
          {!user && (
            <Link to="/auth">
              <Button size="lg" className="px-8">
                Sign Up Now
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
