# AutoCart

A multi-vendor e-commerce mobile application built with React Native.

## Features

- **Multi-Vendor Support** - Vendors can manage their own products, orders, and analytics
- **Product Catalog** - Browse products by categories, search, and filters
- **Shopping Cart** - Add items, apply coupons, manage quantities
- **Wishlist** - Save favorite products for later
- **User Authentication** - Login, register, and profile management
- **Checkout Flow** - Address selection, payment methods, order placement
- **Order Tracking** - View order history and track shipments
- **Vendor Dashboard** - Sales stats, order management, product analytics

## Tech Stack

- **React Native** 0.83.1
- **TypeScript**
- **React Navigation** - Stack and Tab navigation
- **Zustand** - State management with persistence
- **React Native Linear Gradient** - UI gradients
- **React Native Vector Icons** - Feather icons
- **Async Storage** - Local data persistence

## Getting Started

### Prerequisites

- Node.js >= 20
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## Project Structure

```
src/
├── api/              # API client and services
├── assets/           # Images and static assets
├── components/       # Reusable UI components
├── constants/        # App constants
├── features/         # Feature modules
│   ├── auth/         # Login, Register, Forgot Password
│   ├── cart/         # Shopping cart
│   ├── categories/   # Category browsing
│   ├── checkout/     # Checkout flow
│   ├── home/         # Home screen
│   ├── orders/       # Order history
│   ├── product/      # Product details
│   ├── profile/      # User profile
│   ├── search/       # Product search
│   ├── vendor/       # Vendor dashboard
│   └── wishlist/     # Wishlist
├── navigation/       # Navigation configuration
├── store/            # Zustand stores
├── theme/            # Theme colors, typography, spacing
└── types/            # TypeScript interfaces
```

## Screens

| Screen | Description |
|--------|-------------|
| Home | Featured products, categories, banners |
| Search | Product search with filters |
| Categories | Browse by category |
| Product Details | Product info, images, add to cart |
| Cart | Shopping cart with coupon support |
| Checkout | Address and payment selection |
| Orders | Order history and tracking |
| Wishlist | Saved products |
| Profile | User settings and menu |
| Vendor Dashboard | Vendor analytics and management |
| Login/Register | User authentication |

## License

MIT
