// ============================================
// AutoCart - Type Definitions
// ============================================

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  isVendor: boolean;
  vendorId?: string;
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  thumbnail: string;
  categoryId: string;
  subcategoryId?: string;
  vendorId?: string;
  vendor?: VendorInfo;
  rating: number;
  reviewCount: number;
  stock: number;
  sku: string;
  variants?: ProductVariant[];
  specifications?: Record<string, string>;
  tags: string[];
  isFeatured?: boolean;
  isAutoCartPlus?: boolean;
  deliveryDays?: number;
  returnPolicy?: string;
  warranty?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  type: 'color' | 'size' | 'style' | 'other';
  value: string;
  priceModifier: number;
  stock: number;
  image?: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface VendorInfo {
  id: string;
  name: string;
  logo?: string;
  rating: number;
  reviewCount?: number;
  verified?: boolean;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  parentId?: string;
  subcategories?: Category[];
  productCount: number;
  description?: string;
}

// Vendor Types
export interface Vendor {
  id: string;
  name: string;
  description: string;
  logo: string;
  banner: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  followerCount: number;
  isFollowing: boolean;
  joinedDate: string;
  policies: VendorPolicies;
  contactEmail?: string;
  contactPhone?: string;
}

export interface VendorPolicies {
  shipping: string;
  returns: string;
  warranty: string;
}

// Cart Types
export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedVariants?: SelectedVariant[];
  addedAt: string;
}

export interface SelectedVariant {
  type: string;
  value: string;
  priceModifier: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  appliedCoupon?: Coupon;
}

// Coupon Types
export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  validUntil: string;
  vendorId?: string;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  statusHistory: OrderStatusHistory[];
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  appliedCoupon?: Coupon;
  deliveryType: 'standard' | 'express' | 'autocart_plus';
  estimatedDelivery: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  selectedVariants?: SelectedVariant[];
  vendorId: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'cod' | 'card' | 'wallet' | 'upi';
  name: string;
  details?: string;
  icon: string;
}

// Review Types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
}

export interface RatingDistribution {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

// Return Types
export interface ReturnRequest {
  id: string;
  orderId: string;
  orderItemIds: string[];
  reason: ReturnReason;
  description?: string;
  pickupType: 'pickup' | 'dropoff';
  status: ReturnStatus;
  statusHistory: ReturnStatusHistory[];
  refundAmount: number;
  refundMethod: 'original' | 'wallet';
  createdAt: string;
  updatedAt: string;
}

export type ReturnReason = 
  | 'defective'
  | 'wrong_item'
  | 'not_as_described'
  | 'changed_mind'
  | 'better_price'
  | 'other';

export type ReturnStatus = 
  | 'requested'
  | 'approved'
  | 'pickup_scheduled'
  | 'picked_up'
  | 'received'
  | 'inspecting'
  | 'refund_initiated'
  | 'refund_completed'
  | 'rejected';

export interface ReturnStatusHistory {
  status: ReturnStatus;
  timestamp: string;
  note?: string;
}

// Wishlist Types
export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'order' | 'promotion' | 'system' | 'price_drop';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

// Search Types
export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'product' | 'category' | 'brand' | 'recent';
}

export interface SearchFilters {
  categoryId?: string;
  subcategoryId?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  vendorIds?: string[];
  isAutoCartPlus?: boolean;
  inStock?: boolean;
  sortBy?: SortOption;
}

export type SortOption = 
  | 'relevance'
  | 'price_low'
  | 'price_high'
  | 'rating'
  | 'newest'
  | 'popularity';

// Banner Types
export interface Banner {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  actionType: 'product' | 'category' | 'vendor' | 'url' | 'deals';
  actionValue: string;
}

// FAQ Types
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Auth Types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

// Vendor Dashboard Types
export interface VendorStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  averageRating: number;
}

export interface VendorProduct extends Product {
  salesCount: number;
  viewCount: number;
}
