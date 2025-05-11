
import React from "react";
import { Link } from "react-router-dom";
import { Book } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center">
              <Book className="h-5 w-5 text-primary mr-2" />
              <span className="font-serif text-lg font-bold">BookBurst</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              Track your reading journey, share reviews, and discover new books.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-12">
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Navigation</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/bookshelf" className="text-muted-foreground hover:text-foreground transition-colors">
                    My Bookshelf
                  </Link>
                </li>
                <li>
                  <Link to="/explore" className="text-muted-foreground hover:text-foreground transition-colors">
                    Explore
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Help</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t text-sm text-muted-foreground text-center">
          <p>&copy; {currentYear} BookBurst. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
