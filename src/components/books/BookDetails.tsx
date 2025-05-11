
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBooks, BookStatus } from "@/contexts/BookContext";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import ReviewList from "../reviews/ReviewList";
import WriteReview from "../reviews/WriteReview";
import { useAuth } from "@/contexts/AuthContext";

const BookDetails: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    getBookById, 
    updateBookStatus, 
    updateBookRating,
    getReviewsForBook,
    loading 
  } = useBooks();
  
  const [activeTab, setActiveTab] = useState("details");
  const book = bookId ? getBookById(bookId) : undefined;
  const reviews = bookId ? getReviewsForBook(bookId) : [];
  
  // Check if the current user has already reviewed this book
  const hasUserReviewed = user && reviews.some(review => review.userId === user.id);
  
  const handleStatusChange = async (value: string) => {
    if (!book) return;
    try {
      await updateBookStatus(book.id, value as BookStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleRatingChange = async (value: string) => {
    if (!book) return;
    try {
      await updateBookRating(book.id, parseInt(value, 10));
    } catch (error) {
      console.error("Failed to update rating:", error);
    }
  };

  if (!bookId) {
    navigate("/bookshelf");
    return null;
  }

  if (!book) {
    return (
      <div className="py-10 text-center">
        <h2 className="text-2xl font-serif mb-4">Book not found</h2>
        <Button onClick={() => navigate("/bookshelf")}>
          Return to Bookshelf
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          {book.cover ? (
            <img 
              src={book.cover} 
              alt={book.title} 
              className="w-full aspect-[2/3] object-cover rounded-md shadow-md"
              onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
            />
          ) : (
            <div className="w-full aspect-[2/3] bg-muted rounded-md flex items-center justify-center">
              No Cover Available
            </div>
          )}

          {user && (
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Reading Status</label>
                <Select
                  value={book.status}
                  onValueChange={handleStatusChange}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Set status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wanttoread">Want to Read</SelectItem>
                    <SelectItem value="reading">Currently Reading</SelectItem>
                    <SelectItem value="finished">Finished</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Rating</label>
                <Select
                  value={book.rating?.toString() || "0"}
                  onValueChange={handleRatingChange}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Rate this book" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No Rating</SelectItem>
                    <SelectItem value="1">★</SelectItem>
                    <SelectItem value="2">★★</SelectItem>
                    <SelectItem value="3">★★★</SelectItem>
                    <SelectItem value="4">★★★★</SelectItem>
                    <SelectItem value="5">★★★★★</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {book.notes && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Notes</label>
                  <Textarea 
                    value={book.notes} 
                    readOnly 
                    className="resize-none bg-muted"
                  />
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="md:w-2/3">
          <h1 className="font-serif text-3xl font-bold">{book.title}</h1>
          <p className="text-xl text-muted-foreground mt-1">by {book.author}</p>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {book.genres?.map((genre, index) => (
              <Badge key={index} variant="secondary">{genre}</Badge>
            ))}
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-4 space-y-4">
              {book.description ? (
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">{book.description}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">No description available.</p>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                {book.isbn && (
                  <div>
                    <h3 className="font-medium mb-1">ISBN</h3>
                    <p className="text-sm text-muted-foreground">{book.isbn}</p>
                  </div>
                )}
                
                {book.publishedDate && (
                  <div>
                    <h3 className="font-medium mb-1">Published</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(book.publishedDate).getFullYear()}
                    </p>
                  </div>
                )}
                
                {book.pageCount && (
                  <div>
                    <h3 className="font-medium mb-1">Pages</h3>
                    <p className="text-sm text-muted-foreground">{book.pageCount}</p>
                  </div>
                )}
                
                {book.addedAt && (
                  <div>
                    <h3 className="font-medium mb-1">Added to Bookshelf</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(book.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
                
                {book.finishedAt && (
                  <div>
                    <h3 className="font-medium mb-1">Finished Reading</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(book.finishedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-4 space-y-6">
              {user && !hasUserReviewed && book.status === "finished" && (
                <WriteReview bookId={book.id} />
              )}
              
              {reviews.length > 0 ? (
                <ReviewList reviews={reviews} />
              ) : (
                <p className="text-muted-foreground py-4">No reviews yet. Be the first to review this book!</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
