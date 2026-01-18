import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, X, Menu, Stethoscope, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/store/cart';
import { cn } from '@/lib/utils';

export default function HeaderMedical() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const { items } = useCart();

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
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-blue-100" 
          : "bg-white border-b border-gray-200"
      )}>
        <div className="container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-gray-900">CareWear</span>
                <span className="text-xs text-blue-600 font-medium block">Medical Scrubs</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-sm font-medium transition-all duration-200 hover:text-blue-600 hover:scale-105",
                    location.pathname === item.href ? "text-blue-600 font-semibold" : "text-gray-700"
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
                className="transition-all duration-200 hover:scale-105 hover:bg-blue-50"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Cart */}
              <Link to="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative transition-all duration-200 hover:scale-105 hover:bg-blue-50"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-blue-600 text-white animate-bounce">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Account */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  className="transition-all duration-200 hover:scale-105 hover:bg-blue-50"
                >
                  <User className="h-5 w-5" />
                </Button>

                {/* Account Dropdown */}
                {isAccountDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 animate-fade-in">
                    <div className="p-2">
                      <Link to="/login" className="block px-3 py-2 text-sm hover:bg-blue-50 rounded transition-colors duration-200">
                        Sign In
                      </Link>
                      <Link to="/signup" className="block px-3 py-2 text-sm hover:bg-blue-50 rounded transition-colors duration-200">
                        Create Account
                      </Link>
                      <Link to="/dashboard" className="block px-3 py-2 text-sm hover:bg-blue-50 rounded transition-colors duration-200">
                        Dashboard
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden transition-all duration-200 hover:scale-105 hover:bg-blue-50"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="container pt-20">
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-blue-600" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for medical scrubs, lab coats, uniforms..."
                  className="pl-12 pr-12 h-16 text-lg bg-white border-2 border-blue-200 focus:border-blue-500 rounded-xl shadow-lg"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </form>
            
            {/* Search Suggestions */}
            <div className="max-w-2xl mx-auto mt-8">
              <h3 className="text-lg font-medium text-white mb-4">Popular Searches</h3>
              <div className="flex flex-wrap gap-3">
                {['Medical Scrubs', 'Lab Coats', 'Nursing Uniforms', 'Hospital Wear', 'Scrubs Sets'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      // Handle search term selection
                      setIsSearchOpen(false);
                    }}
                    className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm hover:bg-white transition-all duration-200 hover:scale-105"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in">
          <div className="fixed right-0 top-0 h-full w-72 bg-white shadow-2xl animate-slide-in-right">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Stethoscope className="h-6 w-6 text-blue-600" />
                  <span className="font-bold text-lg">CareWear</span>
                </div>
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
                    "block py-3 text-sm font-medium transition-all duration-200 hover:text-blue-600 hover:pl-2",
                    location.pathname === item.href ? "text-blue-600 font-semibold border-l-2 border-blue-600 pl-4" : "text-gray-700"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Contact Info */}
            <div className="p-4 border-t border-gray-200">
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>1-800-MEDICAL</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>support@carewear.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Spacer */}
      <div className="h-16" />
    </>
  );
}
