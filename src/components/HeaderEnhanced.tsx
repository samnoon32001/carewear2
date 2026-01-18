import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, X, Menu, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/store/cart';
import { cn } from '@/lib/utils';

export default function HeaderEnhanced() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const { items } = useCart();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    setIsSearchOpen(false);
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Categories', href: '/categories' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      {/* Main Header */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-lg" 
          : "bg-white border-b"
      )}>
        <div className="container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="font-bold text-xl">CareWear</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors duration-200 hover:text-primary",
                    location.pathname === item.href ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="transition-all duration-200 hover:scale-105"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Account */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  className="transition-all duration-200 hover:scale-105"
                >
                  <User className="h-5 w-5" />
                </Button>

                {/* Account Dropdown */}
                {isAccountDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border animate-fade-in">
                    {user ? (
                      <div className="p-2">
                        <div className="px-3 py-2 text-sm text-muted-foreground border-b">
                          {user.email}
                        </div>
                        <Link to="/dashboard" className="block px-3 py-2 text-sm hover:bg-muted rounded">
                          Dashboard
                        </Link>
                        <button
                          onClick={() => setUser(null)}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-muted rounded"
                        >
                          Sign Out
                        </button>
                      </div>
                    ) : (
                      <div className="p-2">
                        <Link to="/login" className="block px-3 py-2 text-sm hover:bg-muted rounded">
                          Sign In
                        </Link>
                        <Link to="/signup" className="block px-3 py-2 text-sm hover:bg-muted rounded">
                          Sign Up
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link to="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative transition-all duration-200 hover:scale-105"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-bounce">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden transition-all duration-200 hover:scale-105"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="container pt-20">
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for products, categories, or brands..."
                  className="pl-12 pr-12 h-14 text-lg bg-white"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </form>
            
            {/* Search Suggestions */}
            <div className="max-w-2xl mx-auto mt-8">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Popular Searches</h3>
              <div className="flex flex-wrap gap-2">
                {['Scrubs', 'Lab Coats', 'Medical Uniforms', 'Nursing Scrubs', 'Hospital Wear'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      // Handle search term selection
                      setIsSearchOpen(false);
                    }}
                    className="px-3 py-1 bg-white rounded-full text-sm hover:bg-muted transition-colors duration-200"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in">
          <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl animate-slide-in-right">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg">Menu</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <nav className="p-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block py-3 text-sm font-medium transition-colors duration-200 hover:text-primary",
                    location.pathname === item.href ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Header Spacer */}
      <div className="h-16" />
    </>
  );
}
