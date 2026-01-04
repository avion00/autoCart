// ============================================
// AutoCart - Product Store
// ============================================

import { create } from 'zustand';
import { Product, Category, Banner } from '../types';

interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  dealProducts: Product[];
  trendingProducts: Product[];
  newArrivals: Product[];
  topRatedProducts: Product[];
  recentlyViewed: Product[];
  categories: Category[];
  banners: Banner[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchProducts: () => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  fetchDealProducts: () => Promise<void>;
  fetchTrendingProducts: () => Promise<void>;
  fetchNewArrivals: () => Promise<void>;
  fetchTopRatedProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchBanners: () => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  addToRecentlyViewed: (product: Product) => void;
  searchProducts: (query: string) => void;
  filterByCategory: (categoryId: string) => void;
  clearError: () => void;
}

// Mock products data - Extended with more products
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    description: 'The most powerful iPhone ever with A17 Pro chip, titanium design, and advanced camera system.',
    shortDescription: 'Latest iPhone with A17 Pro chip',
    price: 1199,
    originalPrice: 1299,
    discount: 8,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
    categoryId: '1',
    vendorId: 'v1',
    vendor: { id: 'v1', name: 'Apple Store', rating: 4.9, reviewCount: 15420 },
    rating: 4.8,
    reviewCount: 2341,
    stock: 50,
    sku: 'IPH15PM-256',
    tags: ['smartphone', 'apple', 'iphone', 'premium'],
    isAutoCartPlus: true,
    deliveryDays: 2,
    returnPolicy: '14 days return',
    warranty: '1 year',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Ultimate Galaxy experience with S Pen, AI features, and 200MP camera.',
    shortDescription: 'Flagship Samsung with AI features',
    price: 1099,
    originalPrice: 1199,
    discount: 8,
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
    categoryId: '1',
    vendorId: 'v2',
    vendor: { id: 'v2', name: 'Samsung Official', rating: 4.8, reviewCount: 12300 },
    rating: 4.7,
    reviewCount: 1892,
    stock: 35,
    sku: 'SGS24U-256',
    tags: ['smartphone', 'samsung', 'galaxy', 'android'],
    isAutoCartPlus: true,
    deliveryDays: 2,
    returnPolicy: '14 days return',
    warranty: '1 year',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-15',
  },
  {
    id: '3',
    name: 'MacBook Pro 16" M3 Max',
    description: 'Supercharged by M3 Max chip for unprecedented performance.',
    shortDescription: 'Most powerful MacBook ever',
    price: 2499,
    originalPrice: 2699,
    discount: 7,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    categoryId: '1',
    vendorId: 'v1',
    vendor: { id: 'v1', name: 'Apple Store', rating: 4.9, reviewCount: 15420 },
    rating: 4.9,
    reviewCount: 856,
    stock: 20,
    sku: 'MBP16M3-512',
    tags: ['laptop', 'apple', 'macbook', 'premium'],
    isAutoCartPlus: true,
    deliveryDays: 3,
    returnPolicy: '14 days return',
    warranty: '1 year',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15',
  },
  {
    id: '4',
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise cancellation with exceptional sound quality.',
    shortDescription: 'Premium noise-cancelling headphones',
    price: 349,
    originalPrice: 399,
    discount: 13,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    categoryId: '1',
    vendorId: 'v3',
    vendor: { id: 'v3', name: 'Sony Store', rating: 4.7, reviewCount: 8900 },
    rating: 4.8,
    reviewCount: 3421,
    stock: 100,
    sku: 'SNYWH1000XM5',
    tags: ['headphones', 'sony', 'audio', 'wireless'],
    isAutoCartPlus: true,
    deliveryDays: 2,
    returnPolicy: '30 days return',
    warranty: '2 years',
    createdAt: '2024-01-02',
    updatedAt: '2024-01-15',
  },
  {
    id: '5',
    name: 'Nike Air Max 270',
    description: 'Iconic style meets all-day comfort with Max Air cushioning.',
    shortDescription: 'Classic Nike sneakers',
    price: 150,
    originalPrice: 180,
    discount: 17,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    categoryId: '2',
    vendorId: 'v4',
    vendor: { id: 'v4', name: 'Nike Official', rating: 4.8, reviewCount: 25000 },
    rating: 4.6,
    reviewCount: 5678,
    stock: 200,
    sku: 'NKAM270-BLK',
    tags: ['shoes', 'nike', 'sneakers', 'sports'],
    isAutoCartPlus: true,
    deliveryDays: 3,
    returnPolicy: '30 days return',
    warranty: '6 months',
    createdAt: '2024-01-03',
    updatedAt: '2024-01-15',
  },
  {
    id: '6',
    name: 'Apple Watch Ultra 2',
    description: 'The most rugged and capable Apple Watch for extreme adventures.',
    shortDescription: 'Adventure-ready smartwatch',
    price: 799,
    originalPrice: 849,
    discount: 6,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    categoryId: '1',
    vendorId: 'v1',
    vendor: { id: 'v1', name: 'Apple Store', rating: 4.9, reviewCount: 15420 },
    rating: 4.9,
    reviewCount: 1234,
    stock: 45,
    sku: 'AWULTRA2-49',
    tags: ['watch', 'apple', 'smartwatch', 'fitness'],
    isAutoCartPlus: true,
    deliveryDays: 2,
    returnPolicy: '14 days return',
    warranty: '1 year',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-15',
  },
  {
    id: '7',
    name: 'Dyson V15 Detect',
    description: 'Powerful cordless vacuum with laser dust detection technology.',
    shortDescription: 'Smart cordless vacuum',
    price: 649,
    originalPrice: 749,
    discount: 13,
    images: [
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400',
    categoryId: '3',
    vendorId: 'v5',
    vendor: { id: 'v5', name: 'Dyson Official', rating: 4.8, reviewCount: 9800 },
    rating: 4.7,
    reviewCount: 2156,
    stock: 30,
    sku: 'DYSNV15-DET',
    tags: ['vacuum', 'dyson', 'home', 'cleaning'],
    isAutoCartPlus: true,
    deliveryDays: 3,
    returnPolicy: '30 days return',
    warranty: '2 years',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-15',
  },
  {
    id: '8',
    name: 'Levi\'s 501 Original Jeans',
    description: 'The iconic straight fit jeans that started it all.',
    shortDescription: 'Classic straight fit jeans',
    price: 69,
    originalPrice: 89,
    discount: 22,
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    categoryId: '2',
    vendorId: 'v6',
    vendor: { id: 'v6', name: 'Levi\'s Store', rating: 4.6, reviewCount: 18000 },
    rating: 4.5,
    reviewCount: 8934,
    stock: 150,
    sku: 'LEVIS501-32',
    tags: ['jeans', 'levis', 'fashion', 'denim'],
    isAutoCartPlus: true,
    deliveryDays: 4,
    returnPolicy: '30 days return',
    warranty: '6 months',
    createdAt: '2024-01-06',
    updatedAt: '2024-01-15',
  },
  {
    id: '9',
    name: 'Canon EOS R6 Mark II',
    description: 'Full-frame mirrorless camera with exceptional autofocus and 4K video.',
    shortDescription: 'Professional mirrorless camera',
    price: 2499,
    originalPrice: 2799,
    discount: 11,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
    categoryId: '1',
    vendorId: 'v7',
    vendor: { id: 'v7', name: 'Canon Store', rating: 4.8, reviewCount: 7500 },
    rating: 4.9,
    reviewCount: 567,
    stock: 15,
    sku: 'CANEOSR6M2',
    tags: ['camera', 'canon', 'photography', 'mirrorless'],
    isAutoCartPlus: true,
    deliveryDays: 3,
    returnPolicy: '14 days return',
    warranty: '2 years',
    createdAt: '2024-01-09',
    updatedAt: '2024-01-15',
  },
  {
    id: '10',
    name: 'Adidas Ultraboost 23',
    description: 'Premium running shoes with responsive Boost cushioning.',
    shortDescription: 'High-performance running shoes',
    price: 180,
    originalPrice: 220,
    discount: 18,
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
    categoryId: '2',
    vendorId: 'v8',
    vendor: { id: 'v8', name: 'Adidas Official', rating: 4.7, reviewCount: 22000 },
    rating: 4.6,
    reviewCount: 4521,
    stock: 80,
    sku: 'ADIUB23-BLK',
    tags: ['shoes', 'adidas', 'running', 'sports'],
    isAutoCartPlus: true,
    deliveryDays: 3,
    returnPolicy: '30 days return',
    warranty: '6 months',
    createdAt: '2024-01-07',
    updatedAt: '2024-01-15',
  },
  {
    id: '11',
    name: 'iPad Pro 12.9" M2',
    description: 'The ultimate iPad experience with M2 chip, Liquid Retina XDR display, and Apple Pencil support.',
    shortDescription: 'Pro tablet with M2 chip',
    price: 1099,
    originalPrice: 1199,
    discount: 8,
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
    categoryId: '1',
    vendorId: 'v1',
    vendor: { id: 'v1', name: 'Apple Store', rating: 4.9, reviewCount: 15420 },
    rating: 4.8,
    reviewCount: 1567,
    stock: 40,
    sku: 'IPADPRO-M2-129',
    tags: ['tablet', 'apple', 'ipad', 'premium'],
    isAutoCartPlus: true,
    deliveryDays: 2,
    returnPolicy: '14 days return',
    warranty: '1 year',
    createdAt: '2024-01-14',
    updatedAt: '2024-01-15',
  },
  {
    id: '12',
    name: 'PlayStation 5 Console',
    description: 'Experience lightning-fast loading, deeper immersion with haptic feedback, and stunning games.',
    shortDescription: 'Next-gen gaming console',
    price: 499,
    originalPrice: 549,
    discount: 9,
    images: [
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400',
    categoryId: '1',
    vendorId: 'v3',
    vendor: { id: 'v3', name: 'Sony Store', rating: 4.7, reviewCount: 8900 },
    rating: 4.9,
    reviewCount: 8934,
    stock: 25,
    sku: 'PS5-DISC-WHT',
    tags: ['gaming', 'playstation', 'sony', 'console'],
    isAutoCartPlus: true,
    deliveryDays: 2,
    returnPolicy: '14 days return',
    warranty: '1 year',
    createdAt: '2024-01-13',
    updatedAt: '2024-01-15',
  },
  {
    id: '13',
    name: 'Ray-Ban Aviator Classic',
    description: 'Iconic aviator sunglasses with timeless design and superior UV protection.',
    shortDescription: 'Classic aviator sunglasses',
    price: 154,
    originalPrice: 180,
    discount: 14,
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
    categoryId: '2',
    vendorId: 'v9',
    vendor: { id: 'v9', name: 'Ray-Ban Official', rating: 4.8, reviewCount: 12000 },
    rating: 4.7,
    reviewCount: 3421,
    stock: 120,
    sku: 'RB-AVIATOR-GLD',
    tags: ['sunglasses', 'rayban', 'fashion', 'accessories'],
    isAutoCartPlus: true,
    deliveryDays: 3,
    returnPolicy: '30 days return',
    warranty: '2 years',
    createdAt: '2024-01-11',
    updatedAt: '2024-01-15',
  },
  {
    id: '14',
    name: 'Bose QuietComfort Ultra',
    description: 'Immersive audio with world-class noise cancellation and spatial audio.',
    shortDescription: 'Premium wireless earbuds',
    price: 299,
    originalPrice: 349,
    discount: 14,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
    categoryId: '1',
    vendorId: 'v10',
    vendor: { id: 'v10', name: 'Bose Store', rating: 4.8, reviewCount: 9500 },
    rating: 4.7,
    reviewCount: 2156,
    stock: 75,
    sku: 'BOSE-QC-ULTRA',
    tags: ['earbuds', 'bose', 'audio', 'wireless'],
    isAutoCartPlus: true,
    deliveryDays: 2,
    returnPolicy: '30 days return',
    warranty: '1 year',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-15',
  },
  {
    id: '15',
    name: 'The North Face Puffer Jacket',
    description: 'Warm and stylish puffer jacket with 700-fill down insulation.',
    shortDescription: 'Premium winter jacket',
    price: 249,
    originalPrice: 320,
    discount: 22,
    images: [
      'https://images.unsplash.com/photo-1544923246-77307dd628b7?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1544923246-77307dd628b7?w=400',
    categoryId: '2',
    vendorId: 'v11',
    vendor: { id: 'v11', name: 'The North Face', rating: 4.7, reviewCount: 15000 },
    rating: 4.6,
    reviewCount: 4521,
    stock: 60,
    sku: 'TNF-PUFFER-BLK',
    tags: ['jacket', 'northface', 'winter', 'fashion'],
    isAutoCartPlus: true,
    deliveryDays: 3,
    returnPolicy: '30 days return',
    warranty: '1 year',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15',
  },
  {
    id: '16',
    name: 'Instant Pot Duo 7-in-1',
    description: 'Multi-use programmable pressure cooker, slow cooker, rice cooker, and more.',
    shortDescription: 'Versatile kitchen appliance',
    price: 89,
    originalPrice: 119,
    discount: 25,
    images: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400',
    categoryId: '3',
    vendorId: 'v12',
    vendor: { id: 'v12', name: 'Instant Brands', rating: 4.6, reviewCount: 25000 },
    rating: 4.7,
    reviewCount: 15678,
    stock: 200,
    sku: 'IP-DUO-6QT',
    tags: ['kitchen', 'appliance', 'cooking', 'home'],
    isAutoCartPlus: true,
    deliveryDays: 2,
    returnPolicy: '30 days return',
    warranty: '1 year',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-15',
  },
  {
    id: '17',
    name: 'Fitbit Charge 6',
    description: 'Advanced fitness tracker with built-in GPS, heart rate monitoring, and stress management.',
    shortDescription: 'Smart fitness tracker',
    price: 159,
    originalPrice: 179,
    discount: 11,
    images: [
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400',
    categoryId: '5',
    vendorId: 'v13',
    vendor: { id: 'v13', name: 'Fitbit Store', rating: 4.5, reviewCount: 18000 },
    rating: 4.5,
    reviewCount: 6789,
    stock: 150,
    sku: 'FITBIT-CHG6',
    tags: ['fitness', 'tracker', 'wearable', 'health'],
    isAutoCartPlus: true,
    deliveryDays: 2,
    returnPolicy: '30 days return',
    warranty: '1 year',
    createdAt: '2024-01-09',
    updatedAt: '2024-01-15',
  },
  {
    id: '18',
    name: 'Kindle Paperwhite',
    description: 'The thinnest, lightest Kindle Paperwhite yet with 6.8" display and adjustable warm light.',
    shortDescription: 'Premium e-reader',
    price: 139,
    originalPrice: 159,
    discount: 13,
    images: [
      'https://images.unsplash.com/photo-1592496001020-d31bd830651f?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1592496001020-d31bd830651f?w=400',
    categoryId: '6',
    vendorId: 'v14',
    vendor: { id: 'v14', name: 'Amazon Devices', rating: 4.8, reviewCount: 50000 },
    rating: 4.8,
    reviewCount: 23456,
    stock: 300,
    sku: 'KINDLE-PW-11',
    tags: ['ereader', 'kindle', 'books', 'reading'],
    isAutoCartPlus: true,
    deliveryDays: 1,
    returnPolicy: '30 days return',
    warranty: '1 year',
    createdAt: '2024-01-06',
    updatedAt: '2024-01-15',
  },
  {
    id: '19',
    name: 'LEGO Star Wars Millennium Falcon',
    description: 'Iconic starship building set with 7,541 pieces and detailed interior.',
    shortDescription: 'Ultimate collector set',
    price: 799,
    originalPrice: 849,
    discount: 6,
    images: [
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400',
    categoryId: '6',
    vendorId: 'v15',
    vendor: { id: 'v15', name: 'LEGO Store', rating: 4.9, reviewCount: 8000 },
    rating: 4.9,
    reviewCount: 1234,
    stock: 15,
    sku: 'LEGO-SW-MF',
    tags: ['lego', 'starwars', 'toys', 'collectible'],
    isAutoCartPlus: true,
    deliveryDays: 3,
    returnPolicy: '30 days return',
    warranty: '90 days',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-15',
  },
  {
    id: '20',
    name: 'Philips Hue Starter Kit',
    description: 'Smart lighting system with 4 color bulbs and bridge for complete home automation.',
    shortDescription: 'Smart home lighting',
    price: 179,
    originalPrice: 229,
    discount: 22,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    categoryId: '3',
    vendorId: 'v16',
    vendor: { id: 'v16', name: 'Philips Store', rating: 4.6, reviewCount: 12000 },
    rating: 4.6,
    reviewCount: 5678,
    stock: 80,
    sku: 'PHILIPS-HUE-4PK',
    tags: ['smarthome', 'lighting', 'philips', 'automation'],
    isAutoCartPlus: true,
    deliveryDays: 2,
    returnPolicy: '30 days return',
    warranty: '2 years',
    createdAt: '2024-01-04',
    updatedAt: '2024-01-15',
  },
  {
    id: '21',
    name: 'Yeti Rambler 30oz Tumbler',
    description: 'Double-wall vacuum insulated tumbler keeps drinks cold or hot for hours.',
    shortDescription: 'Premium insulated tumbler',
    price: 38,
    originalPrice: 45,
    discount: 16,
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
    categoryId: '3',
    vendorId: 'v17',
    vendor: { id: 'v17', name: 'Yeti Store', rating: 4.8, reviewCount: 20000 },
    rating: 4.8,
    reviewCount: 12345,
    stock: 500,
    sku: 'YETI-RAM-30',
    tags: ['tumbler', 'yeti', 'drinkware', 'outdoor'],
    isAutoCartPlus: true,
    deliveryDays: 2,
    returnPolicy: '30 days return',
    warranty: '5 years',
    createdAt: '2024-01-03',
    updatedAt: '2024-01-15',
  },
  {
    id: '22',
    name: 'Olaplex Hair Repair Set',
    description: 'Complete hair repair system with No.3, No.4, No.5 for damaged hair restoration.',
    shortDescription: 'Professional hair care',
    price: 84,
    originalPrice: 99,
    discount: 15,
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
    categoryId: '4',
    vendorId: 'v18',
    vendor: { id: 'v18', name: 'Olaplex Official', rating: 4.7, reviewCount: 15000 },
    rating: 4.7,
    reviewCount: 8901,
    stock: 200,
    sku: 'OLAPLEX-SET-3',
    tags: ['haircare', 'beauty', 'olaplex', 'repair'],
    isAutoCartPlus: true,
    deliveryDays: 2,
    returnPolicy: '30 days return',
    warranty: 'N/A',
    createdAt: '2024-01-02',
    updatedAt: '2024-01-15',
  },
  {
    id: '23',
    name: 'Dyson Airwrap Complete',
    description: 'Multi-styler with Coanda airflow for curls, waves, and smooth blowouts.',
    shortDescription: 'Revolutionary hair styler',
    price: 549,
    originalPrice: 599,
    discount: 8,
    images: [
      'https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=400',
    categoryId: '4',
    vendorId: 'v5',
    vendor: { id: 'v5', name: 'Dyson Official', rating: 4.8, reviewCount: 9800 },
    rating: 4.6,
    reviewCount: 4567,
    stock: 35,
    sku: 'DYSON-AW-COMP',
    tags: ['hairstyler', 'dyson', 'beauty', 'styling'],
    isAutoCartPlus: true,
    deliveryDays: 2,
    returnPolicy: '30 days return',
    warranty: '2 years',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
  },
  {
    id: '24',
    name: 'Yoga Mat Premium',
    description: 'Extra thick eco-friendly yoga mat with alignment lines and carrying strap.',
    shortDescription: 'Professional yoga mat',
    price: 68,
    originalPrice: 89,
    discount: 24,
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
    categoryId: '5',
    vendorId: 'v19',
    vendor: { id: 'v19', name: 'Manduka', rating: 4.7, reviewCount: 8000 },
    rating: 4.7,
    reviewCount: 3456,
    stock: 150,
    sku: 'YOGA-MAT-PRO',
    tags: ['yoga', 'fitness', 'mat', 'exercise'],
    isAutoCartPlus: true,
    deliveryDays: 3,
    returnPolicy: '30 days return',
    warranty: 'Lifetime',
    createdAt: '2024-01-14',
    updatedAt: '2024-01-15',
  },
  {
    id: '25',
    name: 'GoPro HERO12 Black',
    description: 'Waterproof action camera with 5.3K video, HyperSmooth 6.0 stabilization.',
    shortDescription: 'Ultimate action camera',
    price: 399,
    originalPrice: 449,
    discount: 11,
    images: [
      'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=400',
    categoryId: '1',
    vendorId: 'v20',
    vendor: { id: 'v20', name: 'GoPro Official', rating: 4.7, reviewCount: 12000 },
    rating: 4.7,
    reviewCount: 2345,
    stock: 60,
    sku: 'GOPRO-H12-BLK',
    tags: ['camera', 'gopro', 'action', 'video'],
    isAutoCartPlus: true,
    deliveryDays: 2,
    returnPolicy: '30 days return',
    warranty: '1 year',
    createdAt: '2024-01-13',
    updatedAt: '2024-01-15',
  },
];

const mockCategories: Category[] = [
  { id: '1', name: 'Electronics', icon: 'smartphone', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', productCount: 1250 },
  { id: '2', name: 'Fashion', icon: 'shopping-bag', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', productCount: 3420 },
  { id: '3', name: 'Home & Living', icon: 'home', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400', productCount: 890 },
  { id: '4', name: 'Beauty', icon: 'heart', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', productCount: 567 },
  { id: '5', name: 'Sports', icon: 'activity', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400', productCount: 432 },
  { id: '6', name: 'Books & More', icon: 'book', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400', productCount: 2100 },
  { id: '7', name: 'Gaming', icon: 'monitor', image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400', productCount: 780 },
  { id: '8', name: 'Grocery', icon: 'shopping-cart', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400', productCount: 4500 },
];

const mockBanners: Banner[] = [
  { id: '1', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800', title: 'Mega Sale', subtitle: 'Up to 70% off on Electronics', actionType: 'category', actionValue: '1' },
  { id: '2', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800', title: 'Fashion Week', subtitle: 'Trending styles at best prices', actionType: 'category', actionValue: '2' },
  { id: '3', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800', title: 'Flash Deals', subtitle: 'Ends in 24 hours!', actionType: 'category', actionValue: '1' },
  { id: '4', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', title: 'New Arrivals', subtitle: 'Fresh products just landed', actionType: 'category', actionValue: '3' },
];

export const useProductStore = create<ProductState>((set, get) => ({
  products: mockProducts,
  featuredProducts: mockProducts.filter(p => p.isAutoCartPlus).slice(0, 6),
  dealProducts: [...mockProducts].sort((a, b) => (b.discount || 0) - (a.discount || 0)).slice(0, 8),
  trendingProducts: [...mockProducts].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8),
  newArrivals: [...mockProducts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8),
  topRatedProducts: [...mockProducts].sort((a, b) => b.rating - a.rating).slice(0, 8),
  recentlyViewed: [],
  categories: mockCategories,
  banners: mockBanners,
  selectedProduct: null,
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise<void>(resolve => setTimeout(resolve, 300));
      set({ products: mockProducts, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch products', isLoading: false });
    }
  },

  fetchFeaturedProducts: async () => {
    try {
      await new Promise<void>(resolve => setTimeout(resolve, 200));
      set({ featuredProducts: mockProducts.filter(p => p.isAutoCartPlus).slice(0, 6) });
    } catch (error) {
      set({ error: 'Failed to fetch featured products' });
    }
  },

  fetchDealProducts: async () => {
    try {
      await new Promise<void>(resolve => setTimeout(resolve, 200));
      // Products with highest discounts
      const deals = [...mockProducts].sort((a, b) => (b.discount || 0) - (a.discount || 0)).slice(0, 8);
      set({ dealProducts: deals });
    } catch (error) {
      set({ error: 'Failed to fetch deal products' });
    }
  },

  fetchTrendingProducts: async () => {
    try {
      await new Promise<void>(resolve => setTimeout(resolve, 200));
      // Products with highest review counts (most popular)
      const trending = [...mockProducts].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8);
      set({ trendingProducts: trending });
    } catch (error) {
      set({ error: 'Failed to fetch trending products' });
    }
  },

  fetchNewArrivals: async () => {
    try {
      await new Promise<void>(resolve => setTimeout(resolve, 200));
      // Most recently created products
      const newProducts = [...mockProducts].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, 8);
      set({ newArrivals: newProducts });
    } catch (error) {
      set({ error: 'Failed to fetch new arrivals' });
    }
  },

  fetchTopRatedProducts: async () => {
    try {
      await new Promise<void>(resolve => setTimeout(resolve, 200));
      // Highest rated products
      const topRated = [...mockProducts].sort((a, b) => b.rating - a.rating).slice(0, 8);
      set({ topRatedProducts: topRated });
    } catch (error) {
      set({ error: 'Failed to fetch top rated products' });
    }
  },

  fetchCategories: async () => {
    try {
      await new Promise<void>(resolve => setTimeout(resolve, 200));
      set({ categories: mockCategories });
    } catch (error) {
      set({ error: 'Failed to fetch categories' });
    }
  },

  fetchBanners: async () => {
    try {
      await new Promise<void>(resolve => setTimeout(resolve, 100));
      set({ banners: mockBanners });
    } catch (error) {
      set({ error: 'Failed to fetch banners' });
    }
  },

  fetchProductById: async (id: string) => {
    set({ isLoading: true, error: null, selectedProduct: null });
    try {
      await new Promise<void>(resolve => setTimeout(resolve, 200));
      const product = mockProducts.find(p => p.id === id) || null;
      if (product) {
        // Add to recently viewed
        const { recentlyViewed } = get();
        const filtered = recentlyViewed.filter(p => p.id !== product.id);
        set({ 
          selectedProduct: product, 
          isLoading: false,
          recentlyViewed: [product, ...filtered].slice(0, 10)
        });
      } else {
        set({ selectedProduct: product, isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch product', isLoading: false });
    }
  },

  addToRecentlyViewed: (product: Product) => {
    const { recentlyViewed } = get();
    const filtered = recentlyViewed.filter(p => p.id !== product.id);
    set({ recentlyViewed: [product, ...filtered].slice(0, 10) });
  },

  searchProducts: (query: string) => {
    const filtered = mockProducts.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    set({ products: filtered });
  },

  filterByCategory: (categoryId: string) => {
    const filtered = mockProducts.filter(p => p.categoryId === categoryId);
    set({ products: filtered });
  },

  clearError: () => set({ error: null }),
}));
