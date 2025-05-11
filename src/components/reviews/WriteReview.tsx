
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useBooks } from "@/contexts/BookContext";
import { Star } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface WriteReviewProps {
  bookId: string;
}

const WriteReview: React.FC<WriteReviewProps> = ({ bookId }) => {
  const { user } = useAuth();
  const { addReview, loading } = useBooks();
  
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [wouldRecommend, setWouldRecommend] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !bookId || rating === 0 || !content.trim()) return;
    
    try {
      await addReview({
        bookId,
        userId: user.id,
        username: user.username,
        rating,
        content,
        wouldRecommend
      });
      
      // Reset form
      setContent("");
      setRating(0);
      setWouldRecommend(false);
    } catch (error) {
      console.error("Failed to post review:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-medium mb-2">Write Your Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="text-yellow-500"
            >
              <Star
                className={`w-6 h-6 ${
                  star <= (hoveredRating || rating) ? "fill-current" : ""
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {rating > 0 ? `${rating} stars` : "Select rating"}
          </span>
        </div>
        
        <Textarea
          placeholder="Share your thoughts about this book..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="mb-4 resize-none"
          required
        />
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="recommend"
              checked={wouldRecommend}
              onCheckedChange={setWouldRecommend}
            />
            <Label htmlFor="recommend">I would recommend this book</Label>
          </div>
          
          <Button
            type="submit"
            disabled={loading || rating === 0 || !content.trim()}
          >
            {loading ? "Posting..." : "Post Review"}
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Note: Reviews cannot be edited or deleted after posting.
        </p>
      </form>
    </div>
  );
};

export default WriteReview;
