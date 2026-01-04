// ============================================
// AutoCart - Product Details Screen (Flipkart Style)
// ============================================

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  StatusBar,
  Share,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../../theme';
import { Icon, Loader } from '../../../components';
import { useProductStore, useCartStore, useWishlistStore } from '../../../store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ProductDetailsScreen: React.FC = () => {
  // State hooks first
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [pincode, setPincode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState<string | null>(null);
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Ref hooks
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Context hooks
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params as { productId: string };

  // Store hooks
  const { selectedProduct, isLoading, fetchProductById, products } = useProductStore();
  const { addToCart, itemCount: cartCount } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    fetchProductById(productId);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [productId]);

  const product = selectedProduct;
  const inWishlist = product ? isInWishlist(product.id) : false;

  // Get similar products from same category
  const similarProducts = products
    .filter(p => p.categoryId === product?.categoryId && p.id !== product?.id)
    .slice(0, 6);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      Alert.alert(
        'Added to Cart',
        `${quantity} x ${product.name} added to your cart`,
        [
          { text: 'Continue Shopping' },
          { text: 'Go to Cart', onPress: () => (navigation as any).navigate('Cart') }
        ]
      );
    }
  };

  const handleToggleWishlist = () => {
    if (product) {
      if (inWishlist) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product);
      (navigation as any).navigate('Cart');
    }
  };

  const handleShare = async () => {
    if (product) {
      try {
        await Share.share({
          message: `Check out ${product.name} on AutoCart for just $${product.price}!`,
          title: product.name,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const handleCheckDelivery = () => {
    if (pincode.length >= 5) {
      const deliveryDays = Math.floor(Math.random() * 3) + 2;
      const date = new Date();
      date.setDate(date.getDate() + deliveryDays);
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      setDeliveryInfo(`Delivery by ${dateStr}`);
    } else {
      Alert.alert('Invalid Pincode', 'Please enter a valid pincode');
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= 10) {
      setQuantity(newQty);
    }
  };

  // Header Component
  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={[styles.headerBtn, { backgroundColor: theme.colors.cardBackground }]}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-left" size={22} color={theme.colors.textPrimary} />
      </TouchableOpacity>
      <View style={styles.headerActions}>
        <TouchableOpacity
          style={[styles.headerBtn, { backgroundColor: theme.colors.cardBackground }]}
          onPress={handleShare}
        >
          <Icon name="share-2" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.headerBtn, { backgroundColor: theme.colors.cardBackground }]}
          onPress={() => (navigation as any).navigate('Cart')}
        >
          <Icon name="shopping-cart" size={20} color={theme.colors.textPrimary} />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount > 9 ? '9+' : cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading || !product) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Header />
        <View style={styles.loaderContainer}>
          <Loader />
        </View>
      </SafeAreaView>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <Header />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Image Gallery */}
        <View style={[styles.imageSection, { backgroundColor: theme.colors.cardBackground }]}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setActiveImageIndex(index);
            }}
          >
            {product.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.productImage} resizeMode="contain" />
            ))}
          </ScrollView>

          {/* Image Counter */}
          <View style={styles.imageCounter}>
            <Text style={styles.imageCounterText}>
              {activeImageIndex + 1}/{product.images.length}
            </Text>
          </View>

          {/* Thumbnail Strip */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbnailStrip}>
            {product.images.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setActiveImageIndex(index)}
                style={[
                  styles.thumbnail,
                  { borderColor: index === activeImageIndex ? theme.colors.primary : theme.colors.border }
                ]}
              >
                <Image source={{ uri: image }} style={styles.thumbnailImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.imageActions}>
            <TouchableOpacity
              style={[styles.imageActionBtn, { backgroundColor: theme.colors.cardBackground }]}
              onPress={handleToggleWishlist}
            >
              <Icon name="heart" size={20} color={inWishlist ? '#E91E63' : theme.colors.textTertiary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.imageActionBtn, { backgroundColor: theme.colors.cardBackground }]}
              onPress={handleShare}
            >
              <Icon name="share-2" size={20} color={theme.colors.textTertiary} />
            </TouchableOpacity>
          </View>

          {/* Discount Badge */}
          {discount > 0 && (
            <View style={styles.discountBadgeImage}>
              <Text style={styles.discountBadgeImageText}>{discount}% OFF</Text>
            </View>
          )}
        </View>

        {/* Product Info Card */}
        <View style={[styles.infoCard, { backgroundColor: theme.colors.cardBackground }]}>
          {/* Brand */}
          <TouchableOpacity style={styles.brandRow}>
            <Text style={[styles.brandName, { color: theme.colors.primary }]}>
              {product.vendor?.name || 'Brand'}
            </Text>
            <Icon name="chevron-right" size={16} color={theme.colors.primary} />
          </TouchableOpacity>

          {/* Product Name */}
          <Text style={[styles.productName, { color: theme.colors.textPrimary }]}>
            {product.name}
          </Text>

          {/* Rating Row */}
          <TouchableOpacity style={styles.ratingRow}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>{product.rating}</Text>
              <Icon name="star" size={12} color="#FFFFFF" />
            </View>
            <Text style={[styles.ratingCount, { color: theme.colors.textSecondary }]}>
              {product.reviewCount.toLocaleString()} Ratings & Reviews
            </Text>
            <Icon name="chevron-right" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          {/* AutoCart Plus Badge */}
          {product.isAutoCartPlus && (
            <View style={styles.plusBadge}>
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.plusBadgeGradient}
              >
                <Icon name="zap" size={14} color="#000" />
                <Text style={styles.plusBadgeText}>AutoCart Plus</Text>
              </LinearGradient>
              <Text style={[styles.plusBadgeInfo, { color: theme.colors.textSecondary }]}>
                Free delivery & special offers
              </Text>
            </View>
          )}

          {/* Price Row */}
          <View style={styles.priceSection}>
            <View style={styles.priceRow}>
              <Text style={[styles.price, { color: theme.colors.textPrimary }]}>
                ${product.price.toFixed(2)}
              </Text>
              {product.originalPrice && (
                <>
                  <Text style={[styles.originalPrice, { color: theme.colors.textTertiary }]}>
                    ${product.originalPrice.toFixed(2)}
                  </Text>
                  <Text style={styles.discountText}>{discount}% off</Text>
                </>
              )}
            </View>
            <Text style={[styles.taxInfo, { color: theme.colors.textTertiary }]}>
              inclusive of all taxes
            </Text>
          </View>
        </View>

        {/* Quantity & Action Buttons Section - INLINE (not absolute) */}
        <View style={[styles.quantityActionCard, { backgroundColor: theme.colors.cardBackground }]}>
          {/* Quantity Row */}
          <View style={styles.quantityRow}>
            <Text style={[styles.quantityLabel, { color: theme.colors.textPrimary }]}>Quantity</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={[styles.quantityBtn, { borderColor: theme.colors.border, backgroundColor: quantity <= 1 ? theme.colors.background : theme.colors.cardBackground }]}
                onPress={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Icon name="minus" size={18} color={quantity <= 1 ? theme.colors.textTertiary : theme.colors.primary} />
              </TouchableOpacity>
              <View style={[styles.quantityValue, { borderColor: theme.colors.border }]}>
                <Text style={[styles.quantityText, { color: theme.colors.textPrimary }]}>{quantity}</Text>
              </View>
              <TouchableOpacity
                style={[styles.quantityBtn, { borderColor: theme.colors.border, backgroundColor: quantity >= 10 ? theme.colors.background : theme.colors.cardBackground }]}
                onPress={() => handleQuantityChange(1)}
                disabled={quantity >= 10}
              >
                <Icon name="plus" size={18} color={quantity >= 10 ? theme.colors.textTertiary : theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Total Price Row */}
          <View style={[styles.totalPriceRow, { borderTopColor: theme.colors.border }]}>
            <View>
              <Text style={[styles.totalLabel, { color: theme.colors.textSecondary }]}>Total Price</Text>
              <Text style={[styles.totalItemsText, { color: theme.colors.textTertiary }]}>
                {quantity} {quantity === 1 ? 'item' : 'items'}
              </Text>
            </View>
            <Text style={[styles.totalPrice, { color: theme.colors.textPrimary }]}>
              ${(product.price * quantity).toFixed(2)}
            </Text>
          </View>

          {/* Stock Warning */}
          {product.stock < 10 && (
            <View style={styles.stockWarningBox}>
              <Icon name="alert-circle" size={14} color="#E91E63" />
              <Text style={styles.stockWarningText}>
                Only {product.stock} left in stock!
              </Text>
            </View>
          )}

          {/* Action Buttons - INLINE */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={[styles.wishlistBtn, { borderColor: theme.colors.border }]}
              onPress={handleToggleWishlist}
            >
              <Icon name="heart" size={22} color={inWishlist ? '#E91E63' : theme.colors.textTertiary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addToCartBtnInline, { borderColor: theme.colors.primary }]}
              onPress={handleAddToCart}
            >
              <Icon name="shopping-cart" size={18} color={theme.colors.primary} />
              <Text style={[styles.addToCartTextInline, { color: theme.colors.primary }]}>Add to Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buyNowBtnInline} onPress={handleBuyNow}>
              <LinearGradient
                colors={['#FF9800', '#F57C00']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buyNowGradientInline}
              >
                <Icon name="zap" size={18} color="#FFFFFF" />
                <Text style={styles.buyNowTextInline}>Buy Now</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Offers Section */}
        <View style={[styles.sectionCard, { backgroundColor: theme.colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Available Offers
          </Text>
          <View style={styles.offersList}>
            <View style={styles.offerItem}>
              <Icon name="tag" size={16} color="#4CAF50" />
              <Text style={[styles.offerText, { color: theme.colors.textPrimary }]}>
                <Text style={styles.offerBold}>Bank Offer: </Text>
                10% off on HDFC Bank Credit Cards
              </Text>
            </View>
            <View style={styles.offerItem}>
              <Icon name="tag" size={16} color="#4CAF50" />
              <Text style={[styles.offerText, { color: theme.colors.textPrimary }]}>
                <Text style={styles.offerBold}>Special Price: </Text>
                Get extra 5% off (price inclusive of discount)
              </Text>
            </View>
            <View style={styles.offerItem}>
              <Icon name="tag" size={16} color="#4CAF50" />
              <Text style={[styles.offerText, { color: theme.colors.textPrimary }]}>
                <Text style={styles.offerBold}>Partner Offer: </Text>
                Sign up for AutoCart Pay & get $50 cashback
              </Text>
            </View>
          </View>
        </View>

        {/* Delivery Section */}
        <View style={[styles.sectionCard, { backgroundColor: theme.colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Delivery Options
          </Text>
          <View style={[styles.deliveryInput, { borderColor: theme.colors.border }]}>
            <Icon name="map-pin" size={20} color={theme.colors.textTertiary} />
            <TextInput
              style={[styles.pincodeInput, { color: theme.colors.textPrimary }]}
              placeholder="Enter Pincode"
              placeholderTextColor={theme.colors.textTertiary}
              value={pincode}
              onChangeText={setPincode}
              keyboardType="numeric"
              maxLength={6}
            />
            <TouchableOpacity onPress={handleCheckDelivery}>
              <Text style={[styles.checkBtn, { color: theme.colors.primary }]}>Check</Text>
            </TouchableOpacity>
          </View>
          {deliveryInfo && (
            <View style={styles.deliveryResult}>
              <Icon name="check-circle" size={16} color="#4CAF50" />
              <Text style={[styles.deliveryResultText, { color: theme.colors.textPrimary }]}>
                {deliveryInfo}
              </Text>
            </View>
          )}
          <View style={styles.deliveryOptions}>
            <View style={styles.deliveryOption}>
              <Icon name="truck" size={20} color={theme.colors.primary} />
              <View style={styles.deliveryOptionInfo}>
                <Text style={[styles.deliveryOptionTitle, { color: theme.colors.textPrimary }]}>
                  Free Delivery
                </Text>
                <Text style={[styles.deliveryOptionDesc, { color: theme.colors.textSecondary }]}>
                  {product.isAutoCartPlus ? 'Free for Plus members' : 'Orders above $50'}
                </Text>
              </View>
            </View>
            <View style={styles.deliveryOption}>
              <Icon name="refresh-cw" size={20} color={theme.colors.primary} />
              <View style={styles.deliveryOptionInfo}>
                <Text style={[styles.deliveryOptionTitle, { color: theme.colors.textPrimary }]}>
                  {product.returnPolicy || '7 Days Return'}
                </Text>
                <Text style={[styles.deliveryOptionDesc, { color: theme.colors.textSecondary }]}>
                  Easy returns available
                </Text>
              </View>
            </View>
            <View style={styles.deliveryOption}>
              <Icon name="shield" size={20} color={theme.colors.primary} />
              <View style={styles.deliveryOptionInfo}>
                <Text style={[styles.deliveryOptionTitle, { color: theme.colors.textPrimary }]}>
                  {product.warranty || '1 Year Warranty'}
                </Text>
                <Text style={[styles.deliveryOptionDesc, { color: theme.colors.textSecondary }]}>
                  Brand warranty
                </Text>
              </View>
            </View>
          </View>
        </View>


        {/* Highlights */}
        <View style={[styles.sectionCard, { backgroundColor: theme.colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Highlights</Text>
          <View style={styles.highlightItem}>
            <Icon name="check" size={16} color="#4CAF50" />
            <Text style={[styles.highlightText, { color: theme.colors.textSecondary }]}>
              Premium quality material
            </Text>
          </View>
          <View style={styles.highlightItem}>
            <Icon name="check" size={16} color="#4CAF50" />
            <Text style={[styles.highlightText, { color: theme.colors.textSecondary }]}>
              Easy returns within 30 days
            </Text>
          </View>
          <View style={styles.highlightItem}>
            <Icon name="check" size={16} color="#4CAF50" />
            <Text style={[styles.highlightText, { color: theme.colors.textSecondary }]}>
              Genuine product guaranteed
            </Text>
          </View>
          <View style={styles.highlightItem}>
            <Icon name="check" size={16} color="#4CAF50" />
            <Text style={[styles.highlightText, { color: theme.colors.textSecondary }]}>
              Cash on delivery available
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={[styles.sectionCard, { backgroundColor: theme.colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Description</Text>
          <Text
            style={[styles.description, { color: theme.colors.textSecondary }]}
            numberOfLines={showFullDescription ? undefined : 4}
          >
            {product.description}
          </Text>
          <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
            <Text style={[styles.readMore, { color: theme.colors.primary }]}>
              {showFullDescription ? 'Read Less' : 'Read More'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Specifications */}
        {product.specifications && (
          <View style={[styles.sectionCard, { backgroundColor: theme.colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Specifications</Text>
            {Object.entries(product.specifications)
              .slice(0, showAllSpecs ? undefined : 4)
              .map(([key, value]) => (
                <View key={key} style={[styles.specRow, { borderBottomColor: theme.colors.border }]}>
                  <Text style={[styles.specLabel, { color: theme.colors.textSecondary }]}>{key}</Text>
                  <Text style={[styles.specValue, { color: theme.colors.textPrimary }]}>{value}</Text>
                </View>
              ))}
            {Object.keys(product.specifications).length > 4 && (
              <TouchableOpacity onPress={() => setShowAllSpecs(!showAllSpecs)}>
                <Text style={[styles.readMore, { color: theme.colors.primary }]}>
                  {showAllSpecs ? 'View Less' : 'View All Specifications'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Seller Info */}
        <View style={[styles.sectionCard, { backgroundColor: theme.colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Seller</Text>
          <View style={styles.sellerInfo}>
            <View style={styles.sellerHeader}>
              <Text style={[styles.sellerName, { color: theme.colors.primary }]}>
                {product.vendor?.name || 'AutoCart Seller'}
              </Text>
              <View style={styles.sellerRating}>
                <Text style={styles.sellerRatingText}>{product.vendor?.rating || 4.5}</Text>
                <Icon name="star" size={12} color="#FFFFFF" />
              </View>
            </View>
            <View style={styles.sellerStats}>
              <View style={styles.sellerStat}>
                <Text style={[styles.sellerStatValue, { color: theme.colors.textPrimary }]}>98%</Text>
                <Text style={[styles.sellerStatLabel, { color: theme.colors.textSecondary }]}>Positive</Text>
              </View>
              <View style={[styles.sellerStatDivider, { backgroundColor: theme.colors.border }]} />
              <View style={styles.sellerStat}>
                <Text style={[styles.sellerStatValue, { color: theme.colors.textPrimary }]}>
                  {product.vendor?.reviewCount?.toLocaleString() || '10K+'}
                </Text>
                <Text style={[styles.sellerStatLabel, { color: theme.colors.textSecondary }]}>Reviews</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <View style={[styles.sectionCard, { backgroundColor: theme.colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Similar Products</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.similarScroll}>
              {similarProducts.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.similarCard, { borderColor: theme.colors.border }]}
                  onPress={() => {
                    (navigation as any).push('ProductDetails', { productId: item.id });
                  }}
                >
                  <Image source={{ uri: item.thumbnail }} style={styles.similarImage} />
                  <Text style={[styles.similarName, { color: theme.colors.textPrimary }]} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={[styles.similarPrice, { color: theme.colors.textPrimary }]}>
                    ${item.price.toFixed(2)}
                  </Text>
                  <View style={styles.similarRating}>
                    <Icon name="star" size={12} color="#FFC107" />
                    <Text style={[styles.similarRatingText, { color: theme.colors.textSecondary }]}>
                      {item.rating}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#E91E63',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },

  // Image Section
  imageSection: {
    paddingTop: 80,
  },
  productImage: {
    width: SCREEN_WIDTH,
    height: 350,
  },
  imageCounter: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageCounterText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  thumbnailStrip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    marginRight: 10,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  imageActions: {
    position: 'absolute',
    top: 100,
    right: 16,
    gap: 10,
  },
  imageActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  discountBadgeImage: {
    position: 'absolute',
    top: 100,
    left: 16,
    backgroundColor: '#E91E63',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  discountBadgeImageText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // Info Card
  infoCard: {
    padding: 16,
    marginBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandName: {
    fontSize: 14,
    fontWeight: '600',
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#388E3C',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  ratingCount: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },
  plusBadge: {
    marginBottom: 12,
  },
  plusBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  plusBadgeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '700',
  },
  plusBadgeInfo: {
    fontSize: 12,
    marginTop: 4,
  },
  priceSection: {
    marginTop: 8,
  },
  priceQuantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 12,
  },
  priceColumn: {
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  discountText: {
    color: '#388E3C',
    fontSize: 13,
    fontWeight: '600',
  },
  taxInfo: {
    fontSize: 11,
    marginTop: 4,
  },
  quantitySelectorInline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityBtnInline: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityValueBox: {
    minWidth: 40,
    height: 32,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityTextInline: {
    fontSize: 16,
    fontWeight: '700',
  },
  // Quantity & Action Card (INLINE - not absolute)
  quantityActionCard: {
    padding: 16,
    marginBottom: 8,
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityValue: {
    minWidth: 50,
    height: 40,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '700',
  },
  totalPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalItemsText: {
    fontSize: 12,
    marginTop: 2,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: '700',
  },
  stockWarningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    backgroundColor: '#FCE4EC',
    padding: 12,
    borderRadius: 8,
  },
  stockWarningText: {
    color: '#E91E63',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  wishlistBtn: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  addToCartBtnInline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 8,
    borderWidth: 2,
    gap: 8,
    backgroundColor: '#FFFFFF',
  },
  addToCartTextInline: {
    fontSize: 14,
    fontWeight: '700',
  },
  buyNowBtnInline: {
    flex: 1.2,
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
  },
  buyNowGradientInline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buyNowTextInline: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  // Section Card
  sectionCard: {
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },

  // Offers
  offersList: {
    gap: 10,
  },
  offerItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  offerText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  offerBold: {
    fontWeight: '600',
  },

  // Delivery
  deliveryInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  pincodeInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    fontSize: 14,
  },
  checkBtn: {
    fontSize: 14,
    fontWeight: '600',
  },
  deliveryResult: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  deliveryResultText: {
    flex: 1,
    fontSize: 13,
  },
  deliveryOptions: {
    gap: 12,
  },
  deliveryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deliveryOptionInfo: {
    flex: 1,
  },
  deliveryOptionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  deliveryOptionDesc: {
    fontSize: 12,
    marginTop: 2,
  },

  // Highlights
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  highlightText: {
    flex: 1,
    fontSize: 14,
  },

  // Description
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  readMore: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },

  // Specs
  specRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  specLabel: {
    flex: 1,
    fontSize: 14,
  },
  specValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },

  // Seller
  sellerInfo: {
    gap: 12,
  },
  sellerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sellerName: {
    fontSize: 15,
    fontWeight: '600',
  },
  sellerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#388E3C',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  sellerRatingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  sellerStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerStat: {
    flex: 1,
    alignItems: 'center',
  },
  sellerStatValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  sellerStatLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  sellerStatDivider: {
    width: 1,
    height: 30,
  },

  // Similar Products
  similarScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  similarCard: {
    width: 140,
    marginRight: 12,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  similarImage: {
    width: '100%',
    height: 100,
    borderRadius: 6,
    marginBottom: 8,
  },
  similarName: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
    height: 36,
  },
  similarPrice: {
    fontSize: 14,
    fontWeight: '700',
  },
  similarRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  similarRatingText: {
    fontSize: 12,
  },

});

export default ProductDetailsScreen;
