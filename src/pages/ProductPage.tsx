import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BuyNowButton } from '@/components/BuyNowButton';
import { ReviewForm } from '@/components/ReviewForm';
import { ReviewList } from '@/components/ReviewList';
import { supabase } from '@/integrations/supabase/client';
import { ProductWithRating, ProductImage, Review } from '@/types';
import { useCart } from '@/store/cart';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/formatCurrency';

export default function ProductPage() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [product, setProduct] = useState<ProductWithRating | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (slug) fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    const { data } = await supabase
      .from('product_with_avg_rating')
      .select('*')
      .eq('slug', slug)
      .single();

    if (data) {
      setProduct(data as ProductWithRating);
      if (data.sizes?.length) setSelectedSize(data.sizes[0]);
      if (data.colors?.length) setSelectedColor(data.colors[0]);

      const { data: imgs } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', data.id)
        .order('position');
      if (imgs) setImages(imgs);

      fetchReviews(data.id);
    }
  };

  const fetchReviews = async (productId: string) => {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    if (data) setReviews(data);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity, selectedSize, selectedColor);
    toast({ title: 'Added to cart!' });
  };

  if (!product) return <div className="container py-8">Loading...</div>;

  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`h-5 w-5 ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}`} />
      ))}
    </div>
  );

  return (
    <div className="container py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-4">
            <img
              src={images[selectedImage]?.url || '/placeholder.svg'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded overflow-hidden ${selectedImage === idx ? 'ring-2 ring-primary' : ''}`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            {renderStars(product.avg_rating)}
            <span className="text-sm text-muted-foreground">({product.reviews_count} reviews)</span>
          </div>
          <p className="text-3xl font-bold mb-4">{formatCurrency(product.price)}</p>
          <p className="text-muted-foreground mb-6">{product.description}</p>

          <div className="space-y-4 mb-6">
            {product.sizes.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">Size</label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {product.sizes.map(size => <SelectItem key={size} value={size}>{size}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            {product.colors.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {product.colors.map(color => <SelectItem key={color} value={color}>{color}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Button onClick={handleAddToCart} disabled={product.stock === 0} size="lg" className="w-full">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <BuyNowButton
              productName={product.name}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              disabled={product.stock === 0}
            />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        <ReviewForm productId={product.id} onReviewAdded={() => fetchReviews(product.id)} />
        <div>
          <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
          <ReviewList reviews={reviews} />
        </div>
      </div>
    </div>
  );
}
