
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBooks, BookStatus } from "@/contexts/BookContext";
import BookGrid from "./BookGrid";

const BookStatusTabs: React.FC = () => {
  const { getBooksByStatus } = useBooks();
  const [activeTab, setActiveTab] = useState<BookStatus>("reading");
  
  // Load saved tab preference from cookie
  useEffect(() => {
    const savedTab = document.cookie
      .split("; ")
      .find(row => row.startsWith("bookshelf_tab="))
      ?.split("=")[1] as BookStatus | undefined;
    
    if (savedTab && ["reading", "finished", "wanttoread"].includes(savedTab)) {
      setActiveTab(savedTab);
    }
  }, []);
  
  // Save tab preference to cookie when changed
  useEffect(() => {
    document.cookie = `bookshelf_tab=${activeTab}; max-age=31536000; path=/`;
  }, [activeTab]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value as BookStatus);
  };
  
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="mb-6 w-full max-w-md mx-auto grid grid-cols-3">
        <TabsTrigger value="reading">Reading</TabsTrigger>
        <TabsTrigger value="finished">Finished</TabsTrigger>
        <TabsTrigger value="wanttoread">Want to Read</TabsTrigger>
      </TabsList>
      <TabsContent value="reading">
        <BookGrid 
          books={getBooksByStatus("reading")} 
          emptyMessage="No books currently being read. Add some from the search!"
        />
      </TabsContent>
      <TabsContent value="finished">
        <BookGrid 
          books={getBooksByStatus("finished")} 
          emptyMessage="No finished books yet. Keep reading!"
        />
      </TabsContent>
      <TabsContent value="wanttoread">
        <BookGrid 
          books={getBooksByStatus("wanttoread")} 
          emptyMessage="No books in your wishlist. Time to discover!"
        />
      </TabsContent>
    </Tabs>
  );
};

export default BookStatusTabs;
