import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types/product';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

interface WishlistStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const calculateTotals = (items: CartItem[]) => ({
  total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
});

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,
      addItem: (product) => {
        if (!product.in_stock) return;
        
        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id);
        
        let newItems;
        if (existingItem) {
          newItems = items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          newItems = [...items, { ...product, quantity: 1 }];
        }
        set({ items: newItems, ...calculateTotals(newItems) });
      },
      removeItem: (productId) => {
        const newItems = get().items.filter((item) => item.id !== productId);
        set({ items: newItems, ...calculateTotals(newItems) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        const newItems = get().items.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        );
        set({ items: newItems, ...calculateTotals(newItems) });
      },
      clearCart: () => set({ items: [], total: 0, itemCount: 0 }),
    }),
    {
      name: 'cart-storage',
    }
  )
);

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const items = get().items;
        if (!items.find((item) => item.id === product.id)) {
          set({ items: [...items, product] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
      },
      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
