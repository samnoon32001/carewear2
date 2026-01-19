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
          reviews_count: 12,
          image: 'https://i.pinimg.com/1200x/8f/e7/2b/8fe72bdee892e273cdccb126873f4dd1.jpg'
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
          reviews_count: 18,
          image: 'https://i.pinimg.com/736x/e1/06/c7/e106c7ed7069abfcf81be804a991d957.jpg'
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
          reviews_count: 25,
          image: 'https://i.pinimg.com/736x/f2/7e/16/f27e16719210e9f53aaf45ad0a6ed7d6.jpg'
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
          reviews_count: 15,
          image: 'https://i.pinimg.com/736x/55/48/11/5548111fa7fe47268e6c0f910abc0a0d.jpg'
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
    { name: "Scrub Tops", slug: "scrub-tops", icon: "👕", image: "https://i.pinimg.com/1200x/8f/e7/2b/8fe72bdee892e273cdccb126873f4dd1.jpg" },
    { name: "Scrub Pants", slug: "scrub-pants", icon: "👖", image: "https://i.pinimg.com/736x/e1/06/c7/e106c7ed7069abfcf81be804a991d957.jpg" },
    { name: "Lab Coats", slug: "lab-coats", icon: "🥼", image: "https://i.pinimg.com/736x/f2/7e/16/f27e16719210e9f53aaf45ad0a6ed7d6.jpg" },
    { name: "Scrub Sets", slug: "scrub-sets", icon: "👔", image: "https://i.pinimg.com/736x/55/48/11/5548111fa7fe47268e6c0f910abc0a0d.jpg" },
    { name: "Medical Accessories", slug: "accessories", icon: "⚕️", image: "https://i.pinimg.com/736x/f8/68/a0/f868a050b44d9bcd83c63f449c650ce1.jpg" },
    { name: "Nursing Shoes", slug: "shoes", icon: "👟", image: "https://i.pinimg.com/1200x/d9/6d/10/d96d104dd8bae8db48c17808ec48213a.jpg" }
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
              
              {/* Content - Enhanced for all devices */}
              <div className={cn(
                "absolute inset-0 flex items-center justify-center text-white p-4 sm:p-6 lg:p-8",
                // Desktop: centered
                "lg:text-center lg:left-1/2 lg:-translate-x-1/2 lg:justify-center",
                // Tablet: centered with medium padding
                "md:text-center md:left-1/2 md:-translate-x-1/2 md:justify-center",
                // Mobile: left-aligned with smaller padding
                "sm:text-left sm:left-8 sm:justify-start",
                // Account for navbar height
                "pt-16"
              )}>
                <div className={cn(
                  "w-full max-w-4xl sm:max-w-3xl lg:max-w-5xl space-y-4 sm:space-y-6 lg:space-y-8",
                  index === currentSlide && "animate-fade-in"
                )}>
                  {/* Heading - Responsive sizes with enhanced entrance animation */}
                  <h1 className={cn(
                    "font-bold leading-tight transition-all duration-1000 delay-100 transform",
                    // Mobile: smaller text
                    "text-2xl sm:text-3xl lg:text-5xl xl:text-6xl",
                    index === currentSlide 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 translate-y-8"
                  )}>
                    {slide.heading}
                  </h1>
                  
                  {/* Subheading - Responsive sizes with enhanced entrance animation */}
                  <p className={cn(
                    "leading-relaxed transition-all duration-1000 delay-300 transform",
                    // Mobile: smaller text
                    "text-base sm:text-lg lg:text-xl xl:text-2xl opacity-90",
                    index === currentSlide 
                      ? "opacity-90 translate-y-0" 
                      : "opacity-0 translate-y-8"
                  )}>
                    {slide.subheading}
                  </p>
                  
                  {/* CTA Button - Enhanced entrance animation with responsive sizing */}
                  <div className={cn(
                    "transition-all duration-1000 delay-500 transform",
                    index === currentSlide 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 translate-y-8"
                  )}>
                    <Link to={slide.ctaLink}>
                      <Button 
                        size="lg" 
                        className="bg-white text-blue-600 hover:bg-blue-50 group transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                      >
                        {slide.cta}
                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Navigation Arrows with responsive hover animations */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 sm:p-3 hover:bg-white/30 hover:scale-110 transition-all duration-300 z-10 group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-white transition-transform duration-300 group-hover:-translate-x-1" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 sm:p-3 hover:bg-white/30 hover:scale-110 transition-all duration-300 z-10 group"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-white transition-transform duration-300 group-hover:translate-x-1" />
        </button>
        
        {/* Enhanced Slide Indicators with responsive animations */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 sm:gap-3 z-10 bg-black/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 sm:py-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "transition-all duration-300 transform hover:scale-125",
                index === currentSlide
                  ? "bg-white w-3 h-3 sm:w-4 sm:h-4 shadow-lg scale-110" 
                  : "bg-white/50 hover:bg-white/70 w-2 h-2 sm:w-3 sm:h-3"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Medical Categories - Enhanced responsive design */}
      <section className="pt-24 pb-16 bg-white">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in">
            <div className="flex items-center justify-center mb-4">
              <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mr-3" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Medical Professional Categories</h2>
            </div>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Premium scrubs and medical apparel for every healthcare professional
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent" />
                    <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 text-white">
                      <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{category.icon}</div>
                    </div>
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    <h3 className="font-bold text-lg sm:text-xl mb-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
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

      {/* Featured Products - Enhanced responsive design */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in">
            <div className="flex items-center justify-center mb-4">
              <Star className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 mr-3" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Featured Medical Scrubs</h2>
            </div>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Our most popular medical scrubs and uniforms
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white rounded-xl h-64 sm:h-80 shadow-lg" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
          
          <div className="text-center mt-8 sm:mt-12 animate-fade-in">
            <Link to="/shop">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white group transition-all duration-300 hover:scale-105 px-6 sm:px-8">
                <ShoppingBag className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">View All Medical Scrubs</span>
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators - Enhanced responsive design */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-teal-50 to-white">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Why Healthcare Professionals Choose CareWear</h2>
            <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto">
              Trusted by thousands of medical professionals nationwide for premium quality and comfort
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={cn(
                  "text-center group animate-fade-in bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2",
                  `animation-delay-${index * 150}`
                )}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-gradient-to-r from-blue-100 to-teal-100 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:from-blue-600 group-hover:to-teal-600">
                  <div className="text-blue-600 group-hover:text-white transition-colors duration-300">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="font-bold text-lg sm:text-xl mb-2 text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section - Enhanced responsive design */}
      <section className="pt-24 pb-16 bg-gradient-to-r from-blue-600 to-teal-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Ccircle cx='30' cy='30' r='2' fill='white' opacity='0.3'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>
        
        <div className="container px-4 sm:px-6 text-center relative z-10">
          <div className="max-w-2xl sm:max-w-3xl mx-auto animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Join the CareWear Family</h2>
            <p className="text-base sm:text-lg mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto">
              Get exclusive offers, new medical scrub arrivals, and professional healthcare insights
            </p>
            <form className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 sm:px-6 sm:py-4 rounded-full text-gray-900 bg-white/95 backdrop-blur-sm placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-white/50 text-base sm:text-lg border-2 border-transparent focus:border-white transition-all duration-300"
              />
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-6 sm:px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Subscribe</span>
                <span className="sm:hidden">Join Now</span>
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </form>
            <p className="text-sm sm:text-base opacity-75 mt-4">
              Join 10,000+ healthcare professionals. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
