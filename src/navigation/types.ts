// ============================================
// AutoCart - Navigation Types
// ============================================

import { NavigatorScreenParams } from '@react-navigation/native';

// Home Stack
export type HomeStackParamList = {
  HomeMain: undefined;
  ProductDetails: { productId: string };
  Search: undefined;
  CategoryProducts: { categoryId: string; categoryName: string };
};

// Categories Stack
export type CategoriesStackParamList = {
  CategoriesMain: undefined;
  SubCategories: { categoryId: string; categoryName: string };
  CategoryProducts: { categoryId: string; categoryName: string; subCategoryId?: string };
  ProductDetails: { productId: string };
};

// Cart Stack
export type CartStackParamList = {
  CartMain: undefined;
  Checkout: undefined;
  OrderConfirmation: { orderId: string };
  OrderSuccess: { orderId: string };
};

// Orders Stack
export type OrdersStackParamList = {
  OrdersMain: undefined;
  OrderDetails: { orderId: string };
  TrackOrder: { orderId: string };
};

// Profile Stack
export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  Addresses: undefined;
  AddAddress: { address?: any };
  Wishlist: undefined;
  Notifications: undefined;
  HelpCenter: undefined;
  Settings: undefined;
  PaymentMethods: undefined;
  VendorDashboard: undefined;
  Login: undefined;
  Register: undefined;
};

// Main Tab Navigator
export type MainTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Categories: NavigatorScreenParams<CategoriesStackParamList>;
  Cart: NavigatorScreenParams<CartStackParamList>;
  Orders: NavigatorScreenParams<OrdersStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

// Root Navigator
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  Auth: undefined;
  Onboarding: undefined;
};
