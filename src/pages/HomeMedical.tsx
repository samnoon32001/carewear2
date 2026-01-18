import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingBag, Heart, Shield, Truck, TrendingUp, Stethoscope, Activity, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedProductCard } from '@/components/AnimatedProductCard';
import { ProductWithRating, Category } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/utils/formatCurrency';
import { cn } from '@/lib/utils';

export default function HomeMedical() {
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
      image: "https://images.unsplash.com/photo-1559839734-f1b5cf18eba7?w=1200&h=600&fit=crop&auto=format",
      cta: "Shop Collection",
      ctaLink: "/shop"
    },
    {
      id: 2,
      title: "Modern Lab Coats",
      subtitle: "Style meets functionality in every detail",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=600&fit=crop&auto=format",
      cta: "Explore Lab Wear",
      ctaLink: "/shop?category=lab-coats"
    },
    {
      id: 3,
      title: "Complete Scrub Sets",
      subtitle: "Everything you need for your shift",
      image: "https://images.unsplash.com/photo-1582750433442-72e5c06b1dc1?w=1200&h=600&fit=crop&auto=format",
      cta: "View Sets",
      ctaLink: "/shop?category=scrub-sets"
    }
  ];

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
      {/* Hero Section with Medical Theme */}
      <section className="relative h-[600px] overflow-hidden">
        {/* Medical Pattern Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-600 opacity-90" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white/20 rounded-full" />
          <div className="absolute top-20 right-20 w-24 h-24 border-4 border-white/20 rounded-full" />
          <div className="absolute bottom-10 left-1/4 w-16 h-16 border-4 border-white/20 rounded-full" />
        </div>

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
                className="w-full h-full object-cover mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center text-center text-white p-8">
                <div className="max-w-2xl animate-fade-in">
                  <div className="flex items-center justify-center mb-4">
                    <Stethoscope className="h-12 w-12 mr-3" />
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                      {slide.title}
                    </h1>
                  </div>
                  <p className="text-xl md:text-2xl mb-8 opacity-90">
                    {slide.subtitle}
                  </p>
                  <Link to={slide.ctaLink}>
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 group transition-all duration-300 hover:scale-105">
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
