import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { BuyNowButton } from '@/components/BuyNowButton';
import { ReviewForm } from '@/components/ReviewForm';
import { ReviewList } from '@/components/ReviewList';
import { supabase } from '@/integrations/supabase/client';
import { ProductWithRating, ProductImage, Review, Category } from '@/types';
import { useCart } from '@/store/cart';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/formatCurrency';

export default function ProductPage() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [product, setProduct] = useState<ProductWithRating | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<ProductWithRating[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

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

      // Fetch category
      if (data.category_id) {
        const { data: cat } = await supabase
          .from('categories')
          .select('*')
          .eq('id', data.category_id)
          .single();
        if (cat) setCategory(cat);
      }

      // Fetch images
      const { data: imgs } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', data.id)
        .order('position');
      if (imgs) setImages(imgs);

      // Fetch reviews
      fetchReviews(data.id);
      
      // Fetch related products
      fetchRelatedProducts(data.category_id, data.id);
    }
  };

  const fetchRelatedProducts = async (categoryId: string, currentProductId: string) => {
    const { data } = await supabase
      .from('product_with_avg_rating')
      .select('*')
      .eq('category_id', categoryId)
      .neq('id', currentProductId)
      .limit(4);
    
    if (data) {
      setRelatedProducts(data as ProductWithRating[]);
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

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({ 
      title: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      duration: 2000
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Link copied to clipboard!' });
    }
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
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <a href="/" className="hover:text-foreground">Home</a>
        <span>/</span>
        <a href="/shop" className="hover:text-foreground">Shop</a>
        {category && (
          <>
            <span>/</span>
            <a href={`/shop?category=${category.slug}`} className="hover:text-foreground">
              {category.name}
            </a>
          </>
        )}
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div>
          <div className="relative">
            <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-4 group">
              <img
                src={images[selectedImage]?.url || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    Out of Stock
                  </Badge>
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-primary scale-105' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <div className="mb-6">
            {category && (
              <Badge variant="secondary" className="mb-2">
                {category.name}
              </Badge>
            )}
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {renderStars(product.avg_rating)}
                <span className="text-sm text-muted-foreground ml-1">
                  ({product.reviews_count} reviews)
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                SKU: {product.sku || 'N/A'}
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl md:text-4xl font-bold">{formatCurrency(product.price)}</span>
              {product.stock > 0 && (
                <span className="ml-3 text-sm text-green-600">
                  In Stock ({product.stock} available)
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Product Options */}
          <div className="space-y-6 mb-8">
            {/* Size Selector */}
            {product.sizes.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-3">Size</label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-3 border rounded-md text-sm font-medium transition-all ${
                        selectedSize === size
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-3">Color</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`py-2 px-3 border rounded-md text-sm font-medium transition-all ${
                        selectedColor === color
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-medium mb-3">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-16 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 mb-8">
            <Button 
              onClick={handleAddToCart} 
              disabled={product.stock === 0} 
              size="lg" 
              className="w-full"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            
            <BuyNowButton
              productName={product.name}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              disabled={product.stock === 0}
            />
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleToggleWishlist}
                className="flex-1"
              >
                <Heart className={`mr-2 h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                {isWishlisted ? 'Wishlisted' : 'Wishlist'}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Product Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
              <span>Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Information Tabs */}
      <div className="max-w-4xl mx-auto mb-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                <div className="prose max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Key Features:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Premium quality fabric for maximum comfort</li>
                      <li>Moisture-wicking technology keeps you dry</li>
                      <li>Multiple pockets for convenient storage</li>
                      <li>Professional appearance for healthcare settings</li>
                      <li>Easy care - machine washable</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Material:</span>
                    <p className="text-muted-foreground">65% Polyester, 35% Cotton</p>
                  </div>
                  <div>
                    <span className="font-medium">Care Instructions:</span>
                    <p className="text-muted-foreground">Machine wash cold, tumble dry low</p>
                  </div>
                  <div>
                    <span className="font-medium">Origin:</span>
                    <p className="text-muted-foreground">Made in USA</p>
                  </div>
                  <div>
                    <span className="font-medium">Weight:</span>
                    <p className="text-muted-foreground">200gsm fabric weight</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Size Guide</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Size</th>
                          <th className="text-left py-2">Chest (in)</th>
                          <th className="text-left py-2">Length (in)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">XS</td>
                          <td className="py-2">32-34</td>
                          <td className="py-2">26</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">S</td>
                          <td className="py-2">35-37</td>
                          <td className="py-2">27</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">M</td>
                          <td className="py-2">38-40</td>
                          <td className="py-2">28</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">L</td>
                          <td className="py-2">41-43</td>
                          <td className="py-2">29</td>
                        </tr>
                        <tr>
                          <td className="py-2">XL</td>
                          <td className="py-2">44-46</td>
                          <td className="py-2">30</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="shipping" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Shipping & Returns</h3>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Shipping</h4>
                    <ul className="space-y-1">
                      <li>• Standard shipping: 5-7 business days</li>
                      <li>• Express shipping: 2-3 business days</li>
                      <li>• Free shipping on orders over $75</li>
                      <li>• Order tracking available</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Returns</h4>
                    <ul className="space-y-1">
                      <li>• 30-day return policy</li>
                      <li>• Items must be unworn and in original condition</li>
                      <li>• Free return shipping on defective items</li>
                      <li>• Refunds processed within 5-7 business days</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              <ReviewForm productId={product.id} onReviewAdded={() => fetchReviews(product.id)} />
              <div>
                <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
                <ReviewList reviews={reviews} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="group">
                <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-4">
                  <img
                    src="/placeholder.svg"
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-medium mb-2 group-hover:text-primary transition-colors">
                  {relatedProduct.name}
                </h3>
                <p className="font-bold">{formatCurrency(relatedProduct.price)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
