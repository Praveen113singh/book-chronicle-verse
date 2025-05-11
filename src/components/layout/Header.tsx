
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Book } from "lucide-react";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header className={`sticky top-0 z-40 w-full transition-all ${
      scrolled ? "bg-background/80 backdrop-blur-sm shadow-sm" : "bg-background"
    }`}>
      <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Book className="h-6 w-6 text-primary mr-2" />
          <span className="font-serif text-xl font-bold">BookBurst</span>
        </Link>

        {user ? (
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/bookshelf" className="text-foreground hover:text-primary transition-colors">
                My Bookshelf
              </Link>
              <Link to="/explore" className="text-foreground hover:text-primary transition-colors">
                Explore
              </Link>
              <Link to="/timeline" className="text-foreground hover:text-primary transition-colors">
                Timeline
              </Link>
            </nav>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative size-8 rounded-full" size="icon">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/profile/${user.username}`}>My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/bookshelf">My Bookshelf</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="md:hidden">
                  <Link to="/explore">Explore</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="md:hidden">
                  <Link to="/timeline">Timeline</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="outline">Sign in</Button>
            </Link>
            <Link to="/auth" className="hidden sm:block">
              <Button>Sign up</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
