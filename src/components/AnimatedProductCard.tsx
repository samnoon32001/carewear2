import { useState } from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductWithRating } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';
import { useCart } from '@/store/cart';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ImageLoader } from './ImageLoader';

interface AnimatedProductCardProps {
  product: ProductWithRating;
  className?: string;
}

export function AnimatedProductCard({ product, className }: AnimatedProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, product.sizes?.[0] || '', product.colors?.[0] || '');
    toast({ title: 'Added to cart!' });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast({ 
      title: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      duration: 2000
    });
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const imageUrl = 'https://images.unsplash.com/photo-1606757513965-65b9407854b5?w=400&h=300&fit=crop';

  return (
    <div className={cn(
      "group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden",
      className
    )}>
      {/* Product Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {isImageLoading && <ImageLoader aspect="aspect-[3/4]" />}
        
        <img
          src={imageUrl}
          alt={product.name}
          onLoad={handleImageLoad}
          className={cn(
            "w-full h-full object-cover transition-transform duration-300 group-hover:scale-110",
            isImageLoading ? "opacity-0" : "opacity-100"
          )}
        />
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            <button
              onClick={handleToggleWishlist}
              className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors duration-200"
            >
              <Heart className={cn("h-4 w-4", isWishlisted ? "fill-current text-red-500" : "")} />
            </button>
            
            <button
              onClick={handleAddToCart}
              className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors duration-200"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Stock Badge */}
        {product.stock === 0 && (
          <div className="absolute top-4 left-4">
            <Badge variant="destructive" className="animate-fade-in">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category Badge */}
        {(product as any).categories?.name && (
          <Badge variant="secondary" className="mb-2 text-xs animate-fade-in">
            {(product as any).categories.name}
          </Badge>
        )}

        {/* Product Name */}
        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {product.name}
        </h3>

        {/* Rating */}
        {product.avg_rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "w-3 h-3 transition-colors duration-200",
                  i < Math.floor(product.avg_rating)
                    ? "bg-amber-400"
                    : "bg-gray-300"
                )}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">
              ({product.reviews_count})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold">{formatCurrency(product.price)}</span>
          {product.stock > 0 && product.stock < 10 && (
            <Badge variant="secondary" className="text-xs animate-pulse">
              Only {product.stock} left
            </Badge>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full transition-all duration-200 hover:scale-105 active:scale-95"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
