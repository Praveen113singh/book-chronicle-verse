
import React from "react";
import { Review } from "@/contexts/BookContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>
                  {review.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{review.username}</h4>
                <p className="text-xs text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < review.rating ? "fill-current" : ""}`}
                  />
                ))}
              </div>
              {review.wouldRecommend && (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                  Recommended
                </Badge>
              )}
            </div>
          </div>
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground whitespace-pre-line">{review.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
