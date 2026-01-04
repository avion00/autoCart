// ============================================
// AutoCart - Modern Cart Notification Component
// ============================================

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { useTheme } from '../theme';
import Icon from './Icon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CartNotificationProps {
  visible: boolean;
  product: {
    name: string;
    price: number;
    thumbnail: string;
    quantity?: number;
  } | null;
  onContinueShopping: () => void;
  onGoToCart: () => void;
  onClose: () => void;
}

const CartNotification: React.FC<CartNotificationProps> = ({
  visible,
  product,
  onContinueShopping,
  onGoToCart,
  onClose,
}) => {
  const theme = useTheme();
  const slideAnim = useRef(new Animated.Value(300)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible || !product) return null;

  return (
    <View style={styles.container}>
      {/* Backdrop */}
      <Animated.View
        style={[styles.backdrop, { opacity: backdropAnim }]}
      >
        <TouchableOpacity style={styles.backdropTouch} onPress={onClose} activeOpacity={1} />
      </Animated.View>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          { backgroundColor: theme.colors.cardBackground, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Handle */}
        <View style={styles.handleContainer}>
          <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />
        </View>

        {/* Success Header */}
        <View style={styles.successHeader}>
          <View style={styles.successIconContainer}>
            <Icon name="check" size={20} color="#FFFFFF" />
          </View>
          <Text style={[styles.successText, { color: theme.colors.textPrimary }]}>
            Added to Cart
          </Text>
        </View>

        {/* Product Info */}
        <View style={styles.productSection}>
          <Image source={{ uri: product.thumbnail }} style={styles.productImage} />
          <View style={styles.productInfo}>
            <Text style={[styles.productName, { color: theme.colors.textPrimary }]} numberOfLines={2}>
              {product.name}
            </Text>
            <View style={styles.productMeta}>
              <Text style={[styles.productPrice, { color: theme.colors.primary }]}>
                ${product.price.toFixed(2)}
              </Text>
              {product.quantity && product.quantity > 1 && (
                <Text style={[styles.productQty, { color: theme.colors.textSecondary }]}>
                  × {product.quantity}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Delivery Info */}
        <View style={[styles.deliveryBanner, { backgroundColor: theme.colors.background }]}>
          <Icon name="truck" size={16} color={theme.colors.success} />
          <Text style={[styles.deliveryText, { color: theme.colors.success }]}>
            Free Delivery on orders above $50
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.continueBtn, { borderColor: theme.colors.primary }]}
            onPress={onContinueShopping}
          >
            <Text style={[styles.continueBtnText, { color: theme.colors.primary }]}>
              Continue Shopping
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartBtn} onPress={onGoToCart}>
            <View style={styles.cartBtnGradient}>
              <Icon name="shopping-cart" size={18} color="#FFFFFF" />
              <Text style={styles.cartBtnText}>Go to Cart</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdropTouch: {
    flex: 1,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 34,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  successHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 10,
  },
  successIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    fontSize: 18,
    fontWeight: '700',
  },
  productSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 20,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
  },
  productQty: {
    fontSize: 14,
  },
  deliveryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  deliveryText: {
    fontSize: 13,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  continueBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  cartBtn: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cartBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: '#FF9800',
    gap: 8,
  },
  cartBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CartNotification;
