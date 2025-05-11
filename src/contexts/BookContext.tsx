
import React, { createContext, useState, useEffect, useContext } from "react";
import { toast } from "sonner";

// Types
export type BookStatus = "reading" | "finished" | "wanttoread";

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  publishedDate?: string;
  isbn?: string;
  genres: string[];
  pageCount?: number;
  status?: BookStatus;
  rating?: number;
  addedAt: string;
  finishedAt?: string;
  notes?: string;
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  username: string;
  rating: number;
  content: string;
  wouldRecommend: boolean;
  createdAt: string;
}

interface BookContextType {
  books: Book[];
  reviews: Review[];
  userBooks: Book[];
  loading: boolean;
  addBook: (book: Omit<Book, "id" | "addedAt">) => Promise<Book>;
  updateBookStatus: (bookId: string, status: BookStatus) => Promise<void>;
  updateBookRating: (bookId: string, rating: number) => Promise<void>;
  getBookById: (bookId: string) => Book | undefined;
  getBooksByStatus: (status: BookStatus) => Book[];
  getUserBooks: (userId: string) => Book[];
  getReviewsForBook: (bookId: string) => Review[];
  addReview: (review: Omit<Review, "id" | "createdAt">) => Promise<Review>;
}

// Mock data
const mockBooks: Book[] = [
  {
    id: "1",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    cover: "https://m.media-amazon.com/images/I/81aY1lxk+9L._SL1500_.jpg",
    description: "A novel by Harper Lee published in 1960. It was immediately successful, winning the Pulitzer Prize, and has become a classic of modern American literature.",
    publishedDate: "1960-07-11",
    isbn: "9780446310789",
    genres: ["Fiction", "Classic", "Historical"],
    pageCount: 336,
    status: "reading",
    rating: 0,
    addedAt: "2023-05-15T14:22:10Z",
    notes: "Started reading for book club"
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    cover: "https://m.media-amazon.com/images/I/71kxa1-0mfL._SL1500_.jpg",
    description: "The book is set in 1984 in Oceania, one of three perpetually warring totalitarian states. Winston Smith is a low-ranking member of the ruling Party in London, in the nation of Oceania.",
    publishedDate: "1949-06-08",
    isbn: "9780451524935",
    genres: ["Fiction", "Dystopian", "Classic"],
    pageCount: 328,
    status: "finished",
    rating: 5,
    addedAt: "2023-02-10T08:15:32Z",
    finishedAt: "2023-03-15T21:45:12Z"
  },
  {
    id: "3",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover: "https://m.media-amazon.com/images/I/71FTb9X6wsL._SL1500_.jpg",
    description: "The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby.",
    publishedDate: "1925-04-10",
    isbn: "9780743273565",
    genres: ["Fiction", "Classic"],
    pageCount: 180,
    status: "wanttoread",
    addedAt: "2023-04-22T16:08:45Z"
  },
  {
    id: "4",
    title: "Brave New World",
    author: "Aldous Huxley",
    cover: "https://m.media-amazon.com/images/I/81zE42gT3xL._SL1500_.jpg",
    description: "Brave New World is a dystopian novel by English author Aldous Huxley, written in 1931 and published in 1932.",
    publishedDate: "1932-01-01",
    isbn: "9780060850524",
    genres: ["Fiction", "Science Fiction", "Dystopian"],
    pageCount: 288,
    status: "finished",
    rating: 4,
    addedAt: "2022-11-05T10:32:18Z",
    finishedAt: "2022-12-20T22:15:42Z"
  },
  {
    id: "5",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    cover: "https://m.media-amazon.com/images/I/71Q1tPupKjL._SL1360_.jpg",
    description: "Pride and Prejudice is an 1813 romantic novel of manners written by Jane Austen.",
    publishedDate: "1813-01-28",
    isbn: "9780141439518",
    genres: ["Fiction", "Classic", "Romance"],
    pageCount: 432,
    status: "wanttoread",
    addedAt: "2023-06-02T09:12:35Z"
  }
];

