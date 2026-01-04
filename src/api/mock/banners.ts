// ============================================
// AutoCart - Mock Banners Data
// ============================================

import { Banner } from '../../types';

export const mockBanners: Banner[] = [
  {
    id: 'banner-1',
    title: 'Summer Sale',
    subtitle: 'Up to 50% off on electronics',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
    backgroundColor: '#FF6B6B',
    actionType: 'category',
    actionValue: 'cat-1',
  },
  {
    id: 'banner-2',
    title: 'New Arrivals',
    subtitle: 'Check out the latest products',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    backgroundColor: '#4ECDC4',
    actionType: 'category',
    actionValue: 'cat-2',
  },
  {
    id: 'banner-3',
    title: 'Flash Deals',
    subtitle: 'Limited time offers',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800',
    backgroundColor: '#45B7D1',
    actionType: 'deals',
    actionValue: 'flash',
  },
];

export default mockBanners;
