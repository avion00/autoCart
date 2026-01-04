// ============================================
// AutoCart - Auth Store
// ============================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Address } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  addresses: Address[];
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id' | 'userId'>) => void;
  updateAddress: (id: string, data: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  clearError: () => void;
}

// Mock user
const mockUser: User = {
  id: 'user-1',
  email: 'john@example.com',
  name: 'John Doe',
  phone: '+1 234 567 8900',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
  isVendor: false,
  createdAt: '2024-01-01',
};

const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    userId: 'user-1',
    name: 'John Doe',
    phone: '+1 234 567 8900',
    addressLine1: '123 Main Street',
    addressLine2: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'USA',
    isDefault: true,
    type: 'home',
  },
  {
    id: 'addr-2',
    userId: 'user-1',
    name: 'John Doe',
    phone: '+1 234 567 8900',
    addressLine1: '456 Office Plaza',
    city: 'New York',
    state: 'NY',
    postalCode: '10002',
    country: 'USA',
    isDefault: false,
    type: 'work',
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      addresses: [],

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise<void>(resolve => setTimeout(resolve, 1000));
          
          // Mock validation
          if (email && password) {
            set({ 
              user: mockUser, 
              isAuthenticated: true, 
              addresses: mockAddresses,
              isLoading: false 
            });
            return true;
          }
          set({ isLoading: false, error: 'Invalid credentials' });
          return false;
        } catch (error) {
          set({ isLoading: false, error: 'Login failed. Please try again.' });
          return false;
        }
      },

      register: async (name: string, email: string, password: string, phone?: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise<void>(resolve => setTimeout(resolve, 1000));
          
          const newUser: User = {
            id: `user-${Date.now()}`,
            email,
            name,
            phone,
            isVendor: false,
            createdAt: new Date().toISOString(),
          };
          
          set({ 
            user: newUser, 
            isAuthenticated: true, 
            addresses: [],
            isLoading: false 
          });
          return true;
        } catch (error) {
          set({ isLoading: false, error: 'Registration failed. Please try again.' });
          return false;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          addresses: [] 
        });
      },

      updateProfile: (data: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...data } });
        }
      },

      addAddress: (address: Omit<Address, 'id' | 'userId'>) => {
        const { addresses, user } = get();
        const newAddress: Address = {
          ...address,
          id: `addr-${Date.now()}`,
          userId: user?.id || '',
        };
        
        // If this is the first address or marked as default, update others
        let updatedAddresses = addresses;
        if (newAddress.isDefault || addresses.length === 0) {
          updatedAddresses = addresses.map(a => ({ ...a, isDefault: false }));
          newAddress.isDefault = true;
        }
        
        set({ addresses: [...updatedAddresses, newAddress] });
      },

      updateAddress: (id: string, data: Partial<Address>) => {
        const { addresses } = get();
        set({
          addresses: addresses.map(addr =>
            addr.id === id ? { ...addr, ...data } : addr
          ),
        });
      },

      deleteAddress: (id: string) => {
        const { addresses } = get();
        const filtered = addresses.filter(addr => addr.id !== id);
        
        // If deleted address was default, make first one default
        if (filtered.length > 0 && !filtered.some(a => a.isDefault)) {
          filtered[0].isDefault = true;
        }
        
        set({ addresses: filtered });
      },

      setDefaultAddress: (id: string) => {
        const { addresses } = get();
        set({
          addresses: addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id,
          })),
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
