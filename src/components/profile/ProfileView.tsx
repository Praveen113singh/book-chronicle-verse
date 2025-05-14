
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBooks } from "@/contexts/BookContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import BookGrid from "../books/BookGrid";
import ReviewList from "../reviews/ReviewList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, UserRoundCheck } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const ProfileView: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user, updateUsername } = useAuth();
  const { userBooks, reviews } = useBooks();
  
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(username || "");
  
  const isOwnProfile = user && user.username === username;
  
  // Get user's books
  const profileBooks = userBooks;
  
  // Get user's reviews
  const profileReviews = reviews.filter(review => review.username === username);
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleSave = () => {
    if (newUsername && newUsername !== username && newUsername.length >= 3) {
      updateUsername(newUsername);
      setIsEditing(false);
    } else if (newUsername.length < 3) {
      toast({
        title: "Invalid username",
        description: "Username must be at least 3 characters long",
        variant: "destructive"
      });
    } else {
      setIsEditing(false);
    }
  };
  
  const handleCancel = () => {
    setNewUsername(username || "");
    setIsEditing(false);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarFallback className="text-lg">
            {username?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          {isEditing && isOwnProfile ? (
            <div className="flex gap-2">
              <Input 
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="max-w-[200px]"
              />
              <Button size="sm" onClick={handleSave} className="flex items-center gap-1">
                <UserRoundCheck className="h-4 w-4" /> Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-3xl font-bold">{username}</h1>
              {isOwnProfile && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={handleEdit}
                  className="h-8 w-8 p-0"
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit username</span>
                </Button>
              )}
            </div>
          )}
          <p className="text-muted-foreground">
            {isOwnProfile ? "Your profile" : "Public profile"}
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="bookshelf" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="bookshelf">Bookshelf</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bookshelf">
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-xl font-medium mb-4">Currently Reading</h2>
              <BookGrid
                books={profileBooks.filter(book => book.status === "reading")}
                emptyMessage={`${isOwnProfile ? "You're" : "This user is"} not currently reading any books.`}
              />
            </div>
            
            <div>
              <h2 className="font-serif text-xl font-medium mb-4">Finished Books</h2>
              <BookGrid
                books={profileBooks.filter(book => book.status === "finished")}
                emptyMessage={`${isOwnProfile ? "You haven't" : "This user hasn't"} finished any books yet.`}
              />
            </div>
            
            <div>
              <h2 className="font-serif text-xl font-medium mb-4">Want to Read</h2>
              <BookGrid
                books={profileBooks.filter(book => book.status === "wanttoread")}
                emptyMessage={`${isOwnProfile ? "You don't" : "This user doesn't"} have any books in the want-to-read list.`}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reviews">
          <h2 className="font-serif text-xl font-medium mb-4">Reviews</h2>
          {profileReviews.length > 0 ? (
            <div className="space-y-8">
              {profileReviews.map(review => {
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
            <p className="text-muted-foreground">
              {isOwnProfile ? "You haven't" : "This user hasn't"} written any reviews yet.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileView;
