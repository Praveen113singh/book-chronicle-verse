
import React, { useMemo } from "react";
import { useBooks } from "@/contexts/BookContext";
import { format } from "date-fns";

const ReadingTimeline: React.FC = () => {
  const { userBooks } = useBooks();
  
  // Get all finished books
  const finishedBooks = useMemo(() => {
    return userBooks
      .filter(book => book.status === "finished" && book.finishedAt)
      .sort((a, b) => {
        return new Date(b.finishedAt!).getTime() - new Date(a.finishedAt!).getTime();
      });
  }, [userBooks]);
  
  // Group books by month/year
  const timelineGroups = useMemo(() => {
    const groups: Record<string, typeof finishedBooks> = {};
    
    finishedBooks.forEach(book => {
      if (!book.finishedAt) return;
      
      const date = new Date(book.finishedAt);
      const monthYear = format(date, "MMMM yyyy");
      
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      
      groups[monthYear].push(book);
    });
    
    return Object.entries(groups)
      .sort(([aDate], [bDate]) => {
        // Sort by date descending (most recent first)
        const aTime = new Date(aDate).getTime();
        const bTime = new Date(bDate).getTime();
        return bTime - aTime;
      });
  }, [finishedBooks]);

  if (finishedBooks.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-muted-foreground">
          Your reading timeline will appear here once you've finished some books.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="relative border-l-2 border-primary pl-8 ml-4 py-6 space-y-10">
        {timelineGroups.map(([monthYear, books], groupIndex) => (
          <div key={monthYear} className="mb-10">
            <div className="absolute -left-4 mt-1.5">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                {format(new Date(monthYear), "MMM")}
              </div>
            </div>
            
            <h3 className="font-serif text-xl font-medium mb-4">{monthYear}</h3>
            
            <div className="space-y-6">
              {books.map((book) => (
                <div key={book.id} className="flex gap-4">
                  <div className="w-12 shrink-0">
                    <div className="font-medium text-sm text-muted-foreground">
                      {book.finishedAt && format(new Date(book.finishedAt), "d")}
                    </div>
                  </div>
                  
                  <div className="flex-1 border rounded-lg p-4 transition-all hover:shadow-md">
                    <div className="flex gap-4">
                      <div className="w-20">
                        <img 
                          src={book.cover || "/placeholder.svg"} 
                          alt={book.title}
                          className="w-full aspect-[2/3] object-cover rounded"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-serif text-lg font-medium">{book.title}</h4>
                        <p className="text-muted-foreground text-sm mb-2">by {book.author}</p>
                        
                        {book.rating ? (
                          <div className="flex items-center text-yellow-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span 
                                key={i} 
                                className={`text-sm ${i < book.rating! ? "text-yellow-500" : "text-muted-foreground"}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReadingTimeline;
