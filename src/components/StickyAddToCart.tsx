import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/store/cart';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

interface StickyAddToCartProps {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  disabled?: boolean;
}

export function StickyAddToCart({ product, selectedSize, selectedColor, quantity, disabled }: StickyAddToCartProps) {
  const { addItem } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setHasScrolled(scrollY > 300);
      
      // Show sticky bar after scrolling past product info
      if (scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSize, selectedColor);
  };

  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 transform transition-transform duration-300 ease-in-out",
      hasScrolled ? "translate-y-0" : "translate-y-full"
    )}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="https://images.unsplash.com/photo-1606757513965-65b9407854b5?w=400&h=400&fit=crop"
              alt={product.name}
              className="w-12 h-12 rounded object-cover"
            />
            <div>
              <p className="text-sm font-medium">{product.name}</p>
              <p className="text-xs text-muted-foreground">
                {selectedSize && `Size: ${selectedSize}`}
                {selectedSize && selectedColor && " | "}
                {selectedColor && `Color: ${selectedColor}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-lg font-bold">{(product.price * quantity).toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">USD</p>
            </div>
            
            <Button 
              onClick={handleAddToCart}
              disabled={disabled}
              size="lg"
              className="min-w-40 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
