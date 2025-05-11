import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookStatus, useBooks } from "@/contexts/BookContext";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";

// Mock search results from Google Books API
const mockSearchResults = [
  {
    id: "mock1",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    cover: "https://m.media-amazon.com/images/I/81OthjkJBuL._SL1500_.jpg",
    description: "The Catcher in the Rye is an American novel by J. D. Salinger that was partially published in serial form 1945–46 before being novelized in 1951.",
    genres: ["Fiction", "Coming-of-age"],
    publishedDate: "1951-07-16",
    pageCount: 277,
    isbn: "9780316769174"
  },
  {
    id: "mock2",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    cover: "https://m.media-amazon.com/images/I/710+HcoP38L._SL1500_.jpg",
    description: "The Hobbit, or There and Back Again is a children's fantasy novel by English author J. R. R. Tolkien.",
    genres: ["Fantasy", "Adventure"],
    publishedDate: "1937-09-21",
    pageCount: 310,
    isbn: "9780547928227"
  }
];

const AddBookForm: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [step, setStep] = useState<"search" | "details">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    cover: "",
    genres: [] as string[],
    publishedDate: "",
    pageCount: undefined as number | undefined,
    isbn: "",
    status: "wanttoread" as BookStatus,
    notes: ""
  });
  
  const { addBook, loading } = useBooks();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query");
      return;
    }
    
    setIsSearching(true);
    
    try {
      // For the MVP, we'll just use mock search results
      // In a real app, this would be an API call to Google Books
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSearchResults(mockSearchResults);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search for books. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectBook = (book: any) => {
    setSelectedBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      cover: book.cover,
      genres: book.genres,
      publishedDate: book.publishedDate,
      pageCount: book.pageCount,
      isbn: book.isbn,
      status: "wanttoread",
      notes: ""
    });
    setStep("details");
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value as BookStatus }));
  };

  const handleSubmit = async () => {
    try {
      await addBook({
        title: formData.title,
        author: formData.author,
        description: formData.description,
        cover: formData.cover,
        genres: formData.genres,
        publishedDate: formData.publishedDate,
        pageCount: formData.pageCount,
        isbn: formData.isbn,
        status: formData.status,
        notes: formData.notes
      });
      
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to add book:", error);
    }
  };

  const handleManualEntry = () => {
    setSelectedBook(null);
    setFormData({
      title: "",
      author: "",
      description: "",
      cover: "",
      genres: [],
      publishedDate: "",
      pageCount: undefined,
      isbn: "",
      status: "wanttoread",
      notes: ""
    });
    setStep("details");
  };

  const resetForm = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSelectedBook(null);
    setStep("search");
    setFormData({
      title: "",
      author: "",
      description: "",
      cover: "",
      genres: [],
      publishedDate: "",
      pageCount: undefined,
      isbn: "",
      status: "wanttoread",
      notes: ""
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Book
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a New Book</DialogTitle>
          <DialogDescription>
            Search for a book or add one manually to your bookshelf
          </DialogDescription>
        </DialogHeader>
        
        {step === "search" ? (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search by title, author, or ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
            
            {isSearching ? (
              <div className="py-4 text-center">
                <p>Searching...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {searchResults.map((book) => (
                  <div key={book.id} className="flex gap-3 p-2 border rounded-md hover:bg-accent cursor-pointer" onClick={() => handleSelectBook(book)}>
                    <img 
                      src={book.cover || "/placeholder.svg"} 
                      alt={book.title}
                      className="w-16 aspect-[2/3] object-cover" 
                      onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                    />
                    <div>
                      <h3 className="font-medium">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            
            <div className="border-t pt-4 text-center">
              <button 
                type="button"
                onClick={handleManualEntry}
                className="text-primary hover:underline text-sm"
              >
                Or add a book manually
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Book title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  name="author"
                  placeholder="Book author"
                  value={formData.author}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Book description"
                value={formData.description}
                onChange={handleFormChange}
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="cover">Cover URL</Label>
              <Input
                id="cover"
                name="cover"
                placeholder="https://example.com/book-cover.jpg"
                value={formData.cover}
                onChange={handleFormChange}
              />
            </div>
            
            <div>
              <Label htmlFor="status">Reading Status *</Label>
              <Select
                value={formData.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wanttoread">Want to Read</SelectItem>
                  <SelectItem value="reading">Currently Reading</SelectItem>
                  <SelectItem value="finished">Finished</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="notes">Personal Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Add any personal notes about this book..."
                value={formData.notes}
                onChange={handleFormChange}
              />
            </div>
          </div>
        )}
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          {step === "details" && (
            <Button 
              variant="outline"
              onClick={() => setStep("search")}
              type="button"
            >
              Back to Search
            </Button>
          )}
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setIsDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            {step === "details" && (
              <Button 
                onClick={handleSubmit} 
                disabled={!formData.title || !formData.author || loading}
              >
                {loading ? "Adding..." : "Add to Bookshelf"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookForm;
