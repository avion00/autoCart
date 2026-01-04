// ============================================
// AutoCart - API Services
// ============================================

import { apiClient } from './client';
import { mockProducts, mockCategories, mockBanners } from './mock';

// Simulated API delay
const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

export const productService = {
  getAll: async () => {
    await delay(500);
    return mockProducts;
  },
  
  getById: async (id: string) => {
    await delay(300);
    return mockProducts.find(p => p.id === id);
  },
  
  getFeatured: async () => {
    await delay(300);
    return mockProducts.filter(p => p.isFeatured);
  },
  
  getByCategory: async (categoryId: string) => {
    await delay(400);
    return mockProducts.filter(p => p.categoryId === categoryId);
  },
  
  search: async (query: string) => {
    await delay(300);
    const lowerQuery = query.toLowerCase();
    return mockProducts.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
    );
  },
};

export const categoryService = {
  getAll: async () => {
    await delay(300);
    return mockCategories;
  },
  
  getById: async (id: string) => {
    await delay(200);
    return mockCategories.find(c => c.id === id);
  },
};

export const bannerService = {
  getAll: async () => {
    await delay(200);
    return mockBanners;
  },
};

export default {
  products: productService,
  categories: categoryService,
  banners: bannerService,
};
