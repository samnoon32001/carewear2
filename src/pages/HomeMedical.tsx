import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingBag, Heart, Shield, Truck, TrendingUp, Stethoscope, Activity, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedProductCard } from '@/components/AnimatedProductCard';
import { ProductWithRating, Category } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';
import { cn } from '@/lib/utils';

export default function HomeMedical() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductWithRating[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number>(0);
  const touchEnd = useRef<number>(0);

  // Hero slides with exact specifications
  const heroSlides = [
    {
      id: 1,
      heading: "Professional Scrubs for Everyday Care",
      subheading: "Designed for comfort, durability, and long shifts — scrubs that move with you and keep you looking professional all day.",
      cta: "Shop Scrubs",
      ctaLink: "/shop?category=scrub-tops",
      image: "https://i.pinimg.com/1200x/99/83/99/998399a687eb2755c4f35cc70a271631.jpg"
    },
    {
      id: 2,
      heading: "Lab Coats That Define Authority & Precision",
      subheading: "Sharp tailoring, breathable fabrics, and a refined professional look — ideal for doctors, researchers, and medical students.",
      cta: "Explore Lab Coats",
      ctaLink: "/shop?category=lab-coats",
      image: "https://i.pinimg.com/736x/14/1c/e1/141ce164ecc43a4862871aded11b8dc1.jpg"
    },
    {
      id: 3,
      heading: "Hospital Tunics Made for Comfort & Care",
      subheading: "Lightweight, practical, and thoughtfully designed tunics for healthcare professionals who value comfort throughout the day.",
      cta: "View Tunics",
      ctaLink: "/shop?category=tunics",
      image: "https://i.pinimg.com/1200x/8c/6a/84/8c6a8477651aba1ace84c25bea19e45e.jpg"
    }
  ];

  // Auto-slide functionality - Enhanced with 6 second timing
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 6000); // 6 seconds for better viewing experience
      return () => clearInterval(interval);
    }
  }, [isPaused, heroSlides.length]);

  // Preload images
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = heroSlides.map(slide => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = slide.image;
          img.onload = resolve;
        });
      });
      await Promise.all(imagePromises);
      setImagesLoaded(true);
    };
    preloadImages();
  }, [heroSlides]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
    fetchCategories();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      // Use mock data since Supabase table doesn't exist
      const mockProducts: ProductWithRating[] = [
        {
          id: '1',
          name: 'Premium Medical Scrub Top',
          slug: 'premium-medical-scrub-top',
          description: 'Professional medical-grade scrub top with moisture-wicking technology',
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
        },
        {
          id: '2',
          name: 'Comfortable Scrub Pants',
          slug: 'comfortable-scrub-pants',
          description: 'Medical scrub pants with elastic waist and multiple pockets',
          price: 34.99,
          stock: 20,
          category_id: '2',
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
          category_id: '3',
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
          category_id: '4',
          sku: 'MED-SET-001',
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Navy Blue', 'Royal Blue'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          avg_rating: 4.6,
          reviews_count: 15
        }
      ];
      
      setFeaturedProducts(mockProducts);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // Use mock data since Supabase table doesn't exist
      const mockCategories: Category[] = [
        { id: '1', name: 'Scrub Tops', slug: 'scrub-tops', description: 'Professional medical scrub tops', created_at: new Date().toISOString() },
        { id: '2', name: 'Scrub Pants', slug: 'scrub-pants', description: 'Comfortable medical scrub pants', created_at: new Date().toISOString() },
        { id: '3', name: 'Lab Coats', slug: 'lab-coats', description: 'Professional lab coats', created_at: new Date().toISOString() },
        { id: '4', name: 'Scrub Sets', slug: 'scrub-sets', description: 'Complete scrub sets', created_at: new Date().toISOString() },
        { id: '5', name: 'Medical Accessories', slug: 'accessories', description: 'Medical accessories', created_at: new Date().toISOString() },
        { id: '6', name: 'Nursing Shoes', slug: 'shoes', description: 'Comfortable nursing shoes', created_at: new Date().toISOString() }
      ];
      setCategories(mockCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const medicalCategories = [
    { name: "Scrub Tops", slug: "scrub-tops", icon: "👕", image: "https://images.unsplash.com/photo-1598302948767-d5d6b8b0a6a?w=400&h=300&fit=crop&auto=format" },
    { name: "Scrub Pants", slug: "scrub-pants", icon: "👖", image: "https://images.unsplash.com/photo-1578632294429-2d8e7f947d3?w=400&h=300&fit=crop&auto=format" },
    { name: "Lab Coats", slug: "lab-coats", icon: "🥼", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop&auto=format" },
    { name: "Scrub Sets", slug: "scrub-sets", icon: "👔", image: "https://images.unsplash.com/photo-1582750433442-72e5c06b1dc1?w=400&h=300&fit=crop&auto=format" },
    { name: "Medical Accessories", slug: "accessories", icon: "⚕️", image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&auto=format" },
    { name: "Nursing Shoes", slug: "shoes", icon: "👟", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop&auto=format" }
  ];

  const benefits = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Medical Grade",
      description: "Professional quality fabrics"
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Fast Shipping",
      description: "Quick delivery to hospitals"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Trusted by 10,000+",
      description: "Healthcare professionals"
    },
    {
      icon: <Activity className="h-6 w-6" />,
      title: "24/7 Support",
      description: "Always here to help"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Slider Section - 100vh height */}
      <section 
        ref={sliderRef}
        className="relative h-screen overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides */}
        <div className="relative h-full">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={cn(
                "absolute inset-0 transition-all duration-1500 ease-in-out",
                index === currentSlide 
                  ? "opacity-100 translate-x-0 scale-100" 
                  : index < currentSlide 
                    ? "opacity-0 -translate-x-full scale-95" 
                    : "opacity-0 translate-x-full scale-95"
              )}
            >
              {/* Background Image with Enhanced Lazy Loading and Responsive Handling */}
              <img
                src={slide.image}
                alt={`${slide.heading} - Medical Professional Uniform`}
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-1000",
                  imagesLoaded ? "opacity-100" : "opacity-0"
                )}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
                style={{
                  objectPosition: 'center',
                  objectFit: 'cover'
                }}
              />
              
              {/* Enhanced Gradient Overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
              
              {/* Content */}
              <div className={cn(
                "absolute inset-0 flex items-center justify-center text-white p-8",
                "md:text-center md:left-1/2 md:-translate-x-1/2 md:justify-center",
                "text-left left-8 justify-start",
                // Account for navbar height
                "pt-16"
              )}>
                <div className={cn(
                  "max-w-2xl space-y-6",
                  index === currentSlide && "animate-fade-in"
                )}>
                  {/* Heading - Enhanced entrance animation */}
                  <h1 className={cn(
                    "text-3xl md:text-5xl lg:text-6xl font-bold leading-tight",
                    "transition-all duration-1000 delay-100 transform",
                    index === currentSlide 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 translate-y-8"
                  )}>
                    {slide.heading}
                  </h1>
                  
                  {/* Subheading - Enhanced entrance animation */}
                  <p className={cn(
                    "text-lg md:text-xl lg:text-2xl opacity-90 leading-relaxed",
                    "transition-all duration-1000 delay-300 transform",
                    index === currentSlide 
                      ? "opacity-90 translate-y-0" 
                      : "opacity-0 translate-y-8"
                  )}>
                    {slide.subheading}
                  </p>
                  
                  {/* CTA Button - Enhanced entrance animation */}
                  <div className={cn(
                    "transition-all duration-1000 delay-500 transform",
                    index === currentSlide 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 translate-y-8"
                  )}>
                    <Link to={slide.ctaLink}>
                      <Button 
                        size="lg" 
                        className="bg-white text-blue-600 hover:bg-blue-50 group transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        {slide.cta}
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Navigation Arrows with hover animations */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 hover:scale-110 transition-all duration-300 z-10 group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-white transition-transform duration-300 group-hover:-translate-x-1" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 hover:scale-110 transition-all duration-300 z-10 group"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-white transition-transform duration-300 group-hover:translate-x-1" />
        </button>
        
        {/* Enhanced Slide Indicators with animations */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-10 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "transition-all duration-300 transform hover:scale-125",
                index === currentSlide
                  ? "bg-white w-4 h-4 shadow-lg scale-110" 
                  : "bg-white/50 hover:bg-white/70 w-3 h-3"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Medical Categories */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center mb-4">
              <Activity className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Medical Professional Categories</h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Premium scrubs and medical apparel for every healthcare professional
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicalCategories.map((category, index) => (
              <Link
                key={category.slug}
                to={`/shop?category=${category.slug}`}
                className={cn(
                  "group block animate-fade-in transform transition-all duration-300 hover:scale-105",
                  `animation-delay-${index * 100}`
                )}
              >
                <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-3xl mb-2">{category.icon}</div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Professional medical apparel
                    </p>
                    <div className="flex items-center text-blue-600 font-medium">
                      <span>Shop Now</span>
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container">
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center mb-4">
              <Star className="h-8 w-8 text-yellow-500 mr-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Medical Scrubs</h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our most popular medical scrubs and uniforms
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white rounded-xl h-80 shadow-lg" />
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
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white group transition-all duration-300 hover:scale-105">
                <ShoppingBag className="mr-2 h-5 w-5" />
                View All Medical Scrubs
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Healthcare Professionals Choose CareWear</h2>
            <p className="text-xl opacity-90">
              Trusted by thousands of medical professionals nationwide
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
                <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                  {benefit.icon}
                </div>
                <h3 className="font-bold text-xl mb-2 group-hover:text-yellow-300 transition-colors duration-200">
                  {benefit.title}
                </h3>
                <p className="opacity-90">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="container text-center">
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 mr-3" />
              <h2 className="text-3xl md:text-4xl font-bold">Join the CareWear Family</h2>
            </div>
            <p className="text-xl mb-8 opacity-90">
              Get exclusive offers and new medical scrub arrivals
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full text-gray-900 bg-white/95 placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-white/50 text-lg"
              />
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 transition-all duration-300 hover:scale-105"
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
