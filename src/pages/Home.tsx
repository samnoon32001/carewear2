import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { ProductWithRating, ProductImage, Category } from '@/types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductWithRating[]>([]);
  const [productImages, setProductImages] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [heroSlides, setHeroSlides] = useState<any[]>([]);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchCategories();
    fetchHeroSlides();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .limit(8);
    
    if (data) {
      setCategories(data);
    }
  };

  const fetchHeroSlides = async () => {
    // Static hero slides for now - can be made dynamic from admin
    const slides = [
      {
        id: 1,
        title: "Premium Medical Scrubs",
        subtitle: "for Healthcare Heroes",
        description: "Comfort meets professionalism. Discover our collection of high-quality scrubs designed for the demands of your day.",
        cta: "Shop Now",
        ctaLink: "/shop",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=600&fit=crop"
      },
      {
        id: 2,
        title: "New Collection",
        subtitle: "Stretch & Comfort",
        description: "Experience our new stretch fabric scrubs with moisture-wicking technology for ultimate comfort.",
        cta: "Explore Collection",
        ctaLink: "/shop?category=stretch-scrubs",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=600&fit=crop"
      },
      {
        id: 3,
        title: "Complete Sets",
        subtitle: "Save Big",
        description: "Get matching scrub top and pants sets. Professional look, great value.",
        cta: "View Sets",
        ctaLink: "/shop?category=scrub-sets",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&h=600&fit=crop"
      }
    ];
    setHeroSlides(slides);
  };

  const fetchFeaturedProducts = async () => {
    // Fetch from view that includes ratings
    const { data: products } = await supabase
      .from('product_with_avg_rating')
      .select('*')
      .limit(8);

    if (products) {
      setFeaturedProducts(products as ProductWithRating[]);
      
      // Fetch images for products
      const productIds = products.map(p => p.id);
      const { data: images } = await supabase
        .from('product_images')
        .select('*')
        .in('product_id', productIds)
        .order('position', { ascending: true });

      if (images) {
        const imageMap: Record<string, string> = {};
        images.forEach((img: ProductImage) => {
          if (!imageMap[img.product_id]) {
            imageMap[img.product_id] = img.url;
          }
        });
        setProductImages(imageMap);
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <section className="relative overflow-hidden">
        <Carousel 
          className="w-full"
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
        >
          <CarouselContent>
            {heroSlides.map((slide) => (
              <CarouselItem key={slide.id}>
                <div 
                  className="relative h-[600px] bg-cover bg-center flex items-center"
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="relative container mx-auto px-4 text-center text-white">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl lg:text-3xl mb-6 text-blue-100">
                      {slide.subtitle}
                    </p>
                    <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-blue-50">
                      {slide.description}
                    </p>
                    <Link to={slide.ctaLink}>
                      <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                        {slide.cta}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </section>

      {/* Featured Categories */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-lg text-muted-foreground">
              Find exactly what you need for your medical profession
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {categories.map((category) => (
              <Link key={category.id} to={`/shop?category=${category.slug}`}>
                <Card className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center">
                      <span className="text-2xl">
                        {category.slug === 'scrub-tops' && '👕'}
                        {category.slug === 'scrub-pants' && '👖'}
                        {category.slug === 'lab-coats' && '🥼'}
                        {category.slug === 'scrub-sets' && '👔'}
                        {!['scrub-tops', 'scrub-pants', 'lab-coats', 'scrub-sets'].includes(category.slug) && '🏥'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-lg text-muted-foreground">
              Our most popular items loved by healthcare professionals
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                imageUrl={productImages[product.id]}
              />
            ))}
          </div>

          <div className="text-center">
            <Link to="/shop">
              <Button size="lg" variant="outline">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose CareWear</h2>
            <p className="text-lg text-muted-foreground">
              Premium quality medical wear trusted by professionals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-primary mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-muted-foreground">
                Durable, comfortable fabrics that last through countless shifts
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-primary mx-auto mb-4 flex items-center justify-center">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
              <p className="text-muted-foreground">
                Quick delivery so you're always ready for your next shift
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-primary mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Perfect Fit</h3>
              <p className="text-muted-foreground">
                Multiple sizes and styles to ensure you look and feel your best
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-primary mx-auto mb-4 flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">5-Star Rated</h3>
              <p className="text-muted-foreground">
                Trusted by thousands of healthcare professionals nationwide
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
