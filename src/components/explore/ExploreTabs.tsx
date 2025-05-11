
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBooks, Book } from "@/contexts/BookContext";
import BookGrid from "../books/BookGrid";
import ReviewList from "../reviews/ReviewList";

const ExploreTabs: React.FC = () => {
  const { userBooks, reviews } = useBooks();
  const [activeTab, setActiveTab] = useState<string>("trending");
  
  // Load saved tab preference from cookie
  useEffect(() => {
    const savedTab = document.cookie
      .split("; ")
      .find(row => row.startsWith("explore_tab="))
      ?.split("=")[1];
    
    if (savedTab && ["trending", "reviews", "top-rated"].includes(savedTab)) {
      setActiveTab(savedTab);
    }
  }, []);
  
  // Save tab preference to cookie when changed
  useEffect(() => {
    document.cookie = `explore_tab=${activeTab}; max-age=31536000; path=/`;
  }, [activeTab]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Get trending books (most recently added)
  const trendingBooks = [...userBooks]
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
    .slice(0, 10);
  
  // Get top rated books
  const topRatedBooks = [...userBooks]
    .filter(book => typeof book.rating === 'number' && book.rating > 0)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 10);
  
  // Get latest reviews
  const latestReviews = [...reviews]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="mb-6 w-full max-w-md mx-auto grid grid-cols-3">
        <TabsTrigger value="trending">Trending</TabsTrigger>
        <TabsTrigger value="reviews">Latest Reviews</TabsTrigger>
        <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
      </TabsList>
      
      <TabsContent value="trending" className="space-y-6">
        <h2 className="font-serif text-2xl font-medium">Trending Books</h2>
        <BookGrid 
          books={trendingBooks} 
          emptyMessage="No trending books available yet."
        />
      </TabsContent>
      
      <TabsContent value="reviews" className="space-y-6">
        <h2 className="font-serif text-2xl font-medium">Latest Reviews</h2>
        {latestReviews.length > 0 ? (
          <div className="space-y-8">
            {latestReviews.map(review => {
              const book = userBooks.find(b => b.id === review.bookId);
              if (!book) return null;
              
              return (
                <div key={review.id} className="flex flex-col md:flex-row gap-4">
                  <div className="md:w-1/6">
                    <div className="aspect-[2/3] w-32 mx-auto md:mx-0">
                      <img 
                        src={book.cover || "/placeholder.svg"} 
                        alt={book.title}
                        className="w-full h-full object-cover rounded"
                        onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                      />
                    </div>
                  </div>
                  <div className="md:w-5/6">
                    <h3 className="font-serif text-xl font-medium mb-1">{book.title}</h3>
                    <p className="text-muted-foreground mb-4">by {book.author}</p>
                    <ReviewList reviews={[review]} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground">No reviews available yet.</p>
        )}
      </TabsContent>
      
      <TabsContent value="top-rated" className="space-y-6">
        <h2 className="font-serif text-2xl font-medium">Top Rated Books</h2>
        <BookGrid 
          books={topRatedBooks} 
          emptyMessage="No rated books available yet."
        />
      </TabsContent>
    </Tabs>
  );
};

export default ExploreTabs;
