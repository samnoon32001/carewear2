import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/store/cart';
import { formatCurrency } from '@/utils/formatCurrency';

export default function Cart() {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <Link to="/shop"><Button>Continue Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={`${item.product.id}-${item.selected_size}-${item.selected_color}`} className="flex gap-4 p-4 border rounded-lg">
              <div className="w-24 h-24 bg-muted rounded"></div>
              <div className="flex-1">
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.selected_size && `Size: ${item.selected_size}`}
                  {item.selected_color && ` • Color: ${item.selected_color}`}
                </p>
                <p className="font-bold mt-2">{formatCurrency(item.product.price)}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.product.id, item.selected_size, item.selected_color)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value), item.selected_size, item.selected_color)}
                  className="w-20"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(getTotalPrice())}</span></div>
              <div className="flex justify-between text-xl font-bold pt-4 border-t"><span>Total</span><span>{formatCurrency(getTotalPrice())}</span></div>
            </div>
            <Link to="/checkout"><Button className="w-full" size="lg">Proceed to Checkout</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