const mockReviews: Review[] = [
  {
    id: "1",
    bookId: "2",
    userId: "1",
    username: "bookworm",
    rating: 5,
    content: "One of the most prophetic and insightful books about society I've ever read. Orwell's vision of a totalitarian future is still relevant today.",
    wouldRecommend: true,
    createdAt: "2023-03-15T22:10:05Z"
  },
  {
    id: "2",
    bookId: "4",
    userId: "1",
    username: "bookworm",
    rating: 4,
    content: "A fascinating dystopian vision that explores themes of technology, social engineering, and the cost of perceived utopia. The comparison with Orwell's 1984 is inevitable, but Huxley's vision is unique in that it shows how people can be controlled through pleasure rather than pain.",
    wouldRecommend: true,
    createdAt: "2022-12-21T08:45:22Z"
  }
];

// Create the context
const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [userBooks, setUserBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  const userId = "1"; // For demo, we'll use the mock user ID

  useEffect(() => {
    // Initialize userBooks with books from local storage or mock data
    const savedBooks = localStorage.getItem("bookburst_userBooks");
    if (savedBooks) {
      try {
        setUserBooks(JSON.parse(savedBooks));
      } catch (error) {
        console.error("Failed to parse saved books:", error);
        localStorage.removeItem("bookburst_userBooks");
        setUserBooks(mockBooks);
      }
    } else {
      setUserBooks(mockBooks);
    }

    // Initialize reviews
    const savedReviews = localStorage.getItem("bookburst_reviews");
    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews));
      } catch (error) {
        console.error("Failed to parse saved reviews:", error);
        localStorage.removeItem("bookburst_reviews");
        setReviews(mockReviews);
      }
    }
  }, []);

  // Save userBooks to localStorage whenever it changes
  useEffect(() => {
    if (userBooks.length > 0) {
      localStorage.setItem("bookburst_userBooks", JSON.stringify(userBooks));
    }
  }, [userBooks]);

  // Save reviews to localStorage whenever it changes
  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem("bookburst_reviews", JSON.stringify(reviews));
    }
  }, [reviews]);

  const addBook = async (bookData: Omit<Book, "id" | "addedAt">): Promise<Book> => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newBook: Book = {
        ...bookData,
        id: Date.now().toString(),
        addedAt: new Date().toISOString(),
      };
      
      setUserBooks(prevBooks => [...prevBooks, newBook]);
      toast.success(`'${newBook.title}' added to your bookshelf!`);
      return newBook;
    } catch (error) {
      console.error("Failed to add book:", error);
      toast.error("Failed to add book. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateBookStatus = async (bookId: string, status: BookStatus): Promise<void> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setUserBooks(prevBooks => 
        prevBooks.map(book => 
          book.id === bookId 
            ? { 
                ...book, 
                status, 
                finishedAt: status === "finished" ? new Date().toISOString() : book.finishedAt 
              } 
            : book
        )
      );
      
      toast.success(`Book status updated to ${status}!`);
    } catch (error) {
      console.error("Failed to update book status:", error);
      toast.error("Failed to update book status. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateBookRating = async (bookId: string, rating: number): Promise<void> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setUserBooks(prevBooks => 
        prevBooks.map(book => 
          book.id === bookId ? { ...book, rating } : book
        )
      );
      
      toast.success(`Book rating updated!`);
    } catch (error) {
      console.error("Failed to update book rating:", error);
      toast.error("Failed to update book rating. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getBookById = (bookId: string): Book | undefined => {
    return userBooks.find(book => book.id === bookId);
  };

  const getBooksByStatus = (status: BookStatus): Book[] => {
    return userBooks.filter(book => book.status === status);
  };

  const getUserBooks = (userId: string): Book[] => {
    // In a real app, this would filter books by the userId
    // For this demo, we're just returning all userBooks
    return userBooks;
  };

  const getReviewsForBook = (bookId: string): Review[] => {
    return reviews.filter(review => review.bookId === bookId);
  };

  const addReview = async (reviewData: Omit<Review, "id" | "createdAt">): Promise<Review> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newReview: Review = {
        ...reviewData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      
      setReviews(prevReviews => [...prevReviews, newReview]);
      toast.success("Review posted successfully!");
      return newReview;
    } catch (error) {
      console.error("Failed to add review:", error);
      toast.error("Failed to post review. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <BookContext.Provider
      value={{
        books,
        reviews,
        userBooks,
        loading,
        addBook,
        updateBookStatus,
        updateBookRating,
        getBookById,
        getBooksByStatus,
        getUserBooks,
        getReviewsForBook,
        addReview,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error("useBooks must be used within a BookProvider");
  }
  return context;
};
