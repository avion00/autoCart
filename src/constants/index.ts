// ============================================
// AutoCart - Constants
// ============================================

export const APP_NAME = 'AutoCart';
export const APP_VERSION = '1.0.0';

export const API_BASE_URL = 'https://api.autocart.com/v1';

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@autocart/auth_token',
  USER_DATA: '@autocart/user_data',
  CART: '@autocart/cart',
  WISHLIST: '@autocart/wishlist',
  THEME: '@autocart/theme',
  ONBOARDING: '@autocart/onboarding_complete',
};

export const DELIVERY_OPTIONS = [
  { id: 'standard', name: 'Standard Delivery', price: 0, days: '5-7 days' },
  { id: 'express', name: 'Express Delivery', price: 9.99, days: '2-3 days' },
  { id: 'same_day', name: 'Same Day Delivery', price: 19.99, days: 'Today' },
];

export const PAYMENT_METHODS = [
  { id: 'cod', name: 'Cash on Delivery', icon: 'dollar-sign' },
  { id: 'card', name: 'Credit/Debit Card', icon: 'credit-card' },
  { id: 'wallet', name: 'AutoCart Wallet', icon: 'briefcase' },
  { id: 'upi', name: 'UPI', icon: 'smartphone' },
];

export const ORDER_STATUSES = {
  pending: { label: 'Pending', color: '#FF9800' },
  confirmed: { label: 'Confirmed', color: '#2196F3' },
  processing: { label: 'Processing', color: '#9C27B0' },
  packed: { label: 'Packed', color: '#00BCD4' },
  shipped: { label: 'Shipped', color: '#3F51B5' },
  out_for_delivery: { label: 'Out for Delivery', color: '#FF5722' },
  delivered: { label: 'Delivered', color: '#4CAF50' },
  cancelled: { label: 'Cancelled', color: '#F44336' },
  returned: { label: 'Returned', color: '#795548' },
  refunded: { label: 'Refunded', color: '#607D8B' },
};

export const SORT_OPTIONS = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'price_low', label: 'Price: Low to High' },
  { id: 'price_high', label: 'Price: High to Low' },
  { id: 'rating', label: 'Customer Rating' },
  { id: 'newest', label: 'Newest First' },
  { id: 'popularity', label: 'Popularity' },
];

export const RETURN_REASONS = [
  { id: 'defective', label: 'Product is defective' },
  { id: 'wrong_item', label: 'Wrong item received' },
  { id: 'not_as_described', label: 'Not as described' },
  { id: 'changed_mind', label: 'Changed my mind' },
  { id: 'better_price', label: 'Found better price elsewhere' },
  { id: 'other', label: 'Other reason' },
];
