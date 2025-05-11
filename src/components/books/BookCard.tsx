
import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Book, BookStatus } from "@/contexts/BookContext";
import { Badge } from "@/components/ui/badge";

interface BookCardProps {
  book: Book;
  showStatus?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ book, showStatus = true }) => {
  const getStatusBadgeClass = (status: BookStatus | undefined) => {
    switch (status) {
      case "reading":
        return "status-reading";
      case "finished":
        return "status-finished";
      case "wanttoread":
        return "status-wanttoread";
      default:
        return "";
    }
  };

  const getStatusText = (status: BookStatus | undefined) => {
    switch (status) {
      case "reading":
        return "Reading";
      case "finished":
        return "Finished";
      case "wanttoread":
        return "Want to Read";
      default:
        return "";
    }
  };

  return (
    <Link to={`/books/${book.id}`} className="book-card block">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={book.cover || "/placeholder.svg"} 
          alt={book.title}
          className="w-full h-full object-cover" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
        {showStatus && book.status && (
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
            <span className={`status-badge ${getStatusBadgeClass(book.status)}`}>
              {getStatusText(book.status)}
            </span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium truncate">{book.title}</h3>
        <p className="text-sm text-muted-foreground truncate">{book.author}</p>
        {typeof book.rating === 'number' && book.rating > 0 && (
          <div className="flex items-center mt-2 text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1 text-xs">{book.rating}/5</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default BookCard;
