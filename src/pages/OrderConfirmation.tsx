import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderItem } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (orderError) throw orderError;

        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', orderId);

        if (itemsError) throw itemsError;

        setOrder(orderData as Order);
        setOrderItems(itemsData as OrderItem[]);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Order not found</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Order Number</p>
                <p className="font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Status</p>
                <p className="capitalize">{order.status}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Total Amount</p>
                <p className="font-bold text-lg">{formatCurrency(order.total_amount)}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Order Date</p>
                <p>{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            {order.shipping_address && (
              <div className="pt-4 border-t">
                <p className="font-medium mb-2">Shipping Address</p>
                <p className="text-sm text-muted-foreground">
                  {order.shipping_address.street}<br />
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}<br />
                  {order.shipping_address.country}
                </p>
                {order.phone && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Phone: {order.phone}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderItems.map((item) => (
              <div key={item.id} className="flex justify-between items-start pb-4 border-b last:border-0">
                <div>
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.selected_size && `Size: ${item.selected_size}`}
                    {item.selected_size && item.selected_color && ' | '}
                    {item.selected_color && `Color: ${item.selected_color}`}
                  </p>
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                </div>
                <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="mt-8 text-center space-x-4">
          <Button asChild>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard">View My Orders</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
