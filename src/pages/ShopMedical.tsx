import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, X, Grid, List, SlidersHorizontal, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ProductCardMedical } from '@/components/ProductCardMedical';
import { ProductWithRating, Category } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

export default function ShopMedical() {
  const [products, setProducts] = useState<ProductWithRating[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [searchQuery, selectedCategory, priceRange, selectedSizes, selectedColors, inStockOnly, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
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
        },
        {
          id: '5',
          name: 'Medical Scrub Jacket',
          slug: 'medical-scrub-jacket',
          description: 'Warm medical scrub jacket for cold environments',
          price: 39.99,
          stock: 12,
          category_id: '5',
          sku: 'MED-JKT-001',
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Navy Blue', 'Black'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          avg_rating: 4.4,
          reviews_count: 8
        },
        {
          id: '6',
          name: 'Nursing Clogs',
          slug: 'nursing-clogs',
          description: 'Comfortable nursing clogs with slip-resistant soles',
          price: 44.99,
          stock: 25,
          category_id: '6',
          sku: 'MED-SHOE-001',
          sizes: ['6', '7', '8', '9', '10'],
          colors: ['White', 'Black'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          avg_rating: 4.9,
          reviews_count: 32
        }
      ];

      let filteredProducts = mockProducts;
      
      // Apply filters
      if (searchQuery) {
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      if (selectedCategory && selectedCategory !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category_id === selectedCategory);
      }
      filteredProducts = filteredProducts.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
      if (inStockOnly) {
        filteredProducts = filteredProducts.filter(p => p.stock > 0);
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          filteredProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
        case 'price-low':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.avg_rating - a.avg_rating);
          break;
      }
      
      // Client-side filtering for sizes and colors
      if (selectedSizes.length > 0) {
        filteredProducts = filteredProducts.filter(p => 
          p.sizes.some(size => selectedSizes.includes(size))
        );
      }
      if (selectedColors.length > 0) {
        filteredProducts = filteredProducts.filter(p => 
          p.colors.some(color => selectedColors.includes(color))
        );
      }
      
      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
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

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRange([0, 200]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setInStockOnly(false);
    setSortBy('newest');
  };

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const availableColors = ['Navy Blue', 'Royal Blue', 'Ceil Blue', 'White', 'Black', 'Gray'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-blue-100 z-40 shadow-sm">
        <div className="container py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600" />
              <Input
                placeholder="Search medical scrubs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-blue-200 focus:border-blue-500"
              />
            </div>

            {/* Filters Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden border-blue-200 hover:bg-blue-50"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 border-blue-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-blue-600' : 'border-blue-200 hover:bg-blue-50'}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-blue-600' : 'border-blue-200 hover:bg-blue-50'}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={cn(
            "w-64 flex-shrink-0 space-y-6",
            showFilters ? "block lg:block" : "hidden lg:block"
          )}>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg text-gray-900 flex items-center">
                  <Filter className="mr-2 h-5 w-5 text-blue-600" />
                  Filters
                </h3>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-blue-600 hover:bg-blue-50">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 text-gray-900">Category</h4>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="border-blue-200">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 text-gray-900">Price Range</h4>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={200}
                  step={10}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              {/* Size Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 text-gray-900">Size</h4>
                <div className="space-y-2">
                  {availableSizes.map((size) => (
                    <label key={size} className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedSizes.includes(size)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSizes([...selectedSizes, size]);
                          } else {
                            setSelectedSizes(selectedSizes.filter(s => s !== size));
                          }
                        }}
                        className="rounded border-blue-200 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 text-gray-900">Color</h4>
                <div className="space-y-2">
                  {availableColors.map((color) => (
                    <label key={color} className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedColors.includes(color)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedColors([...selectedColors, color]);
                          } else {
                            setSelectedColors(selectedColors.filter(c => c !== color));
                          }
                        }}
                        className="rounded border-blue-200 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{color}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Stock Filter */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded border-blue-200 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">In Stock Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {products.length} medical scrubs found
              </p>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-700">
                  Medical Grade
                </Badge>
                <Badge className="bg-green-100 text-green-700">
                  Professional Quality
                </Badge>
              </div>
            </div>

            {loading ? (
              <div className={cn(
                "grid gap-6",
                viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"
              )}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-white rounded-xl h-80 shadow-lg" />
                  </div>
                ))}
              </div>
            ) : (
              <div className={cn(
                "grid gap-6",
                viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"
              )}>
                {products.map((product) => (
                  <ProductCardMedical key={product.id} product={product} />
                ))}
              </div>
            )}

            {!loading && products.length === 0 && (
              <div className="text-center py-12">
                <div className="mb-4">
                  <Filter className="h-12 w-12 text-gray-400 mx-auto" />
                </div>
                <p className="text-gray-600 mb-4">No medical scrubs found matching your criteria.</p>
                <Button onClick={clearFilters} className="bg-blue-600 hover:bg-blue-700">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
