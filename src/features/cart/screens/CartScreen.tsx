// ============================================
// AutoCart - Cart Screen (Premium Flipkart Style)
// ============================================

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import { Icon, CouponInput } from '../../../components';
import { useCartStore, useWishlistStore } from '../../../store';
import { CartItem } from '../../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CartScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const {
    items,
    subtotal,
    discount,
    deliveryFee,
    tax,
    total,
    appliedCoupon,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
  } = useCartStore();
  const { addToWishlist } = useWishlistStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const handleMoveToWishlist = (item: CartItem) => {
    addToWishlist(item.product);
    removeFromCart(item.id);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const savings = discount + (subtotal > 50 ? 5 : 0);

  // Clean Header
  const Header = () => (
    <View style={[styles.header, { backgroundColor: theme.colors.cardBackground, borderBottomColor: theme.colors.border }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.cardBackground} />
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={22} color={theme.colors.textPrimary} />
      </TouchableOpacity>
      <View style={styles.headerCenter}>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>My Cart</Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </Text>
      </View>
      <TouchableOpacity style={styles.headerBtn}>
        <Icon name="heart" size={22} color={theme.colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );

  // Delivery Banner
  const DeliveryBanner = () => (
    <View style={[styles.deliveryBanner, { backgroundColor: '#E8F5E9' }]}>
      <Icon name="truck" size={18} color="#2E7D32" />
      <Text style={styles.deliveryText}>
        <Text style={styles.deliveryBold}>Free Delivery</Text> on orders above $50
      </Text>
      {subtotal < 50 && (
        <Text style={styles.deliveryAdd}>Add ${(50 - subtotal).toFixed(2)} more</Text>
      )}
    </View>
  );

  // Cart Item Card
  const CartItemCard = ({ item, index }: { item: CartItem; index: number }) => {
    const itemTotal = item.product.price * item.quantity;
    const hasDiscount = item.product.discount && item.product.discount > 0;
    const originalPrice = hasDiscount 
      ? item.product.price / (1 - (item.product.discount || 0) / 100)
      : item.product.price;

    return (
      <Animated.View style={[styles.itemCard, { backgroundColor: theme.colors.cardBackground, opacity: fadeAnim }]}>
        {/* Seller Info */}
        <View style={[styles.sellerRow, { borderBottomColor: theme.colors.border }]}>
          <Text style={[styles.sellerText, { color: theme.colors.textSecondary }]}>
            Sold by: <Text style={styles.sellerName}>{typeof item.product.vendor === 'string' ? item.product.vendor : item.product.vendor?.name || 'AutoCart'}</Text>
          </Text>
          {item.product.rating && item.product.rating >= 4 && (
            <View style={styles.sellerBadge}>
              <Icon name="award" size={12} color="#FF9800" />
              <Text style={styles.sellerBadgeText}>Top Rated</Text>
            </View>
          )}
        </View>

        {/* Product Content */}
        <View style={styles.itemContent}>
          <TouchableOpacity 
            style={styles.itemImageContainer}
            onPress={() => (navigation as any).navigate('ProductDetails', { productId: item.product.id })}
          >
            <Image source={{ uri: item.product.thumbnail }} style={styles.itemImage} />
            {hasDiscount && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{item.product.discount}% OFF</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.itemDetails}>
            <Text style={[styles.itemName, { color: theme.colors.textPrimary }]} numberOfLines={2}>
              {item.product.name}
            </Text>
            
            {(item.product as any).brand && (
              <Text style={[styles.itemBrand, { color: theme.colors.textTertiary }]}>
                {(item.product as any).brand}
              </Text>
            )}

            {/* Price Section */}
            <View style={styles.priceRow}>
              <Text style={[styles.itemPrice, { color: theme.colors.textPrimary }]}>
                ${item.product.price.toFixed(2)}
              </Text>
              {hasDiscount && (
                <>
                  <Text style={[styles.originalPrice, { color: theme.colors.textTertiary }]}>
                    ${originalPrice.toFixed(2)}
                  </Text>
                  <Text style={styles.savingsText}>
                    Save ${(originalPrice - item.product.price).toFixed(2)}
                  </Text>
                </>
              )}
            </View>

            {/* Delivery Info */}
            <View style={styles.deliveryInfo}>
              <Icon name="zap" size={12} color="#4CAF50" />
              <Text style={styles.deliveryInfoText}>Delivery by Tomorrow</Text>
            </View>

            {/* Quantity Controls */}
            <View style={styles.quantityRow}>
              <View style={[styles.quantityContainer, { borderColor: theme.colors.border }]}>
                <TouchableOpacity
                  style={[styles.qtyBtn, item.quantity <= 1 && styles.qtyBtnDisabled]}
                  onPress={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Icon name="minus" size={16} color={item.quantity <= 1 ? '#CCC' : theme.colors.textPrimary} />
                </TouchableOpacity>
                <View style={[styles.qtyValue, { borderColor: theme.colors.border }]}>
                  <Text style={[styles.qtyText, { color: theme.colors.textPrimary }]}>{item.quantity}</Text>
                </View>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Icon name="plus" size={16} color={theme.colors.textPrimary} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.itemTotal, { color: theme.colors.textPrimary }]}>
                ${itemTotal.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={[styles.itemActions, { borderTopColor: theme.colors.border }]}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleMoveToWishlist(item)}>
            <Icon name="heart" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>Save for Later</Text>
          </TouchableOpacity>
          <View style={[styles.actionDivider, { backgroundColor: theme.colors.border }]} />
          <TouchableOpacity style={styles.actionBtn} onPress={() => removeFromCart(item.id)}>
            <Icon name="trash-2" size={16} color="#F44336" />
            <Text style={[styles.actionText, { color: '#F44336' }]}>Remove</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  // Price Details Card
  const PriceDetails = () => (
    <View style={[styles.priceCard, { backgroundColor: theme.colors.cardBackground }]}>
      <Text style={[styles.priceCardTitle, { color: theme.colors.textPrimary }]}>
        Price Details ({totalItems} {totalItems === 1 ? 'Item' : 'Items'})
      </Text>

      <View style={styles.priceRow}>
        <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>Total MRP</Text>
        <Text style={[styles.priceValue, { color: theme.colors.textPrimary }]}>${subtotal.toFixed(2)}</Text>
      </View>

      {discount > 0 && (
        <View style={styles.priceRow}>
          <Text style={[styles.priceLabel, { color: theme.colors.success }]}>Discount on MRP</Text>
          <Text style={[styles.priceValue, { color: theme.colors.success }]}>-${discount.toFixed(2)}</Text>
        </View>
      )}

      {appliedCoupon && (
        <View style={styles.priceRow}>
          <Text style={[styles.priceLabel, { color: theme.colors.success }]}>Coupon Discount</Text>
          <Text style={[styles.priceValue, { color: theme.colors.success }]}>Applied</Text>
        </View>
      )}

      <View style={styles.priceRow}>
        <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>Delivery Fee</Text>
        <Text style={[styles.priceValue, { color: deliveryFee === 0 ? theme.colors.success : theme.colors.textPrimary }]}>
          {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
        </Text>
      </View>

      <View style={styles.priceRow}>
        <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>Platform Fee</Text>
        <Text style={[styles.priceValue, { color: theme.colors.success }]}>FREE</Text>
      </View>

      <View style={styles.priceRow}>
        <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>Tax (8%)</Text>
        <Text style={[styles.priceValue, { color: theme.colors.textPrimary }]}>${tax.toFixed(2)}</Text>
      </View>

      <View style={[styles.totalDivider, { backgroundColor: theme.colors.border }]} />

      <View style={styles.priceRow}>
        <Text style={[styles.totalLabel, { color: theme.colors.textPrimary }]}>Total Amount</Text>
        <Text style={[styles.totalValue, { color: theme.colors.textPrimary }]}>${total.toFixed(2)}</Text>
      </View>

      {savings > 0 && (
        <View style={[styles.savingsBanner, { backgroundColor: '#E8F5E9' }]}>
          <Icon name="tag" size={16} color="#2E7D32" />
          <Text style={styles.savingsBannerText}>
            You will save ${savings.toFixed(2)} on this order
          </Text>
        </View>
      )}
    </View>
  );

  // Empty Cart
  const EmptyCart = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconCircle, { backgroundColor: theme.colors.background }]}>
        <Icon name="shopping-bag" size={64} color={theme.colors.textTertiary} />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>Your cart is empty</Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
        Add items to it now
      </Text>
      <TouchableOpacity
        style={[styles.shopNowBtn, { backgroundColor: theme.colors.primary }]}
        onPress={() => (navigation as any).navigate('Home')}
      >
        <Text style={styles.shopNowText}>Shop Now</Text>
      </TouchableOpacity>
    </View>
  );

  // Checkout Section (Inline, not absolute)
  const CheckoutSection = () => (
    <View style={[styles.checkoutSection, { backgroundColor: theme.colors.cardBackground, borderTopColor: theme.colors.border }]}>
      <View style={styles.checkoutLeft}>
        <Text style={[styles.checkoutTotal, { color: theme.colors.textPrimary }]}>${total.toFixed(2)}</Text>
        <TouchableOpacity>
          <Text style={[styles.viewDetails, { color: theme.colors.primary }]}>View Details</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.checkoutBtn, { backgroundColor: '#FB641B' }]}
        onPress={() => (navigation as any).navigate('Checkout')}
      >
        <Text style={styles.checkoutBtnText}>Place Order</Text>
      </TouchableOpacity>
    </View>
  );

  if (items.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
        <Header />
        <EmptyCart />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <DeliveryBanner />
        
        {/* Cart Items */}
        {items.map((item, index) => (
          <CartItemCard key={item.id} item={item} index={index} />
        ))}

        {/* Coupon Section */}
        <View style={[styles.couponCard, { backgroundColor: theme.colors.cardBackground }]}>
          <View style={styles.couponHeader}>
            <Icon name="tag" size={18} color={theme.colors.primary} />
            <Text style={[styles.couponTitle, { color: theme.colors.textPrimary }]}>Apply Coupon</Text>
          </View>
          <CouponInput
            onApply={applyCoupon}
            onRemove={removeCoupon}
            appliedCoupon={appliedCoupon?.code}
          />
        </View>

        {/* Price Details */}
        <PriceDetails />

        {/* Trust Badges */}
        <View style={[styles.trustSection, { backgroundColor: theme.colors.cardBackground }]}>
          <View style={styles.trustItem}>
            <Icon name="shield" size={24} color={theme.colors.textTertiary} />
            <Text style={[styles.trustText, { color: theme.colors.textSecondary }]}>Safe & Secure{'\n'}Payments</Text>
          </View>
          <View style={styles.trustItem}>
            <Icon name="refresh-cw" size={24} color={theme.colors.textTertiary} />
            <Text style={[styles.trustText, { color: theme.colors.textSecondary }]}>Easy{'\n'}Returns</Text>
          </View>
          <View style={styles.trustItem}>
            <Icon name="check-circle" size={24} color={theme.colors.textTertiary} />
            <Text style={[styles.trustText, { color: theme.colors.textSecondary }]}>100%{'\n'}Authentic</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button - Inline at bottom */}
      <CheckoutSection />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  headerBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Delivery Banner
  deliveryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  deliveryText: {
    flex: 1,
    fontSize: 13,
    color: '#2E7D32',
  },
  deliveryBold: {
    fontWeight: '700',
  },
  deliveryAdd: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },

  // Item Card
  itemCard: {
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  sellerText: {
    fontSize: 12,
  },
  sellerName: {
    fontWeight: '600',
    color: '#2874F0',
  },
  sellerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sellerBadgeText: {
    fontSize: 11,
    color: '#FF9800',
    fontWeight: '600',
  },
  itemContent: {
    flexDirection: 'row',
    padding: 12,
  },
  itemImageContainer: {
    position: 'relative',
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  discountBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 4,
  },
  itemBrand: {
    fontSize: 12,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  originalPrice: {
    fontSize: 13,
    textDecorationLine: 'line-through',
  },
  savingsText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  deliveryInfoText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnDisabled: {
    opacity: 0.5,
  },
  qtyValue: {
    paddingHorizontal: 16,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '700',
  },
  itemActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  actionDivider: {
    width: 1,
  },

  // Coupon Card
  couponCard: {
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 8,
    padding: 12,
  },
  couponHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  couponTitle: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Price Card
  priceCard: {
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 8,
    padding: 16,
  },
  priceCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceLabel: {
    fontSize: 14,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalDivider: {
    height: 1,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    borderRadius: 6,
    gap: 8,
  },
  savingsBannerText: {
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '600',
  },

  // Trust Section
  trustSection: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 8,
    padding: 16,
  },
  trustItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  trustText: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
  },

  // Empty Cart
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  shopNowBtn: {
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 4,
  },
  shopNowText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Checkout Section
  checkoutSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 100,
    borderTopWidth: 1,
  },
  checkoutLeft: {
    marginRight: 16,
  },
  checkoutTotal: {
    fontSize: 18,
    fontWeight: '700',
  },
  viewDetails: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  checkoutBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CartScreen;
