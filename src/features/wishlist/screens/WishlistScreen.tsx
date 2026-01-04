// ============================================
// AutoCart - Wishlist Screen
// ============================================

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../../theme';
import { Icon, EmptyState } from '../../../components';
import { useWishlistStore, useCartStore } from '../../../store';
import { WishlistItem } from '../../../types';

const WishlistScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { items, removeFromWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleProductPress = (productId: string) => {
    (navigation as any).navigate('Home', { screen: 'ProductDetails', params: { productId } });
  };

  const handleAddToCart = (item: WishlistItem) => {
    addToCart(item.product);
    removeFromWishlist(item.productId);
  };

  // Header
  const Header = () => (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={['#E91E63', '#C2185B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <StatusBar barStyle="light-content" backgroundColor="#E91E63" />
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleSection}>
            <View style={styles.headerTitleRow}>
              <Icon name="heart" size={22} color="#FFFFFF" />
              <Text style={styles.headerTitle}>My Wishlist</Text>
            </View>
            <Text style={styles.headerSubtitle}>{items.length} items saved</Text>
          </View>
          {items.length > 0 && (
            <TouchableOpacity style={styles.addAllBtn}>
              <Text style={styles.addAllText}>Add All</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </View>
  );

  // Wishlist Item
  const renderItem = ({ item }: { item: WishlistItem }) => {
    const discount = item.product.originalPrice
      ? Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100)
      : 0;

    return (
      <Animated.View
        style={[
          styles.itemCard,
          { backgroundColor: theme.colors.cardBackground, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}
      >
        <TouchableOpacity
          style={styles.itemContent}
          onPress={() => handleProductPress(item.productId)}
          activeOpacity={0.8}
        >
          <View style={styles.itemImageContainer}>
            <Image source={{ uri: item.product.thumbnail }} style={styles.itemImage} />
            {discount > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{discount}% OFF</Text>
              </View>
            )}
          </View>

          <View style={styles.itemInfo}>
            <Text style={[styles.itemBrand, { color: theme.colors.textSecondary }]}>
              {item.product.vendor?.name || 'Brand'}
            </Text>
            <Text style={[styles.itemName, { color: theme.colors.textPrimary }]} numberOfLines={2}>
              {item.product.name}
            </Text>
            <View style={styles.itemPriceRow}>
              <Text style={[styles.itemPrice, { color: theme.colors.textPrimary }]}>
                ${item.product.price.toFixed(2)}
              </Text>
              {item.product.originalPrice && (
                <Text style={[styles.itemOriginalPrice, { color: theme.colors.textTertiary }]}>
                  ${item.product.originalPrice.toFixed(2)}
                </Text>
              )}
            </View>
            <View style={styles.itemRating}>
              <Icon name="star" size={14} color="#FFC107" />
              <Text style={[styles.itemRatingText, { color: theme.colors.textSecondary }]}>
                {item.product.rating} ({item.product.reviewCount})
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.itemActions}>
          <TouchableOpacity
            style={styles.addToCartBtn}
            onPress={() => handleAddToCart(item)}
          >
            <LinearGradient
              colors={['#2874F0', '#1565C0']}
              style={styles.addToCartGradient}
            >
              <Icon name="shopping-cart" size={16} color="#FFFFFF" />
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.removeBtn, { borderColor: theme.colors.error }]}
            onPress={() => removeFromWishlist(item.productId)}
          >
            <Icon name="trash-2" size={18} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  // Empty State
  const EmptyWishlist = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconCircle, { backgroundColor: theme.colors.border }]}>
        <Icon name="heart" size={60} color={theme.colors.textTertiary} />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>
        Your Wishlist is Empty
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
        Save items you love by tapping the heart icon on any product.
      </Text>
      <TouchableOpacity
        style={styles.startShoppingBtn}
        onPress={() => (navigation as any).navigate('Home')}
      >
        <LinearGradient
          colors={['#E91E63', '#C2185B']}
          style={styles.startShoppingGradient}
        >
          <Icon name="shopping-bag" size={20} color="#FFFFFF" />
          <Text style={styles.startShoppingText}>Start Shopping</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <Header />
      {items.length === 0 ? (
        <EmptyWishlist />
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },

  // Header
  headerContainer: {
    overflow: 'hidden',
  },
  headerGradient: {
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitleSection: {
    flex: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  addAllBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Item Card
  itemCard: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  },
  discountBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#F44336',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemBrand: {
    fontSize: 12,
    marginBottom: 2,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    lineHeight: 18,
  },
  itemPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  itemOriginalPrice: {
    fontSize: 13,
    textDecorationLine: 'line-through',
  },
  itemRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemRatingText: {
    fontSize: 12,
  },

  // Actions
  itemActions: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 10,
  },
  addToCartBtn: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  addToCartGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  removeBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Empty State
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
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  startShoppingBtn: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  startShoppingGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 14,
    gap: 8,
  },
  startShoppingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WishlistScreen;
