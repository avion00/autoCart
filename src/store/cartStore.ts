// ============================================
// AutoCart - Cart Store
// ============================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Product, Coupon } from '../types';

interface CartState {
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  appliedCoupon: Coupon | null;
  itemCount: number;
  
  // Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
}

const TAX_RATE = 0.08;
const FREE_DELIVERY_THRESHOLD = 50;
const DELIVERY_FEE = 5.99;

const calculateTotals = (items: CartItem[], coupon: Coupon | null) => {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  let discount = 0;
  if (coupon) {
    if (coupon.type === 'percentage') {
      discount = subtotal * (coupon.value / 100);
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = coupon.value;
    }
  }
  
  const afterDiscount = subtotal - discount;
  const deliveryFee = afterDiscount >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const tax = afterDiscount * TAX_RATE;
  const total = afterDiscount + deliveryFee + tax;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return { subtotal, discount, deliveryFee, tax, total, itemCount };
};

// Mock coupons
const mockCoupons: Coupon[] = [
  { id: '1', code: 'SAVE10', type: 'percentage', value: 10, minOrderValue: 50, validUntil: '2025-12-31' },
  { id: '2', code: 'FLAT20', type: 'fixed', value: 20, minOrderValue: 100, validUntil: '2025-12-31' },
  { id: '3', code: 'WELCOME', type: 'percentage', value: 15, maxDiscount: 30, validUntil: '2025-12-31' },
];

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      discount: 0,
      deliveryFee: 0,
      tax: 0,
      total: 0,
      appliedCoupon: null,
      itemCount: 0,

      addToCart: (product: Product, quantity = 1) => {
        const { items, appliedCoupon } = get();
        const existingItem = items.find(item => item.productId === product.id);
        
        let newItems: CartItem[];
        if (existingItem) {
          newItems = items.map(item =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          const newItem: CartItem = {
            id: `cart-${Date.now()}`,
            productId: product.id,
            product,
            quantity,
            addedAt: new Date().toISOString(),
          };
          newItems = [...items, newItem];
        }
        
        const totals = calculateTotals(newItems, appliedCoupon);
        set({ items: newItems, ...totals });
      },

      removeFromCart: (itemId: string) => {
        const { items, appliedCoupon } = get();
        const newItems = items.filter(item => item.id !== itemId);
        const totals = calculateTotals(newItems, appliedCoupon);
        set({ items: newItems, ...totals });
      },

      updateQuantity: (itemId: string, quantity: number) => {
        const { items, appliedCoupon } = get();
        if (quantity <= 0) {
          get().removeFromCart(itemId);
          return;
        }
        
        const newItems = items.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        );
        const totals = calculateTotals(newItems, appliedCoupon);
        set({ items: newItems, ...totals });
      },

      clearCart: () => {
        set({
          items: [],
          subtotal: 0,
          discount: 0,
          deliveryFee: 0,
          tax: 0,
          total: 0,
          appliedCoupon: null,
          itemCount: 0,
        });
      },

      applyCoupon: async (code: string) => {
        const { items, subtotal } = get();
        const coupon = mockCoupons.find(c => c.code.toUpperCase() === code.toUpperCase());
        
        if (!coupon) {
          return false;
        }
        
        if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
          return false;
        }
        
        const totals = calculateTotals(items, coupon);
        set({ appliedCoupon: coupon, ...totals });
        return true;
      },

      removeCoupon: () => {
        const { items } = get();
        const totals = calculateTotals(items, null);
        set({ appliedCoupon: null, ...totals });
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
