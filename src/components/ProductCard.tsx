import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductWithRating } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';

// Image paths
const productImages = [
  '/src/assets/product-scrubs-burgundy.jpg',
  '/src/assets/product-scrubs-navy.jpg',
  '/src/assets/product-scrubs-teal.jpg'
];

interface ProductCardProps {
  product: ProductWithRating;
  imageUrl?: string;
}

export function ProductCard({ product, imageUrl }: ProductCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'fill-amber-400 text-amber-400'
            : 'fill-muted text-muted'
        }`}
      />
    ));
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-medium">
      <Link to={`/product/${product.slug}`}>
        <div className="aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={imageUrl || productImages[(product.id || 0) % 3]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        </div>
      </Link>

      <CardContent className="p-4">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-semibold mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          {renderStars(product.avg_rating)}
          <span className="text-xs text-muted-foreground ml-1">
            ({product.reviews_count})
          </span>
        </div>

        <p className="text-lg font-bold">{formatCurrency(product.price)}</p>
        
        {product.stock > 0 ? (
          <p className="text-xs text-muted-foreground">In Stock</p>
        ) : (
          <p className="text-xs text-destructive">Out of Stock</p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link to={`/product/${product.slug}`} className="w-full">
          <Button className="w-full" variant="outline">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
