import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity: number, size?: string, color?: string) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity, size, color) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          item => 
            item.product.id === product.id && 
            item.selected_size === size && 
            item.selected_color === color
        );

        if (existingIndex > -1) {
          const newItems = [...items];
          newItems[existingIndex].quantity += quantity;
          set({ items: newItems });
        } else {
          set({
            items: [...items, { product, quantity, selected_size: size, selected_color: color }]
          });
        }
      },

      removeItem: (productId, size, color) => {
        set({
          items: get().items.filter(
            item => 
              !(item.product.id === productId && 
                item.selected_size === size && 
                item.selected_color === color)
          )
        });
      },

      updateQuantity: (productId, quantity, size, color) => {
        const items = get().items;
        const itemIndex = items.findIndex(
          item => 
            item.product.id === productId && 
            item.selected_size === size && 
            item.selected_color === color
        );

        if (itemIndex > -1) {
          const newItems = [...items];
          if (quantity <= 0) {
            newItems.splice(itemIndex, 1);
          } else {
            newItems[itemIndex].quantity = quantity;
          }
          set({ items: newItems });
        }
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'carewear-cart',
    }
  )
);
