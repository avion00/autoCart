// ============================================
// AutoCart - Product Card Component (Flipkart Style)
// ============================================

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../theme';
import { Icon } from './Icon';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'list' | 'horizontal' | 'compact';
  onPress?: () => void;
  onAddToCart?: () => void;
  onAddToWishlist?: () => void;
  isInWishlist?: boolean;
  showAddToCart?: boolean;
  showQuickActions?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'grid',
  onPress,
  onAddToCart,
  onAddToWishlist,
  isInWishlist = false,
  showAddToCart = true,
  showQuickActions = true,
}) => {
  const theme = useTheme();

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Compact variant for horizontal scrolling sections
  if (variant === 'compact') {
    return (
      <TouchableOpacity
        style={[styles.compactContainer, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.compactImageContainer}>
          <Image source={{ uri: product.thumbnail }} style={styles.compactImage} />
          {discount > 0 && (
            <View style={styles.compactDiscountBadge}>
              <Text style={styles.compactDiscountText}>{discount}%</Text>
            </View>
          )}
          {showQuickActions && onAddToWishlist && (
            <TouchableOpacity 
              style={[styles.compactWishlistBtn, { backgroundColor: theme.colors.cardBackground }]} 
              onPress={(e) => { e.stopPropagation(); onAddToWishlist(); }}
            >
              <Icon name="heart" size={14} color={isInWishlist ? '#E91E63' : theme.colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.compactContent}>
          <Text style={[styles.compactBrand, { color: theme.colors.textSecondary }]} numberOfLines={1}>
            {product.vendor?.name || 'Brand'}
          </Text>
          <Text style={[styles.compactName, { color: theme.colors.textPrimary }]} numberOfLines={1}>
            {product.name}
          </Text>
          <View style={styles.compactPriceRow}>
            <Text style={[styles.compactPrice, { color: theme.colors.textPrimary }]}>
              ${product.price.toFixed(0)}
            </Text>
            {product.originalPrice && (
              <Text style={[styles.compactOriginalPrice, { color: theme.colors.textTertiary }]}>
                ${product.originalPrice.toFixed(0)}
              </Text>
            )}
          </View>
          <View style={styles.compactRatingRow}>
            <View style={styles.compactRatingBadge}>
              <Text style={styles.compactRatingText}>{product.rating}</Text>
              <Icon name="star" size={8} color="#FFFFFF" />
            </View>
            <Text style={[styles.compactReviews, { color: theme.colors.textTertiary }]}>
              ({product.reviewCount > 1000 ? `${(product.reviewCount/1000).toFixed(1)}k` : product.reviewCount})
            </Text>
          </View>
          {product.isAutoCartPlus && (
            <View style={styles.compactPlusBadge}>
              <Icon name="zap" size={10} color="#FF9800" />
              <Text style={styles.compactPlusText}>Plus</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  // List variant
  if (variant === 'list') {
    return (
      <TouchableOpacity
        style={[styles.listContainer, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.listImageContainer}>
          <Image source={{ uri: product.thumbnail }} style={styles.listImage} />
          {discount > 0 && (
            <View style={styles.listDiscountBadge}>
              <Text style={styles.listDiscountText}>{discount}% OFF</Text>
            </View>
          )}
        </View>
        <View style={styles.listContent}>
          <Text style={[styles.listBrand, { color: theme.colors.primary }]}>
            {product.vendor?.name || 'Brand'}
          </Text>
          <Text style={[styles.listName, { color: theme.colors.textPrimary }]} numberOfLines={2}>
            {product.name}
          </Text>
          <View style={styles.listRatingRow}>
            <View style={styles.listRatingBadge}>
              <Text style={styles.listRatingText}>{product.rating}</Text>
              <Icon name="star" size={10} color="#FFFFFF" />
            </View>
            <Text style={[styles.listReviewCount, { color: theme.colors.textSecondary }]}>
              ({product.reviewCount.toLocaleString()})
            </Text>
            {product.isAutoCartPlus && (
              <View style={styles.listPlusBadge}>
                <Icon name="zap" size={10} color="#FF9800" />
                <Text style={styles.listPlusText}>Plus</Text>
              </View>
            )}
          </View>
          <View style={styles.listPriceRow}>
            <Text style={[styles.listPrice, { color: theme.colors.textPrimary }]}>
              ${product.price.toFixed(2)}
            </Text>
            {product.originalPrice && (
              <>
                <Text style={[styles.listOriginalPrice, { color: theme.colors.textTertiary }]}>
                  ${product.originalPrice.toFixed(2)}
                </Text>
                <Text style={styles.listDiscountPercent}>{discount}% off</Text>
              </>
            )}
          </View>
          <Text style={[styles.listDelivery, { color: theme.colors.textSecondary }]}>
            Free Delivery
          </Text>
          {showQuickActions && (
            <View style={styles.listActions}>
              {onAddToCart && (
                <TouchableOpacity
                  style={[styles.listAddBtn, { backgroundColor: theme.colors.primary }]}
                  onPress={(e) => { e.stopPropagation(); onAddToCart(); }}
                >
                  <Icon name="shopping-cart" size={14} color="#FFFFFF" />
                  <Text style={styles.listAddBtnText}>Add to Cart</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
        {showQuickActions && onAddToWishlist && (
          <TouchableOpacity 
            style={styles.listWishlistBtn} 
            onPress={(e) => { e.stopPropagation(); onAddToWishlist(); }}
          >
            <Icon name="heart" size={20} color={isInWishlist ? '#E91E63' : theme.colors.textTertiary} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  }

  // Grid variant (default) - Flipkart style
  return (
    <TouchableOpacity
      style={[styles.gridContainer, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.thumbnail }} style={styles.gridImage} />
        {discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discount}%</Text>
            <Text style={styles.discountLabel}>OFF</Text>
          </View>
        )}
        {showQuickActions && onAddToWishlist && (
          <TouchableOpacity 
            style={[styles.wishlistBtnGrid, { backgroundColor: theme.colors.cardBackground }]} 
            onPress={(e) => { e.stopPropagation(); onAddToWishlist(); }}
          >
            <Icon name="heart" size={16} color={isInWishlist ? '#E91E63' : theme.colors.textTertiary} />
          </TouchableOpacity>
        )}
        {product.isAutoCartPlus && (
          <View style={styles.plusBadgeImage}>
            <Icon name="zap" size={10} color="#000" />
          </View>
        )}
      </View>
      <View style={styles.gridContent}>
        <Text style={[styles.gridBrand, { color: theme.colors.textSecondary }]} numberOfLines={1}>
          {product.vendor?.name || 'Brand'}
        </Text>
        <Text style={[styles.gridName, { color: theme.colors.textPrimary }]} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.ratingRow}>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingBadgeText}>{product.rating}</Text>
            <Icon name="star" size={10} color="#FFFFFF" />
          </View>
          <Text style={[styles.reviewCount, { color: theme.colors.textTertiary }]}>
            ({product.reviewCount > 1000 ? `${(product.reviewCount/1000).toFixed(1)}k` : product.reviewCount})
          </Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={[styles.gridPrice, { color: theme.colors.textPrimary }]}>
            ${product.price.toFixed(2)}
          </Text>
          {product.originalPrice && (
            <Text style={[styles.gridOriginalPrice, { color: theme.colors.textTertiary }]}>
              ${product.originalPrice.toFixed(0)}
            </Text>
          )}
        </View>
        {discount > 0 && (
          <Text style={styles.savingsText}>
            Save ${(product.originalPrice! - product.price).toFixed(2)}
          </Text>
        )}
        <Text style={[styles.deliveryText, { color: theme.colors.success }]}>
          Free Delivery
        </Text>
        {showAddToCart && onAddToCart && (
          <TouchableOpacity
            style={[styles.addToCartBtn, { backgroundColor: theme.colors.primary }]}
            onPress={(e) => { e.stopPropagation(); onAddToCart(); }}
          >
            <Icon name="plus" size={14} color="#FFFFFF" />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Grid styles (Flipkart style)
  gridContainer: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: '#F8F8F8',
  },
  gridImage: {
    width: '100%',
    height: 140,
    resizeMode: 'contain',
  },
  discountBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#388E3C',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderBottomRightRadius: 8,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  discountLabel: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '500',
  },
  wishlistBtnGrid: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  plusBadgeImage: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: '#FFD700',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContent: {
    padding: 10,
  },
  gridBrand: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  gridName: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
    lineHeight: 17,
    height: 34,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#388E3C',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    gap: 2,
  },
  ratingBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  reviewCount: {
    fontSize: 11,
    marginLeft: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 2,
  },
  gridPrice: {
    fontSize: 15,
    fontWeight: '700',
  },
  gridOriginalPrice: {
    fontSize: 11,
    textDecorationLine: 'line-through',
  },
  savingsText: {
    fontSize: 10,
    color: '#388E3C',
    fontWeight: '600',
    marginBottom: 4,
  },
  deliveryText: {
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 8,
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 4,
    gap: 4,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  // Compact styles (for horizontal scroll)
  compactContainer: {
    width: 130,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  compactImageContainer: {
    position: 'relative',
    backgroundColor: '#F8F8F8',
  },
  compactImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
  },
  compactDiscountBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#388E3C',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderBottomRightRadius: 6,
  },
  compactDiscountText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  compactWishlistBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  compactContent: {
    padding: 8,
  },
  compactBrand: {
    fontSize: 9,
    fontWeight: '500',
    marginBottom: 2,
  },
  compactName: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 4,
    height: 14,
  },
  compactPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 4,
  },
  compactPrice: {
    fontSize: 13,
    fontWeight: '700',
  },
  compactOriginalPrice: {
    fontSize: 9,
    textDecorationLine: 'line-through',
  },
  compactRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#388E3C',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
    gap: 2,
  },
  compactRatingText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  compactReviews: {
    fontSize: 9,
  },
  compactPlusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 2,
  },
  compactPlusText: {
    fontSize: 9,
    color: '#FF9800',
    fontWeight: '600',
  },

  // List styles
  listContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  listImageContainer: {
    position: 'relative',
    backgroundColor: '#F8F8F8',
    borderRadius: 6,
    overflow: 'hidden',
  },
  listImage: {
    width: 110,
    height: 110,
    resizeMode: 'contain',
  },
  listDiscountBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#388E3C',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderBottomRightRadius: 6,
  },
  listDiscountText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  listContent: {
    flex: 1,
    marginLeft: 12,
  },
  listBrand: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  listName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    lineHeight: 18,
  },
  listRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  listRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#388E3C',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    gap: 2,
  },
  listRatingText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  listReviewCount: {
    fontSize: 11,
  },
  listPlusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    gap: 2,
  },
  listPlusText: {
    fontSize: 9,
    color: '#FF9800',
    fontWeight: '700',
  },
  listPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 4,
  },
  listPrice: {
    fontSize: 17,
    fontWeight: '700',
  },
  listOriginalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  listDiscountPercent: {
    fontSize: 11,
    color: '#388E3C',
    fontWeight: '600',
  },
  listDelivery: {
    fontSize: 11,
    marginBottom: 8,
  },
  listActions: {
    flexDirection: 'row',
    gap: 8,
  },
  listAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    gap: 4,
  },
  listAddBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  listWishlistBtn: {
    padding: 8,
    alignSelf: 'flex-start',
  },
});

export default ProductCard;
