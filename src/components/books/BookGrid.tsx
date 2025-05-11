
import React from "react";
import BookCard from "./BookCard";
import { Book } from "@/contexts/BookContext";

interface BookGridProps {
  books: Book[];
  emptyMessage?: string;
}

const BookGrid: React.FC<BookGridProps> = ({ books, emptyMessage = "No books found" }) => {
  if (books.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
};

export default BookGrid;
