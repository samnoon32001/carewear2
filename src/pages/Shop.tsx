import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { ProductCard } from '@/components/ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { ProductWithRating, ProductImage, Category } from '@/types';
import { Search, Filter, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<ProductWithRating[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productImages, setProductImages] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery, sortBy, priceRange, selectedSizes, selectedColors, inStockOnly]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (data) setCategories(data);
  };

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase
      .from('product_with_avg_rating')
      .select('*');

    // Category filter
    if (selectedCategory !== 'all') {
      const category = categories.find(c => c.slug === selectedCategory);
      if (category) {
        query = query.eq('category_id', category.id);
      }
    }

    // Search filter
    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`);
    }

    // Price filter
    query = query.gte('price', priceRange[0]).lte('price', priceRange[1]);

    // Stock filter
    if (inStockOnly) {
      query = query.gt('stock', 0);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        query = query.order('price', { ascending: true });
        break;
      case 'price-high':
        query = query.order('price', { ascending: false });
        break;
      case 'popular':
        query = query.order('avg_rating', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    const { data: products } = await query;

    if (products) {
      // Client-side filtering for sizes and colors
      let filteredProducts = products as ProductWithRating[];
      
      if (selectedSizes.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
          product.sizes.some(size => selectedSizes.includes(size))
        );
      }
      
      if (selectedColors.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
          product.colors.some(color => selectedColors.includes(color))
        );
      }
      
      setProducts(filteredProducts);
      
      // Fetch images for products
      const productIds = filteredProducts.map(p => p.id);
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
    setLoading(false);
  };

  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
  const allColors = ['Navy', 'Black', 'White', 'Ceil Blue', 'Royal Blue', 'Teal', 'Wine', 'Caribbean Blue', 'Charcoal', 'Hunter Green', 'Pewter'];

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([0, 200]);
    setInStockOnly(false);
    setSortBy('newest');
  };

  const activeFiltersCount = selectedSizes.length + selectedColors.length + (inStockOnly ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < 200 ? 1 : 0);

  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            max={200}
            step={5}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Size</h3>
        <div className="grid grid-cols-3 gap-2">
          {allSizes.map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox
                id={`size-${size}`}
                checked={selectedSizes.includes(size)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedSizes([...selectedSizes, size]);
                  } else {
                    setSelectedSizes(selectedSizes.filter(s => s !== size));
                  }
                }}
              />
              <label htmlFor={`size-${size}`} className="text-sm">
                {size}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Color</h3>
        <div className="grid grid-cols-2 gap-2">
          {allColors.map((color) => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color}`}
                checked={selectedColors.includes(color)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedColors([...selectedColors, color]);
                  } else {
                    setSelectedColors(selectedColors.filter(c => c !== color));
                  }
                }}
              />
              <label htmlFor={`color-${color}`} className="text-sm">
                {color}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="in-stock"
          checked={inStockOnly}
          onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
        />
        <label htmlFor="in-stock" className="text-sm">
          In Stock Only
        </label>
      </div>

      <Button onClick={clearFilters} variant="outline" className="w-full">
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="container py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar - Desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                {activeFiltersCount > 0 && (
                  <Button onClick={clearFilters} variant="ghost" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <FiltersContent />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Shop All Products</h1>
            
            {/* Search and Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>

                {/* Mobile Filters */}
                <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden">
                      <Filter className="h-4 w-4" />
                      {activeFiltersCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                          {activeFiltersCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FiltersContent />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedSizes.map((size) => (
                  <Button
                    key={size}
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedSizes(selectedSizes.filter(s => s !== size))}
                    className="h-6"
                  >
                    {size}
                    <X className="h-3 w-3 ml-1" />
                  </Button>
                ))}
                {selectedColors.map((color) => (
                  <Button
                    key={color}
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedColors(selectedColors.filter(c => c !== color))}
                    className="h-6"
                  >
                    {color}
                    <X className="h-3 w-3 ml-1" />
                  </Button>
                ))}
                {inStockOnly && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setInStockOnly(false)}
                    className="h-6"
                  >
                    In Stock
                    <X className="h-3 w-3 ml-1" />
                  </Button>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 200) && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPriceRange([0, 200])}
                    className="h-6"
                  >
                    ${priceRange[0]} - ${priceRange[1]}
                    <X className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </div>
            )}

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              {loading ? 'Loading...' : `${products.length} products found`}
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-lg mb-4" />
                  <div className="bg-gray-200 h-4 rounded mb-2" />
                  <div className="bg-gray-200 h-4 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">No products found</p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  imageUrl={productImages[product.id]}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
