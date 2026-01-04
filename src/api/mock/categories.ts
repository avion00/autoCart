// ============================================
// AutoCart - Mock Categories Data
// ============================================

import { Category } from '../../types';

export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Smartphones',
    icon: 'smartphone',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    productCount: 156,
    description: 'Latest smartphones from top brands',
  },
  {
    id: 'cat-2',
    name: 'Audio',
    icon: 'headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    productCount: 89,
    description: 'Headphones, earbuds, and speakers',
  },
  {
    id: 'cat-3',
    name: 'Wearables',
    icon: 'watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    productCount: 67,
    description: 'Smartwatches and fitness trackers',
  },
  {
    id: 'cat-4',
    name: 'Laptops',
    icon: 'laptop',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    productCount: 124,
    description: 'Laptops for work and gaming',
  },
  {
    id: 'cat-5',
    name: 'Tablets',
    icon: 'tablet',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
    productCount: 45,
    description: 'Tablets for productivity and entertainment',
  },
  {
    id: 'cat-6',
    name: 'Fashion',
    icon: 'shopping-bag',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
    productCount: 312,
    description: 'Clothing, shoes, and accessories',
  },
  {
    id: 'cat-7',
    name: 'Gaming',
    icon: 'monitor',
    image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400',
    productCount: 98,
    description: 'Gaming consoles and accessories',
  },
  {
    id: 'cat-8',
    name: 'Home',
    icon: 'home',
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400',
    productCount: 234,
    description: 'Home appliances and decor',
  },
];

export default mockCategories;
