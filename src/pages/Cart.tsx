import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/store/cart';
import { formatCurrency } from '@/utils/formatCurrency';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function Cart() {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems, clearCart } = useCart();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const handleQuantityChange = async (productId: string, newQuantity: number, size?: string, color?: string) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(`${productId}-${size}-${color}`);
    try {
      await updateQuantity(productId, newQuantity, size, color);
      toast({ title: 'Cart updated', duration: 1000 });
    } catch (error) {
      toast({ title: 'Error updating cart', variant: 'destructive' });
    }
    setIsUpdating(null);
  };

  const handleRemoveItem = async (productId: string, size?: string, color?: string) => {
    try {
      await removeItem(productId, size, color);
      toast({ title: 'Item removed from cart', duration: 2000 });
    } catch (error) {
      toast({ title: 'Error removing item', variant: 'destructive' });
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast({ title: 'Cart cleared', duration: 2000 });
    } catch (error) {
      toast({ title: 'Error clearing cart', variant: 'destructive' });
    }
  };
  
  const subtotal = getTotalPrice();
  const shipping = subtotal > 75 ? 0 : 9.99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="container py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <div className="space-y-4">
            <Link to="/shop">
              <Button size="lg" className="w-full sm:w-auto">
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Or browse our popular categories:</p>
              <div className="flex flex-wrap justify-center gap-2">
                <Link to="/shop?category=scrub-tops">
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                    Scrub Tops
                  </Badge>
                </Link>
                <Link to="/shop?category=scrub-pants">
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                    Scrub Pants
                  </Badge>
                </Link>
                <Link to="/shop?category=lab-coats">
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                    Lab Coats
                  </Badge>
                </Link>
                <Link to="/shop?category=scrub-sets">
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                    Scrub Sets
                  </Badge>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        {items.length > 0 && (
          <Button variant="outline" onClick={handleClearCart}>
            Clear Cart
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={`${item.product.id}-${item.selected_size}-${item.selected_color}`}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src="/placeholder.svg"
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1">{item.product.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {item.selected_size && (
                        <Badge variant="secondary">Size: {item.selected_size}</Badge>
                      )}
                      {item.selected_color && (
                        <Badge variant="secondary">Color: {item.selected_color}</Badge>
                      )}
                    </div>
                    <p className="text-lg font-bold text-primary">
                      {formatCurrency(item.product.price)}
                    </p>
                    {item.product.stock < item.quantity && (
                      <p className="text-sm text-red-600 mt-1">
                        Only {item.product.stock} available
                      </p>
                    )}
                  </div>
                  
                  {/* Quantity & Remove */}
                  <div className="flex flex-col items-end gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(item.product.id, item.selected_size, item.selected_color)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1, item.selected_size, item.selected_color)}
                        disabled={item.quantity <= 1 || isUpdating === `${item.product.id}-${item.selected_size}-${item.selected_color}`}
                        className="h-8 w-8"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      
                      <div className="w-12 text-center font-medium">
                        {isUpdating === `${item.product.id}-${item.selected_size}-${item.selected_color}` ? '...' : item.quantity}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1, item.selected_size, item.selected_color)}
                        disabled={item.quantity >= item.product.stock || isUpdating === `${item.product.id}-${item.selected_size}-${item.selected_color}`}
                        className="h-8 w-8"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Continue Shopping */}
          <div className="pt-4">
            <Link to="/shop">
              <Button variant="outline">
                <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({getTotalItems()} items)</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    {shipping === 0 ? (
                      <span className="text-green-600 font-medium">FREE</span>
                    ) : (
                      <span>{formatCurrency(shipping)}</span>
                    )}
                  </div>
                  
                  {shipping > 0 && (
                    <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                      Add {formatCurrency(75 - subtotal)} more for free shipping!
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(total)}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Link to="/checkout">
                    <Button size="lg" className="w-full" disabled={items.some(item => item.product.stock < item.quantity)}>
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  
                  {items.some(item => item.product.stock < item.quantity) && (
                    <p className="text-sm text-red-600 text-center">
                      Please update quantities for items with limited stock
                    </p>
                  )}
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-500" />
                      <span>Secure checkout powered by industry-standard encryption</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500" />
                      <span>30-day return policy on all items</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-purple-500" />
                      <span>Customer support available 24/7</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Trust Badges */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="text-center p-2 border rounded">
                <div className="text-xs font-medium">SSL</div>
                <div className="text-xs text-muted-foreground">Secure</div>
              </div>
              <div className="text-center p-2 border rounded">
                <div className="text-xs font-medium">Fast</div>
                <div className="text-xs text-muted-foreground">Shipping</div>
              </div>
              <div className="text-center p-2 border rounded">
                <div className="text-xs font-medium">Easy</div>
                <div className="text-xs text-muted-foreground">Returns</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
