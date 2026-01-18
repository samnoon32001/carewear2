import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Minus, Plus, ZoomIn, ChevronLeft, ChevronRight, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { BuyNowButton } from '@/components/BuyNowButton';
import { ReviewForm } from '@/components/ReviewForm';
import { ReviewList } from '@/components/ReviewList';
import { StickyAddToCart } from '@/components/StickyAddToCart';
import { ImageLoader } from '@/components/ImageLoader';
import { supabase } from '@/integrations/supabase/client';
import { ProductWithRating, ProductImage, Review, Category } from '@/types';
import { useCart } from '@/store/cart';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/formatCurrency';
import { cn } from '@/lib/utils';

export default function ProductPageMedical() {
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
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slug) fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    setIsPageLoading(true);
    try {
      // Use mock data since Supabase table doesn't exist
      const mockProduct: ProductWithRating = {
        id: '1',
        name: 'Premium Medical Scrub Top',
        slug: slug || 'premium-medical-scrub-top',
        description: 'Professional medical-grade scrub top with moisture-wicking technology and antimicrobial fabric. Designed for healthcare professionals who demand comfort and performance during long shifts.',
        price: 29.99,
        stock: 15,
        category_id: '1',
        sku: 'MED-TOP-001',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Navy Blue', 'Royal Blue', 'Ceil Blue'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        avg_rating: 4.5,
        reviews_count: 12
      };

      setProduct(mockProduct);
      if (mockProduct.sizes?.length) setSelectedSize(mockProduct.sizes[0]);
      if (mockProduct.colors?.length) setSelectedColor(mockProduct.colors[0]);

      // Mock category
      const mockCategory: Category = {
        id: '1',
        name: 'Scrub Tops',
        slug: 'scrub-tops',
        description: 'Professional medical scrub tops',
        created_at: new Date().toISOString()
      };
      setCategory(mockCategory);

      // Mock images
      const mockImages: ProductImage[] = [
        { id: '1', product_id: '1', url: 'https://i.pinimg.com/736x/34/cb/37/34cb37b74c34c4491590f0fc0a3c54c1.jpg', alt: 'Premium Medical Scrub Top - Professional Healthcare Uniform', position: 0, created_at: new Date().toISOString() },
        { id: '2', product_id: '1', url: 'https://i.pinimg.com/736x/34/cb/37/34cb37b74C34c4491590f0fc0a3c54c1.jpg', alt: 'Medical Scrub Top - Navy Blue Professional', position: 1, created_at: new Date().toISOString() },
        { id: '3', product_id: '1', url: 'https://i.pinimg.com/736x/34/cb/37/34cb37b74D34c4491590f0fc0a3c54c1.jpg', alt: 'Medical Scrub Top - Royal Blue Medical Uniform', position: 2, created_at: new Date().toISOString() }
      ];
      setImages(mockImages);

      // Mock reviews
      const mockReviews: Review[] = [
        {
          id: '1',
          product_id: '1',
          user_id: 'user1',
          name: 'John Doe',
          rating: 5,
          comment: 'Excellent quality scrub top! Very comfortable for long shifts.',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          product_id: '1',
          user_id: 'user2',
          name: 'Jane Smith',
          rating: 4,
          comment: 'Good fit and material. Would recommend.',
          created_at: new Date().toISOString()
        }
      ];
      setReviews(mockReviews);
      
      // Mock related products
      const mockRelatedProducts: ProductWithRating[] = [
        {
          id: '2',
          name: 'Comfortable Scrub Pants',
          slug: 'comfortable-scrub-pants',
          description: 'Medical scrub pants with elastic waist and multiple pockets',
          price: 34.99,
          stock: 20,
          category_id: '1',
          sku: 'MED-PNT-001',
          sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
          colors: ['Navy Blue', 'Black', 'Gray'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          avg_rating: 4.7,
          reviews_count: 18
        },
        {
          id: '3',
          name: 'Professional Lab Coat',
          slug: 'professional-lab-coat',
          description: 'Classic white lab coat with professional appearance',
          price: 59.99,
          stock: 10,
          category_id: '1',
          sku: 'MED-LAB-001',
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['White'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          avg_rating: 4.8,
          reviews_count: 25
        },
        {
          id: '4',
          name: 'Complete Scrub Set',
          slug: 'complete-scrub-set',
          description: 'Matching scrub top and pants set for professionals',
          price: 54.99,
          stock: 8,
          category_id: '1',
          sku: 'MED-SET-001',
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Navy Blue', 'Royal Blue'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          avg_rating: 4.6,
          reviews_count: 15
        },
        {
          id: '5',
          name: 'Medical Scrub Jacket',
          slug: 'medical-scrub-jacket',
          description: 'Warm medical scrub jacket for cold environments',
          price: 39.99,
          stock: 12,
          category_id: '1',
          sku: 'MED-JKT-001',
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Navy Blue', 'Black'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          avg_rating: 4.4,
          reviews_count: 8
        }
      ];
      setRelatedProducts(mockRelatedProducts);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: 'Error',
        description: 'Failed to load product',
        variant: 'destructive',
      });
    } finally {
      setIsPageLoading(false);
    }
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

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
    setIsZoomed(false);
  };

  const handleZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setImagePosition({ x, y });
    setIsZoomed(true);
  };

  const handleZoomOut = () => {
    setIsZoomed(false);
  };

  const navigateImages = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setSelectedImage((prev) => (prev - 1 + medicalImages.length) % medicalImages.length);
    } else {
      setSelectedImage((prev) => (prev + 1) % medicalImages.length);
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {Array.from({ length:5 }, (_, i) => (
        <Star key={i} className={cn(
          "h-5 w-5 transition-colors duration-200",
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'fill-gray-300 text-gray-300'
        )} />
      ))}
    </div>
  );

  // Medical scrub themed images
  const medicalImages = [
    "https://i.pinimg.com/736x/34/cb/37/34cb37b74c34c4491590f0fc0a3c54c1.jpg",
    "https://i.pinimg.com/736x/34/cb/37/34cb37b74C34c4491590f0fc0a3c54c1.jpg",
    "https://i.pinimg.com/736x/34/cb/37/34cb37b74D34c4491590f0fc0a3c54c1.jpg",
    "https://i.pinimg.com/736x/34/cb/37/34cb37b74E34c4491590f0fc0a3c54c1.jpg",
    "https://i.pinimg.com/736x/34/cb/37/34cb37b74F34c4491590f0fc0a3c54c1.jpg",
    "https://i.pinimg.com/736x/34/cb/37/34cb37b74G34c4491590f0fc0a3c54c1.jpg",
    "https://i.pinimg.com/736x/34/cb/37/34cb37b74H34c4491590f0fc0a3c54c1.jpg"
  ];

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white animate-fade-in">
        <div className="container py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <ImageLoader aspect="aspect-[3/4]" />
              <div className="grid grid-cols-4 gap-2 mt-4">
                {[1, 2, 3, 4].map((i) => (
                  <ImageLoader key={i} aspect="aspect-[1/1]" className="h-20" />
                ))}
              </div>
            </div>
            <div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
                <div className="h-32 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const currentImageUrl = medicalImages[selectedImage];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white animate-fade-in">
      {/* Breadcrumb */}
      <nav className="container py-4 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
          <span>/</span>
          <a href="/shop" className="hover:text-blue-600 transition-colors">Shop</a>
          {category && (
            <>
              <span>/</span>
              <a href={`/shop?category=${category.slug}`} className="hover:text-blue-600 transition-colors">
                {category.name}
              </a>
            </>
          )}
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>
      </nav>

      <div className="container py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* LEFT SIDE - PRODUCT IMAGE GALLERY */}
          <div className="space-y-4">
            {/* Main Product Image */}
            <div className="relative group">
              <div 
                ref={imageRef}
                className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden shadow-2xl"
                onClick={handleZoom}
              >
                {isImageLoading && (
                  <ImageLoader aspect="aspect-[3/4]" />
                )}
                
                <img
                  src="https://i.pinimg.com/736x/34/cb/37/34cb37b74c34c4491590f0fc0a3c54c1.jpg"
                  alt={`${product.name} - Premium Medical Scrub Uniform`}
                  onLoad={handleImageLoad}
                  className={cn(
                    "w-full h-full object-cover transition-all duration-500 cursor-zoom-in",
                    isImageLoading ? "opacity-0" : "opacity-100",
                    isZoomed ? "scale-150" : "group-hover:scale-105"
                  )}
                  style={{
                    transformOrigin: `${imagePosition.x}% ${imagePosition.y}%`,
                  }}
                />
                
                {/* Zoom Indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ZoomIn className="h-5 w-5 text-white bg-blue-600/80 backdrop-blur-sm rounded-full p-2" />
                </div>

                {/* Navigation Arrows */}
                {medicalImages.length > 1 && (
                  <>
                    <button
                      onClick={() => navigateImages('prev')}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 hover:opacity-100 transition-all duration-200"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => navigateImages('next')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 hover:opacity-100 transition-all duration-200"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}

                {/* Stock Overlay */}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <Badge variant="destructive" className="text-lg px-6 py-3 bg-red-600">
                      Out of Stock
                    </Badge>
                  </div>
                )}
              </div>

              {/* Zoom Modal */}
              {isZoomed && (
                <div 
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in"
                  onClick={handleZoomOut}
                >
                  <div className="relative max-w-4xl max-h-[90vh]">
                    <img
                      src="https://i.pinimg.com/736x/34/cb/37/34cb37b74c34c4491590f0fc0a3c54c1.jpg"
                      alt={`${product.name} - Premium Medical Scrub Uniform Zoomed`}
                      className="max-w-full max-h-full object-contain"
                    />
                    <button
                      onClick={handleZoomOut}
                      className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                    >
                      <ZoomIn className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {medicalImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => handleImageClick(idx)}
                  className={cn(
                    "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200",
                    selectedImage === idx
                      ? "border-blue-600 ring-2 ring-blue-600/20 scale-105"
                      : "border-gray-300 hover:border-blue-400 hover:scale-105"
                  )}
                >
                  <img 
                    src="https://i.pinimg.com/736x/34/cb/37/34cb37b74c34c4491590f0fc0a3c54c1.jpg" 
                    alt={`${product.name} - Medical Scrub Thumbnail ${idx + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE - PRODUCT INFORMATION */}
          <div className="space-y-6">
            {/* Product Header */}
            <div className="animate-fade-in">
              {category && (
                <Badge className="mb-4 bg-blue-100 text-blue-700">
                  {category.name}
                </Badge>
              )}
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 leading-tight">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {renderStars(product.avg_rating)}
                  <span className="text-sm text-gray-600 ml-1">
                    ({product.reviews_count} reviews)
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  SKU: {product.sku || 'MED-' + product.id?.slice(-6)}
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl md:text-4xl font-bold text-gray-900">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-sm text-gray-600">USD</span>
                </div>
                {product.stock > 0 && (
                  <p className="text-sm text-green-600 font-medium animate-fade-in flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                    In Stock ({product.stock} available)
                  </p>
                )}
              </div>

              {/* Short Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Options */}
            <div className="space-y-6 animate-fade-in">
              {/* Size Selector */}
              {product.sizes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-900">Size</label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "py-3 px-4 border-2 rounded-full text-sm font-medium transition-all duration-200",
                          selectedSize === size
                            ? "border-blue-600 bg-blue-600 text-white shadow-lg scale-105"
                            : "border-gray-300 hover:border-blue-400 hover:shadow-md hover:scale-105"
                        )}
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
                  <label className="block text-sm font-medium mb-3 text-gray-900">Color</label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "w-12 h-12 rounded-full border-2 transition-all duration-200",
                          selectedColor === color
                            ? "border-blue-600 ring-2 ring-blue-600/20 scale-110 shadow-lg"
                            : "border-gray-300 hover:border-blue-400 hover:shadow-md hover:scale-110"
                        )}
                        style={{ backgroundColor: color.toLowerCase() }}
                      >
                        {selectedColor === color && (
                          <div className="w-full h-full rounded-full border-2 border-white flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-900">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="w-16 text-center font-medium text-lg text-gray-900">
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 animate-fade-in">
              <Button 
                onClick={handleAddToCart} 
                disabled={product.stock === 0} 
                size="lg" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <BuyNowButton
                  productName={product.name}
                  selectedSize={selectedSize}
                  selectedColor={selectedColor}
                  disabled={product.stock === 0}
                />
                
                <Button
                  variant="outline"
                  onClick={handleToggleWishlist}
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <Heart className={cn("mr-2 h-4 w-4 transition-colors duration-200", isWishlisted ? "fill-current text-red-500" : "")} />
                  {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                </Button>
              </div>
              
              <Button
                variant="outline"
                onClick={handleShare}
                className="w-full border-gray-300 hover:bg-gray-50 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-t border-b border-gray-200 animate-fade-in">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-blue-600" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-blue-600" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RotateCcw className="h-4 w-4 text-blue-600" />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="max-w-4xl mx-auto mt-16 animate-fade-in">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description" className="transition-all duration-200 hover:bg-blue-50">Description</TabsTrigger>
              <TabsTrigger value="details" className="transition-all duration-200 hover:bg-blue-50">Details</TabsTrigger>
              <TabsTrigger value="shipping" className="transition-all duration-200 hover:bg-blue-50">Shipping</TabsTrigger>
              <TabsTrigger value="reviews" className="transition-all duration-200 hover:bg-blue-50">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6 animate-fade-in">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Product Description</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="mt-4">
                      <h4 className="font-medium mb-2 text-gray-900">Key Features:</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>Premium medical-grade fabric for maximum comfort</li>
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
            
            <TabsContent value="details" className="mt-6 animate-fade-in">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Product Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-gray-900">Material:</span>
                      <p className="text-gray-600">65% Polyester, 35% Cotton</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Care Instructions:</span>
                      <p className="text-gray-600">Machine wash cold, tumble dry low</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Origin:</span>
                      <p className="text-gray-600">Made in USA</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Weight:</span>
                      <p className="text-gray-600">200gsm fabric weight</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-medium mb-3 text-gray-900">Size Guide</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 text-gray-900">Size</th>
                            <th className="text-left py-2 text-gray-900">Chest (in)</th>
                            <th className="text-left py-2 text-gray-900">Length (in)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-200">
                            <td className="py-2">XS</td>
                            <td className="py-2">32-34</td>
                            <td className="py-2">26</td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-2">S</td>
                            <td className="py-2">35-37</td>
                            <td className="py-2">27</td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-2">M</td>
                            <td className="py-2">38-40</td>
                            <td className="py-2">28</td>
                          </tr>
                          <tr className="border-b border-gray-200">
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
            
            <TabsContent value="shipping" className="mt-6 animate-fade-in">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Shipping & Returns</h3>
                  <div className="space-y-4 text-gray-600">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Shipping</h4>
                      <ul className="space-y-1">
                        <li>• Standard shipping: 5-7 business days</li>
                        <li>• Express shipping: 2-3 business days</li>
                        <li>• Free shipping on orders over $75</li>
                        <li>• Order tracking available</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Returns</h4>
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
            
            <TabsContent value="reviews" className="mt-6 animate-fade-in">
              <div className="space-y-6">
                <ReviewForm productId={product.id} onReviewAdded={() => setReviews([...reviews, {
          id: Date.now().toString(),
          product_id: product.id,
          user_id: 'current-user',
          name: 'Current User',
          rating: 5,
          comment: 'New review',
          created_at: new Date().toISOString()
        }])} />
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-900">Customer Reviews</h2>
                  <ReviewList reviews={reviews} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="max-w-6xl mx-auto mt-16 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="group">
                  <div className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden mb-4 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <img
                      src="https://i.pinimg.com/736x/34/cb/37/34cb37b74c34c4491590f0fc0a3c54c1.jpg"
                      alt={`${relatedProduct.name} - Premium Medical Scrub Uniform`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {relatedProduct.name}
                    </h3>
                    <p className="font-bold text-gray-900">{formatCurrency(relatedProduct.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Add to Cart Bar */}
      <StickyAddToCart
        product={product}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        quantity={quantity}
        disabled={product.stock === 0}
      />
    </div>
  );
}
