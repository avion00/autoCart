// ============================================
// AutoCart - Wishlist Store
// ============================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WishlistItem, Product } from '../types';

interface WishlistState {
  items: WishlistItem[];
  
  // Actions
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  toggleWishlist: (product: Product) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (product: Product) => {
        const { items } = get();
        if (items.some(item => item.productId === product.id)) {
          return;
        }
        
        const newItem: WishlistItem = {
          id: `wishlist-${Date.now()}`,
          productId: product.id,
          product,
          addedAt: new Date().toISOString(),
        };
        
        set({ items: [...items, newItem] });
      },

      removeFromWishlist: (productId: string) => {
        const { items } = get();
        set({ items: items.filter(item => item.productId !== productId) });
      },

      isInWishlist: (productId: string) => {
        const { items } = get();
        return items.some(item => item.productId === productId);
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      toggleWishlist: (product: Product) => {
        const { items, addToWishlist, removeFromWishlist } = get();
        if (items.some(item => item.productId === product.id)) {
          removeFromWishlist(product.id);
        } else {
          addToWishlist(product);
        }
      },
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
