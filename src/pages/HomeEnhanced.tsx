import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingBag, Heart, Shield, Truck, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedProductCard } from '@/components/AnimatedProductCard';
import { ProductWithRating, Category } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/utils/formatCurrency';
import { cn } from '@/lib/utils';

export default function HomeEnhanced() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductWithRating[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchCategories();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data } = await supabase
        .from('product_with_avg_rating')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (data) {
        setFeaturedProducts(data as ProductWithRating[]);
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (data) {
        setCategories(data as Category[]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 3);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 3) % 3);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const heroSlides = [
    {
      id: 1,
      title: "Premium Medical Scrubs",
      subtitle: "Professional comfort for healthcare heroes",
      image: "https://images.unsplash.com/photo-1551698638-436643e3e9a5?w=1200&h=600&fit=crop",
      cta: "Shop Collection",
      ctaLink: "/shop"
    },
    {
      id: 2,
      title: "Modern Lab Coats",
      subtitle: "Style meets functionality in every detail",
      image: "https://images.unsplash.com/photo-1598302948767-d5d6b8b0a6a?w=1200&h=600&fit=crop",
      cta: "Explore Lab Wear",
      ctaLink: "/shop?category=lab-coats"
    },
    {
      id: 3,
      title: "Complete Scrub Sets",
      subtitle: "Everything you need for your shift",
      image: "https://images.unsplash.com/photo-1578632294429-2d8e7f947d3?w=1200&h=600&fit=crop",
      cta: "View Sets",
      ctaLink: "/shop?category=scrub-sets"
    }
  ];

  const categoryIcons = {
    'scrub-tops': '👕',
    'scrub-pants': '👖',
    'lab-coats': '🥼',
    'scrub-sets': '👔',
    'accessories': '⚕️',
  };

  const benefits = [
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Free Shipping",
      description: "On orders over $75"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Payment",
      description: "100% secure transactions"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Premium Quality",
      description: "Medical-grade fabrics"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "30-Day Returns",
      description: "Hassle-free returns"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Slider */}
      <section className="relative h-[600px] overflow-hidden">
        {/* Slides */}
        <div className="relative h-full">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                index === currentSlide ? "opacity-100" : "opacity-0"
              )}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center text-center text-white p-8">
                <div className="max-w-2xl animate-fade-in">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 opacity-90">
                    {slide.subtitle}
                  </p>
                  <Link to={slide.ctaLink}>
                    <Button size="lg" className="group transition-all duration-300 hover:scale-105 active:scale-95">
                      {slide.cta}
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-10">
          <button
            onClick={prevSlide}
            className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7 7" />
            </svg>
          </button>
          
          <div className="flex gap-2">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-200",
                  index === currentSlide
                    ? "bg-white w-4 h-4"
                    : "bg-white/50 hover:bg-white/70 w-3 h-3"
                )}
              />
            ))}
          </div>
          
          <button
            onClick={nextSlide}
            className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find exactly what you need for your healthcare profession
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/shop?category=${category.slug}`}
                className={cn(
                  "group block animate-fade-in",
                  `animation-delay-${index * 100}`
                )}
              >
                <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110">
                      {categoryIcons[category.slug as keyof typeof categoryIcons] || '🛍️'}
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors duration-200">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {category.description || 'Professional medical apparel'}
                    </p>
                    <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm font-medium text-primary">
                        Shop Now
                      </span>
                      <ArrowRight className="ml-1 h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our most popular medical scrubs and uniforms
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white rounded-xl h-80" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={cn(
                    "animate-fade-in",
                    `animation-delay-${index * 100}`
                  )}
                >
                  <AnimatedProductCard product={product} />
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12 animate-fade-in">
            <Link to="/shop">
              <Button size="lg" className="group transition-all duration-300 hover:scale-105 active:scale-95">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose CareWear?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Premium quality medical apparel with unmatched comfort and style
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={cn(
                  "text-center group animate-fade-in",
                  `animation-delay-${index * 150}`
                )}
              >
                <div className="w-16 h-16 mx-auto mb-4 text-primary transition-transform duration-300 group-hover:scale-110">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors duration-200">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <div className="max-w-2xl mx-auto animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-8 opacity-90">
              Get the latest updates on new products and exclusive offers
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-foreground bg-primary-foreground/10 border border-primary-foreground/20 placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
              />
              <Button 
                size="lg" 
                variant="secondary"
                className="transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
