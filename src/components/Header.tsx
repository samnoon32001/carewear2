import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/store/cart';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export function Header() {
  const { getTotalItems } = useCart();
  const { user, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartCount = getTotalItems();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin status:', error);
        return;
      }
      
      setIsAdmin(!!data);
    };

    checkAdmin();
  }, [user]);

  return (
    <header 
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-400 ease-in-out",
        isHomePage && !scrolled
          ? "bg-transparent"
          : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center gap-2">
            <div className={cn(
              "h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center transition-all duration-400",
              isHomePage && !scrolled ? "bg-white" : "bg-gradient-primary"
            )}>
              <span className={cn(
                "font-bold text-lg transition-all duration-400",
                isHomePage && !scrolled ? "text-primary" : "text-white"
              )}>C</span>
            </div>
            <span className={cn(
              "text-xl font-bold transition-all duration-400",
              isHomePage && !scrolled 
                ? "text-white" 
                : "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            )}>
              CareWear
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          <Link 
            to="/shop" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isHomePage && !scrolled 
                ? "text-white hover:text-white/80" 
                : "text-foreground hover:text-primary"
            )}
          >
            Shop
          </Link>
          <Link 
            to="/categories" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isHomePage && !scrolled 
                ? "text-white hover:text-white/80" 
                : "text-foreground hover:text-primary"
            )}
          >
            Categories
          </Link>
          {isAdmin && (
            <Link 
              to="/admin/products" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-accent",
                isHomePage && !scrolled 
                  ? "text-white hover:text-white/80" 
                  : "text-foreground hover:text-accent"
              )}
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {/* Cart Button */}
          <Link to="/cart">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "relative transition-all duration-400",
                isHomePage && !scrolled
                  ? "text-white hover:text-white/80 hover:bg-white/10"
                  : "text-foreground hover:bg-accent"
              )}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className={cn(
                  "absolute -top-1 -right-1 h-5 w-5 rounded-full text-white text-xs flex items-center justify-center transition-all duration-400",
                  isHomePage && !scrolled ? "bg-accent" : "bg-primary"
                )}>
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={cn(
                    "transition-all duration-400",
                    isHomePage && !scrolled
                      ? "text-white hover:text-white/80 hover:bg-white/10"
                      : "text-foreground hover:bg-accent"
                  )}
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button 
                variant={isHomePage && !scrolled ? "outline" : "default"}
                size="sm"
                className={cn(
                  "transition-all duration-400",
                  isHomePage && !scrolled
                    ? "border-white text-white hover:bg-white hover:text-primary"
                    : ""
                )}
              >
                Sign In
              </Button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "md:hidden transition-all duration-400",
              isHomePage && !scrolled
                ? "text-white hover:text-white/80 hover:bg-white/10"
                : "text-foreground hover:bg-accent"
            )}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={cn(
          "md:hidden border-t transition-all duration-400",
          isHomePage && !scrolled
            ? "bg-white/10 backdrop-blur border-white/20"
            : "bg-background border-border"
        )}>
          <div className="container py-4 space-y-3">
            <Link 
              to="/shop" 
              className={cn(
                "block text-sm font-medium transition-colors hover:text-primary",
                isHomePage && !scrolled ? "text-white" : "text-foreground"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link 
              to="/categories" 
              className={cn(
                "block text-sm font-medium transition-colors hover:text-primary",
                isHomePage && !scrolled ? "text-white" : "text-foreground"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              Categories
            </Link>
            {isAdmin && (
              <Link 
                to="/admin/products" 
                className={cn(
                  "block text-sm font-medium transition-colors hover:text-accent",
                  isHomePage && !scrolled ? "text-white" : "text-foreground"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
