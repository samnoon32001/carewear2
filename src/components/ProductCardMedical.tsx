import { useState } from 'react';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductWithRating } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';
import { useCart } from '@/store/cart';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ImageLoader } from './ImageLoader';

interface ProductCardMedicalProps {
  product: ProductWithRating;
  className?: string;
}

export function ProductCardMedical({ product, className }: ProductCardMedicalProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={cn(
          "h-4 w-4 transition-colors duration-200",
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'fill-gray-300 text-gray-300'
        )} />
      ))}
    </div>
  );

  // Medical scrub themed images
  const medicalImages = [
    "https://images.unsplash.com/photo-1559839734-f1b5cf18eba7?w=400&h=300&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1598302948767-d5d6b8b0a6a?w=400&h=300&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1578632294429-2d8e7f947d3?w=400&h=300&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1582750433442-72e5c06b1dc1?w=400&h=300&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&auto=format"
  ];

  const imageUrl = medicalImages[product.id?.charCodeAt(0) % medicalImages.length] || medicalImages[0];

  return (
    <div 
      className={cn(
        "group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-100",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        {isImageLoading && <ImageLoader aspect="aspect-[3/4]" />}
        
        <img
          src={imageUrl}
          alt={product.name}
          onLoad={handleImageLoad}
          className={cn(
            "w-full h-full object-cover transition-all duration-500",
            isImageLoading ? "opacity-0" : "opacity-100",
            isHovered ? "scale-110" : "scale-100"
          )}
        />
        
        {/* Quick Actions Overlay */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent flex items-center justify-center transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <div className="flex gap-3">
            <button
              onClick={handleToggleWishlist}
              className="bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-all duration-200 hover:scale-110"
            >
              <Heart className={cn("h-5 w-5", isWishlisted ? "fill-current text-red-500" : "")} />
            </button>
            
            <button
              onClick={handleAddToCart}
              className="bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-all duration-200 hover:scale-110"
            >
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </button>
          </div>
        </div>

        {/* Stock Badge */}
        {product.stock === 0 && (
          <div className="absolute top-4 left-4">
            <Badge variant="destructive" className="bg-red-600 text-white px-3 py-1 animate-fade-in">
              Out of Stock
            </Badge>
          </div>
        )}

        {/* Discount Badge */}
        {product.stock > 0 && product.stock < 10 && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-orange-500 text-white px-3 py-1 animate-pulse">
              Only {product.stock} left
            </Badge>
          </div>
        )}

        {/* Quick View */}
        {isHovered && (
          <div className="absolute top-4 right-4 animate-fade-in">
            <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all duration-200">
              <Eye className="h-4 w-4 text-gray-700" />
            </button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category Badge */}
        {(product as any).categories?.name && (
          <Badge variant="secondary" className="mb-2 bg-blue-100 text-blue-700 text-xs animate-fade-in">
            {(product as any).categories.name}
          </Badge>
        )}

        {/* Product Name */}
        <h3 className="font-semibold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
          {product.name}
        </h3>

        {/* Rating */}
        {product.avg_rating > 0 && (
          <div className="flex items-center gap-2 mb-2">
            {renderStars(product.avg_rating)}
            <span className="text-xs text-gray-500">
              ({product.reviews_count})
            </span>
          </div>
        )}

        {/* Price and Actions */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
            <span className="text-xs text-gray-500 ml-1">USD</span>
          </div>
          
          {product.stock > 0 && (
            <div className="flex gap-2">
              <button
                onClick={handleToggleWishlist}
                className="p-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                <Heart className={cn("h-4 w-4", isWishlisted ? "fill-current text-red-500" : "text-gray-400")} />
              </button>
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={cn(
            "w-full transition-all duration-200 font-medium",
            product.stock === 0 
              ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95"
          )}
          size="lg"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
}
