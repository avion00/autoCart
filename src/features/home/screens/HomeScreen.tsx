// ============================================
// AutoCart - Home Screen
// ============================================

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
  Dimensions,
  StatusBar,
  Alert,
  ToastAndroid,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../../theme';
import { Icon, ProductCard, Loader } from '../../../components';
import { useProductStore, useCartStore, useWishlistStore } from '../../../store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  // All hooks must be called in the same order on every render
  // 1. useState hooks
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  
  // 2. useRef hooks
  const bannerScrollRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  // 3. useContext/custom hooks
  const theme = useTheme();
  const navigation = useNavigation();
  
  // 4. Store hooks
  const { 
    products, 
    featuredProducts,
    dealProducts,
    trendingProducts,
    newArrivals,
    topRatedProducts,
    recentlyViewed,
    categories, 
    banners,
    isLoading, 
    fetchProducts, 
    fetchFeaturedProducts,
    fetchDealProducts,
    fetchTrendingProducts,
    fetchNewArrivals,
    fetchTopRatedProducts,
    fetchCategories,
    fetchBanners 
  } = useProductStore();
  const cartCount = useCartStore(s => s.itemCount);
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    const loadData = async () => {
      await fetchProducts();
      await fetchFeaturedProducts();
      await fetchDealProducts();
      await fetchTrendingProducts();
      await fetchNewArrivals();
      await fetchTopRatedProducts();
      await fetchCategories();
      await fetchBanners();
    };
    loadData();
    
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  // Auto-scroll banners
  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => {
        const next = (prev + 1) % banners.length;
        bannerScrollRef.current?.scrollTo({ x: next * SCREEN_WIDTH, animated: true });
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const handleProductPress = (productId: string) => {
    (navigation as any).navigate('ProductDetails', { productId });
  };

  const handleSearchPress = () => {
    (navigation as any).navigate('Search');
  };

  const handleCategoryPress = (categoryId: string, categoryName: string) => {
    (navigation as any).navigate('Categories', {
      screen: 'CategoryProducts',
      params: { categoryId, categoryName },
    });
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
    // Show feedback to user
    if (Platform.OS === 'android') {
      ToastAndroid.show(`${product.name} added to cart`, ToastAndroid.SHORT);
    } else {
      Alert.alert('Added to Cart', `${product.name} added to cart`);
    }
  };

  const handleToggleWishlist = (product: any) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      if (Platform.OS === 'android') {
        ToastAndroid.show('Removed from wishlist', ToastAndroid.SHORT);
      }
    } else {
      addToWishlist(product);
      if (Platform.OS === 'android') {
        ToastAndroid.show('Added to wishlist', ToastAndroid.SHORT);
      }
    }
  };

  // Header Component - Flipkart Style
  const Header = () => (
    <View style={styles.header}>
      <LinearGradient
        colors={['#2874F0', '#1565C0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <StatusBar barStyle="light-content" backgroundColor="#2874F0" />
        
        {/* Top Row - Logo, Search, Icons */}
        <View style={styles.headerTop}>
          {/* Logo */}
          <View style={styles.logoSection}>
            <Image 
              source={require('../../../assets/autocart.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
            <View style={styles.logoTextWrapper}>
              <Text style={styles.logoText}>AutoCart</Text>
              <View style={styles.exploreRow}>
                <Text style={styles.exploreText}>Explore</Text>
                <View style={styles.plusBadge}>
                  <Text style={styles.plusText}>Plus</Text>
                </View>
                <Icon name="chevron-down" size={14} color="#FFD700" style={{ marginLeft: 2 }} />
              </View>
            </View>
          </View>
          
          {/* Right Actions */}
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerBtn}>
              <Icon name="bell" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerBtn}
              onPress={() => (navigation as any).navigate('Cart')}
            >
              <Icon name="shopping-cart" size={20} color="#FFFFFF" />
              {cartCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartCount > 9 ? '9+' : cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Search Bar */}
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={handleSearchPress}
          activeOpacity={0.9}
        >
          <Icon name="search" size={18} color="#2874F0" />
          <Text style={styles.searchPlaceholder}>
            Search for Products, Brands and More
          </Text>
          <View style={styles.searchDivider} />
          <Icon name="mic" size={18} color="#2874F0" />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  // Banner Carousel
  const BannerCarousel = () => (
    <View style={styles.bannerWrapper}>
      <ScrollView
        ref={bannerScrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.bannerContainer}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentBannerIndex(index);
        }}
      >
        {banners.map((banner, index) => (
          <TouchableOpacity key={banner.id} activeOpacity={0.9}>
            <Image
              source={{ uri: banner.image }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.bannerOverlay}
            >
              <Text style={styles.bannerTitle}>{banner.title}</Text>
              <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.bannerIndicators}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.bannerDot,
              { backgroundColor: index === currentBannerIndex ? '#FFFFFF' : 'rgba(255,255,255,0.5)' }
            ]}
          />
        ))}
      </View>
    </View>
  );

  // Categories Section
  const CategoriesSection = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Shop by Category
        </Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryCard, { backgroundColor: theme.colors.cardBackground }]}
            activeOpacity={0.8}
            onPress={() => handleCategoryPress(category.id, category.name)}
          >
            <View style={[styles.categoryIconBox, { backgroundColor: theme.colors.primary + '15' }]}>
              <Icon name={category.icon as any} size={24} color={theme.colors.primary} />
            </View>
            <Text style={[styles.categoryName, { color: theme.colors.textPrimary }]} numberOfLines={1}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );

  // Featured Products Section
  const FeaturedSection = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Icon name="award" size={20} color="#FF9800" />
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, marginLeft: 8 }]}>
            AutoCart Plus
          </Text>
          <View style={styles.plusTagSmall}>
            <Icon name="zap" size={10} color="#000" />
          </View>
        </View>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productsScroll}>
        {featuredProducts.map((product) => (
          <View key={product.id} style={styles.compactCardWrapper}>
            <ProductCard
              product={product}
              variant="compact"
              onPress={() => handleProductPress(product.id)}
              onAddToWishlist={() => handleToggleWishlist(product)}
              isInWishlist={isInWishlist(product.id)}
            />
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );

  // Flash Deals Banner
  const FlashDealsBanner = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={[styles.dealsCard, { backgroundColor: '#FF5722' }]}>
        <LinearGradient
          colors={['#FF5722', '#E64A19']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.dealsGradient}
        >
          <View style={styles.dealsContent}>
            <View style={styles.flashBadge}>
              <Icon name="zap" size={14} color="#FF5722" />
              <Text style={styles.flashBadgeText}>FLASH SALE</Text>
            </View>
            <Text style={styles.dealsTitle}>Today's Deals</Text>
            <Text style={styles.dealsSubtitle}>Up to 70% OFF</Text>
            <TouchableOpacity style={styles.dealsBtn}>
              <Text style={styles.dealsBtnText}>Shop Now</Text>
              <Icon name="arrow-right" size={16} color="#FF5722" />
            </TouchableOpacity>
          </View>
          <View style={styles.dealsImageBox}>
            <Icon name="percent" size={60} color="rgba(255,255,255,0.3)" />
          </View>
        </LinearGradient>
      </View>
    </Animated.View>
  );

  // Deal Products Section
  const DealProductsSection = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Icon name="percent" size={20} color="#E91E63" />
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, marginLeft: 8 }]}>
            Best Deals
          </Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productsScroll}>
        {dealProducts.map((product) => (
          <View key={product.id} style={styles.compactCardWrapper}>
            <ProductCard
              product={product}
              variant="compact"
              onPress={() => handleProductPress(product.id)}
              onAddToWishlist={() => handleToggleWishlist(product)}
              isInWishlist={isInWishlist(product.id)}
            />
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );

  // Trending Products Section
  const TrendingSection = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Icon name="trending-up" size={20} color="#9C27B0" />
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, marginLeft: 8 }]}>
            Trending Now
          </Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productsScroll}>
        {trendingProducts.map((product) => (
          <View key={product.id} style={styles.compactCardWrapper}>
            <ProductCard
              product={product}
              variant="compact"
              onPress={() => handleProductPress(product.id)}
              onAddToWishlist={() => handleToggleWishlist(product)}
              isInWishlist={isInWishlist(product.id)}
            />
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );

  // New Arrivals Section
  const NewArrivalsSection = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Icon name="package" size={20} color="#00BCD4" />
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, marginLeft: 8 }]}>
            New Arrivals
          </Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productsScroll}>
        {newArrivals.map((product) => (
          <View key={product.id} style={styles.compactCardWrapper}>
            <ProductCard
              product={product}
              variant="compact"
              onPress={() => handleProductPress(product.id)}
              onAddToWishlist={() => handleToggleWishlist(product)}
              isInWishlist={isInWishlist(product.id)}
            />
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );

  // Top Rated Section
  const TopRatedSection = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Icon name="star" size={20} color="#FFC107" />
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, marginLeft: 8 }]}>
            Top Rated
          </Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productsScroll}>
        {topRatedProducts.map((product) => (
          <View key={product.id} style={styles.compactCardWrapper}>
            <ProductCard
              product={product}
              variant="compact"
              onPress={() => handleProductPress(product.id)}
              onAddToWishlist={() => handleToggleWishlist(product)}
              isInWishlist={isInWishlist(product.id)}
            />
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );

  // Recently Viewed Section
  const RecentlyViewedSection = () => {
    if (recentlyViewed.length === 0) return null;
    return (
      <Animated.View style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Icon name="clock" size={20} color="#607D8B" />
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, marginLeft: 8 }]}>
              Recently Viewed
            </Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Clear</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productsScroll}>
          {recentlyViewed.map((product) => (
            <View key={product.id} style={styles.compactCardWrapper}>
              <ProductCard
                product={product}
                variant="compact"
                onPress={() => handleProductPress(product.id)}
                onAddToWishlist={() => handleToggleWishlist(product)}
                isInWishlist={isInWishlist(product.id)}
              />
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    );
  };

  // Promo Banner
  const PromoBanner = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.promoBanner}
      >
        <View style={styles.promoContent}>
          <Text style={styles.promoTitle}>AutoCart Plus</Text>
          <Text style={styles.promoSubtitle}>Free delivery on all orders</Text>
          <TouchableOpacity style={styles.promoBtn}>
            <Text style={styles.promoBtnText}>Try Free</Text>
          </TouchableOpacity>
        </View>
        <Icon name="truck" size={50} color="rgba(255,255,255,0.3)" />
      </LinearGradient>
    </Animated.View>
  );

  // All Products Section - Grid with Add to Cart buttons
  const AllProductsSection = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Icon name="grid" size={20} color="#2874F0" />
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, marginLeft: 8 }]}>
            Popular Products
          </Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.productsGrid}>
        {products.slice(0, 6).map((product) => (
          <View key={product.id} style={styles.gridItem}>
            <ProductCard
              product={product}
              variant="grid"
              onPress={() => handleProductPress(product.id)}
              onAddToWishlist={() => handleToggleWishlist(product)}
              isInWishlist={isInWishlist(product.id)}
              showAddToCart
              onAddToCart={() => handleAddToCart(product)}
            />
          </View>
        ))}
      </View>
    </Animated.View>
  );

  if (isLoading && products.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
        <Header />
        <View style={styles.loaderContainer}>
          <Loader />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <BannerCarousel />
        <CategoriesSection />
        <FlashDealsBanner />
        <DealProductsSection />
        <FeaturedSection />
        <PromoBanner />
        <TrendingSection />
        <NewArrivalsSection />
        <TopRatedSection />
        <RecentlyViewedSection />
        <AllProductsSection />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Header
  header: {
    overflow: 'hidden',
  },
  headerGradient: {
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 36,
    height: 36,
    borderRadius: 6,
  },
  logoTextWrapper: {
    marginLeft: 10,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  exploreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  exploreText: {
    fontSize: 11,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  plusBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
    marginLeft: 4,
  },
  plusText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#000000',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF5722',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 4,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
  },
  searchDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },

  // Banner
  bannerWrapper: {
    position: 'relative',
  },
  bannerContainer: {
    height: 200,
  },
  bannerImage: {
    width: SCREEN_WIDTH,
    height: 200,
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 30,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 4,
  },
  bannerIndicators: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  bannerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Sections
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 14,
    color: '#2874F0',
    fontWeight: '600',
  },

  // Categories
  categoriesScroll: {
    gap: 12,
  },
  categoryCard: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    width: 80,
  },
  categoryIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Products
  productsScroll: {
    paddingRight: 16,
    gap: 10,
  },
  productCardWrapper: {
    width: 160,
  },
  compactCardWrapper: {
    marginRight: 10,
  },
  plusTagSmall: {
    backgroundColor: '#FFD700',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: (SCREEN_WIDTH - 44) / 2,
  },

  // Deals
  dealsCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  dealsGradient: {
    flexDirection: 'row',
    padding: 20,
  },
  dealsContent: {
    flex: 1,
  },
  flashBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
    gap: 4,
  },
  flashBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FF5722',
  },
  dealsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dealsSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 4,
    marginBottom: 16,
  },
  dealsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 6,
  },
  dealsBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF5722',
  },
  dealsImageBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Promo Banner
  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 16,
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  promoSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 4,
    marginBottom: 12,
  },
  promoBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  promoBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
  },
});

export default HomeScreen;
