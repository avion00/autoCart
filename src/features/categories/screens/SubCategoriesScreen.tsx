// ============================================
// AutoCart - SubCategories Screen
// ============================================

import React, { useEffect, useRef, useState, useMemo } from 'react';
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
  FlatList,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../../theme';
import { Icon, Loader } from '../../../components';
import { useProductStore, useCartStore, useWishlistStore } from '../../../store';
import { Product } from '../../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Sub-categories data for each main category
const subCategoriesData: Record<string, Array<{ id: string; name: string; icon: string; image: string }>> = {
  '1': [ // Electronics
    { id: '1-1', name: 'Smartphones', icon: 'smartphone', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400' },
    { id: '1-2', name: 'Laptops', icon: 'monitor', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400' },
    { id: '1-3', name: 'Tablets', icon: 'tablet', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400' },
    { id: '1-4', name: 'Headphones', icon: 'headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
    { id: '1-5', name: 'Cameras', icon: 'camera', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400' },
    { id: '1-6', name: 'Gaming', icon: 'play', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400' },
    { id: '1-7', name: 'Wearables', icon: 'watch', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
    { id: '1-8', name: 'Accessories', icon: 'box', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400' },
  ],
  '2': [ // Fashion
    { id: '2-1', name: 'Men\'s Wear', icon: 'user', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400' },
    { id: '2-2', name: 'Women\'s Wear', icon: 'user', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400' },
    { id: '2-3', name: 'Kids\' Wear', icon: 'smile', image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400' },
    { id: '2-4', name: 'Footwear', icon: 'disc', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
    { id: '2-5', name: 'Watches', icon: 'watch', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400' },
    { id: '2-6', name: 'Sunglasses', icon: 'sun', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400' },
    { id: '2-7', name: 'Bags', icon: 'shopping-bag', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400' },
    { id: '2-8', name: 'Jewelry', icon: 'star', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400' },
  ],
  '3': [ // Home & Living
    { id: '3-1', name: 'Furniture', icon: 'home', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400' },
    { id: '3-2', name: 'Decor', icon: 'image', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=400' },
    { id: '3-3', name: 'Kitchen', icon: 'coffee', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400' },
    { id: '3-4', name: 'Bedding', icon: 'moon', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400' },
    { id: '3-5', name: 'Lighting', icon: 'sun', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
    { id: '3-6', name: 'Storage', icon: 'archive', image: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=400' },
  ],
  '4': [ // Beauty
    { id: '4-1', name: 'Skincare', icon: 'droplet', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400' },
    { id: '4-2', name: 'Makeup', icon: 'edit-3', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400' },
    { id: '4-3', name: 'Haircare', icon: 'scissors', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400' },
    { id: '4-4', name: 'Fragrances', icon: 'wind', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400' },
    { id: '4-5', name: 'Tools', icon: 'tool', image: 'https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=400' },
  ],
  '5': [ // Sports
    { id: '5-1', name: 'Fitness', icon: 'activity', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400' },
    { id: '5-2', name: 'Running', icon: 'zap', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400' },
    { id: '5-3', name: 'Yoga', icon: 'heart', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400' },
    { id: '5-4', name: 'Outdoor', icon: 'compass', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400' },
    { id: '5-5', name: 'Team Sports', icon: 'users', image: 'https://images.unsplash.com/photo-1461896836934- voices-of-the-game?w=400' },
  ],
  '6': [ // Books & More
    { id: '6-1', name: 'Fiction', icon: 'book-open', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400' },
    { id: '6-2', name: 'Non-Fiction', icon: 'book', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400' },
    { id: '6-3', name: 'Educational', icon: 'award', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400' },
    { id: '6-4', name: 'Stationery', icon: 'edit', image: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=400' },
  ],
  '7': [ // Gaming
    { id: '7-1', name: 'Consoles', icon: 'monitor', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400' },
    { id: '7-2', name: 'PC Gaming', icon: 'cpu', image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400' },
    { id: '7-3', name: 'Accessories', icon: 'headphones', image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400' },
    { id: '7-4', name: 'Games', icon: 'disc', image: 'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=400' },
  ],
  '8': [ // Grocery
    { id: '8-1', name: 'Fresh Produce', icon: 'sun', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400' },
    { id: '8-2', name: 'Dairy', icon: 'droplet', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400' },
    { id: '8-3', name: 'Beverages', icon: 'coffee', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400' },
    { id: '8-4', name: 'Snacks', icon: 'package', image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400' },
    { id: '8-5', name: 'Pantry', icon: 'archive', image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400' },
  ],
};

// Brand data for each category
const brandsData: Record<string, Array<{ id: string; name: string; logo: string; discount?: string }>> = {
  '1': [
    { id: 'b1', name: 'Apple', logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200', discount: 'Up to 15% off' },
    { id: 'b2', name: 'Samsung', logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200', discount: 'Up to 20% off' },
    { id: 'b3', name: 'Sony', logo: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=200', discount: 'Up to 25% off' },
    { id: 'b4', name: 'Bose', logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200', discount: 'Up to 30% off' },
  ],
  '2': [
    { id: 'b5', name: 'Nike', logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200', discount: 'Up to 40% off' },
    { id: 'b6', name: 'Adidas', logo: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=200', discount: 'Up to 35% off' },
    { id: 'b7', name: 'Levi\'s', logo: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=200', discount: 'Up to 50% off' },
    { id: 'b8', name: 'Ray-Ban', logo: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200', discount: 'Up to 25% off' },
  ],
};

const SubCategoriesScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { categoryId, categoryName } = route.params as { categoryId: string; categoryName: string };

  const { products, isLoading } = useProductStore();
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  // Get sub-categories for this category
  const subCategories = subCategoriesData[categoryId] || [];
  const brands = brandsData[categoryId] || brandsData['1'];

  // Filter products by category
  const categoryProducts = useMemo(() => {
    let filtered = products.filter(p => p.categoryId === categoryId);
    
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      default:
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return filtered;
  }, [products, categoryId, searchQuery, sortBy]);

  // Top deals in this category
  const topDeals = categoryProducts.filter(p => (p.discount || 0) >= 10).slice(0, 4);

  // New arrivals in this category
  const newArrivals = [...categoryProducts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const handleProductPress = (productId: string) => {
    (navigation as any).navigate('ProductDetails', { productId });
  };

  const handleSubCategoryPress = (subCatId: string, subCatName: string) => {
    // Navigate to filtered products or another screen
    (navigation as any).navigate('CategoryProducts', { 
      categoryId: categoryId, 
      categoryName: `${categoryName} - ${subCatName}`,
      subCategoryId: subCatId 
    });
  };

  const handleToggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Category gradient colors
  const getCategoryColors = () => {
    const colorMap: Record<string, string[]> = {
      '1': ['#667eea', '#764ba2'],
      '2': ['#f093fb', '#f5576c'],
      '3': ['#4facfe', '#00f2fe'],
      '4': ['#fa709a', '#fee140'],
      '5': ['#a8edea', '#fed6e3'],
      '6': ['#d299c2', '#fef9d7'],
      '7': ['#667eea', '#764ba2'],
      '8': ['#11998e', '#38ef7d'],
    };
    return colorMap[categoryId] || ['#667eea', '#764ba2'];
  };

  // Header
  const Header = () => (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={getCategoryColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <StatusBar barStyle="light-content" backgroundColor={getCategoryColors()[0]} />
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleSection}>
            <Text style={styles.headerTitle}>{categoryName}</Text>
            <Text style={styles.headerSubtitle}>{categoryProducts.length} Products</Text>
          </View>
          <TouchableOpacity style={styles.searchBtn}>
            <Icon name="search" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  // Search Bar
  const SearchBar = () => (
    <View style={[styles.searchBarContainer, { backgroundColor: theme.colors.cardBackground }]}>
      <View style={[styles.searchInputWrapper, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
        <Icon name="search" size={18} color={theme.colors.textTertiary} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.textPrimary }]}
          placeholder={`Search in ${categoryName}...`}
          placeholderTextColor={theme.colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="x" size={18} color={theme.colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // Sub-Categories Grid
  const SubCategoriesSection = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Shop by Category</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subCategoriesScroll}>
        {subCategories.map((subCat, index) => (
          <TouchableOpacity
            key={subCat.id}
            style={[styles.subCategoryCard, { backgroundColor: theme.colors.cardBackground }]}
            onPress={() => handleSubCategoryPress(subCat.id, subCat.name)}
          >
            <View style={[styles.subCategoryImageWrapper, { borderColor: theme.colors.border }]}>
              <Image source={{ uri: subCat.image }} style={styles.subCategoryImage} />
            </View>
            <Text style={[styles.subCategoryName, { color: theme.colors.textPrimary }]} numberOfLines={1}>
              {subCat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );

  // Brands Section
  const BrandsSection = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Top Brands</Text>
        <TouchableOpacity>
          <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.brandsScroll}>
        {brands.map((brand) => (
          <TouchableOpacity
            key={brand.id}
            style={[styles.brandCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}
          >
            <Image source={{ uri: brand.logo }} style={styles.brandLogo} />
            <Text style={[styles.brandName, { color: theme.colors.textPrimary }]}>{brand.name}</Text>
            {brand.discount && (
              <Text style={styles.brandDiscount}>{brand.discount}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );

  // Banner/Promo Section
  const PromoBanner = () => (
    <Animated.View style={[styles.promoBannerContainer, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={getCategoryColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.promoBanner}
      >
        <View style={styles.promoBannerContent}>
          <Text style={styles.promoBannerTitle}>Special Offer!</Text>
          <Text style={styles.promoBannerSubtitle}>Up to 50% off on {categoryName}</Text>
          <TouchableOpacity style={styles.promoBannerBtn}>
            <Text style={styles.promoBannerBtnText}>Shop Now</Text>
            <Icon name="arrow-right" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.promoBannerIcon}>
          <Icon name="percent" size={60} color="rgba(255,255,255,0.2)" />
        </View>
      </LinearGradient>
    </Animated.View>
  );

  // Top Deals Section
  const TopDealsSection = () => {
    if (topDeals.length === 0) return null;
    
    return (
      <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Icon name="zap" size={20} color="#FF9800" />
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, marginLeft: 8 }]}>Top Deals</Text>
          </View>
          <TouchableOpacity>
            <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dealsScroll}>
          {topDeals.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={[styles.dealCard, { backgroundColor: theme.colors.cardBackground }]}
              onPress={() => handleProductPress(product.id)}
            >
              <View style={styles.dealImageWrapper}>
                <Image source={{ uri: product.thumbnail }} style={styles.dealImage} />
                {product.discount && (
                  <View style={styles.dealBadge}>
                    <Text style={styles.dealBadgeText}>{product.discount}% OFF</Text>
                  </View>
                )}
                <TouchableOpacity 
                  style={styles.dealWishlistBtn}
                  onPress={() => handleToggleWishlist(product)}
                >
                  <Icon 
                    name="heart" 
                    size={16} 
                    color={isInWishlist(product.id) ? '#E91E63' : theme.colors.textTertiary} 
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.dealInfo}>
                <Text style={[styles.dealName, { color: theme.colors.textPrimary }]} numberOfLines={2}>
                  {product.name}
                </Text>
                <View style={styles.dealPriceRow}>
                  <Text style={[styles.dealPrice, { color: theme.colors.textPrimary }]}>
                    ${product.price}
                  </Text>
                  {product.originalPrice && (
                    <Text style={[styles.dealOriginalPrice, { color: theme.colors.textTertiary }]}>
                      ${product.originalPrice}
                    </Text>
                  )}
                </View>
                <View style={styles.dealRating}>
                  <Icon name="star" size={12} color="#FFC107" />
                  <Text style={[styles.dealRatingText, { color: theme.colors.textSecondary }]}>
                    {product.rating} ({product.reviewCount})
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    );
  };

  // New Arrivals Section
  const NewArrivalsSection = () => {
    if (newArrivals.length === 0) return null;

    return (
      <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Icon name="package" size={20} color="#4CAF50" />
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, marginLeft: 8 }]}>New Arrivals</Text>
          </View>
          <TouchableOpacity>
            <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dealsScroll}>
          {newArrivals.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={[styles.dealCard, { backgroundColor: theme.colors.cardBackground }]}
              onPress={() => handleProductPress(product.id)}
            >
              <View style={styles.dealImageWrapper}>
                <Image source={{ uri: product.thumbnail }} style={styles.dealImage} />
                <View style={[styles.dealBadge, { backgroundColor: '#4CAF50' }]}>
                  <Text style={styles.dealBadgeText}>NEW</Text>
                </View>
              </View>
              <View style={styles.dealInfo}>
                <Text style={[styles.dealName, { color: theme.colors.textPrimary }]} numberOfLines={2}>
                  {product.name}
                </Text>
                <View style={styles.dealPriceRow}>
                  <Text style={[styles.dealPrice, { color: theme.colors.textPrimary }]}>
                    ${product.price}
                  </Text>
                </View>
                <View style={styles.dealRating}>
                  <Icon name="star" size={12} color="#FFC107" />
                  <Text style={[styles.dealRatingText, { color: theme.colors.textSecondary }]}>
                    {product.rating}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    );
  };

  // Filter & Sort Bar
  const FilterSortBar = () => (
    <View style={[styles.filterSortBar, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            sortBy === 'popular' && styles.filterChipActive,
            { borderColor: sortBy === 'popular' ? theme.colors.primary : theme.colors.border }
          ]}
          onPress={() => setSortBy('popular')}
        >
          <Text style={[
            styles.filterChipText,
            { color: sortBy === 'popular' ? theme.colors.primary : theme.colors.textSecondary }
          ]}>Popular</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterChip,
            sortBy === 'price-low' && styles.filterChipActive,
            { borderColor: sortBy === 'price-low' ? theme.colors.primary : theme.colors.border }
          ]}
          onPress={() => setSortBy('price-low')}
        >
          <Text style={[
            styles.filterChipText,
            { color: sortBy === 'price-low' ? theme.colors.primary : theme.colors.textSecondary }
          ]}>Price: Low to High</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterChip,
            sortBy === 'price-high' && styles.filterChipActive,
            { borderColor: sortBy === 'price-high' ? theme.colors.primary : theme.colors.border }
          ]}
          onPress={() => setSortBy('price-high')}
        >
          <Text style={[
            styles.filterChipText,
            { color: sortBy === 'price-high' ? theme.colors.primary : theme.colors.textSecondary }
          ]}>Price: High to Low</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterChip,
            sortBy === 'rating' && styles.filterChipActive,
            { borderColor: sortBy === 'rating' ? theme.colors.primary : theme.colors.border }
          ]}
          onPress={() => setSortBy('rating')}
        >
          <Text style={[
            styles.filterChipText,
            { color: sortBy === 'rating' ? theme.colors.primary : theme.colors.textSecondary }
          ]}>Top Rated</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterChip,
            sortBy === 'discount' && styles.filterChipActive,
            { borderColor: sortBy === 'discount' ? theme.colors.primary : theme.colors.border }
          ]}
          onPress={() => setSortBy('discount')}
        >
          <Text style={[
            styles.filterChipText,
            { color: sortBy === 'discount' ? theme.colors.primary : theme.colors.textSecondary }
          ]}>Best Discount</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  // All Products Grid
  const AllProductsSection = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          All Products ({categoryProducts.length})
        </Text>
      </View>
      <FilterSortBar />
      <View style={styles.productsGrid}>
        {categoryProducts.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={[styles.productCard, { backgroundColor: theme.colors.cardBackground }]}
            onPress={() => handleProductPress(product.id)}
          >
            <View style={styles.productImageWrapper}>
              <Image source={{ uri: product.thumbnail }} style={styles.productImage} />
              {product.discount && product.discount > 0 && (
                <View style={styles.productDiscountBadge}>
                  <Text style={styles.productDiscountText}>{product.discount}%</Text>
                </View>
              )}
              <TouchableOpacity 
                style={[styles.productWishlistBtn, { backgroundColor: theme.colors.cardBackground }]}
                onPress={() => handleToggleWishlist(product)}
              >
                <Icon 
                  name="heart" 
                  size={16} 
                  color={isInWishlist(product.id) ? '#E91E63' : theme.colors.textTertiary} 
                />
              </TouchableOpacity>
              {product.isAutoCartPlus && (
                <View style={styles.plusBadge}>
                  <Icon name="zap" size={10} color="#000" />
                </View>
              )}
            </View>
            <View style={styles.productInfo}>
              <Text style={[styles.productBrand, { color: theme.colors.textTertiary }]}>
                {product.vendor?.name || 'Brand'}
              </Text>
              <Text style={[styles.productName, { color: theme.colors.textPrimary }]} numberOfLines={2}>
                {product.name}
              </Text>
              <View style={styles.productRatingRow}>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>{product.rating}</Text>
                  <Icon name="star" size={10} color="#FFFFFF" />
                </View>
                <Text style={[styles.reviewCount, { color: theme.colors.textTertiary }]}>
                  ({product.reviewCount})
                </Text>
              </View>
              <View style={styles.productPriceRow}>
                <Text style={[styles.productPrice, { color: theme.colors.textPrimary }]}>
                  ${product.price}
                </Text>
                {product.originalPrice && (
                  <Text style={[styles.productOriginalPrice, { color: theme.colors.textTertiary }]}>
                    ${product.originalPrice}
                  </Text>
                )}
              </View>
              {product.isAutoCartPlus && (
                <Text style={styles.freeDeliveryText}>Free Delivery</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  if (isLoading) {
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
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SearchBar />
        <SubCategoriesSection />
        <PromoBanner />
        <BrandsSection />
        <TopDealsSection />
        <NewArrivalsSection />
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  searchBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Search Bar
  searchBarContainer: {
    padding: 12,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    height: 44,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },

  // Section
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
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
    fontWeight: '600',
  },

  // Sub-Categories
  subCategoriesScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  subCategoryCard: {
    alignItems: 'center',
    width: 80,
  },
  subCategoryImageWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  subCategoryImage: {
    width: '100%',
    height: '100%',
  },
  subCategoryName: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },

  // Brands
  brandsScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  brandCard: {
    width: 100,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  brandLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  brandName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  brandDiscount: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '600',
  },

  // Promo Banner
  promoBannerContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  promoBanner: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  promoBannerContent: {
    flex: 1,
  },
  promoBannerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  promoBannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
  },
  promoBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  promoBannerBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  promoBannerIcon: {
    marginLeft: 16,
  },

  // Deals
  dealsScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  dealCard: {
    width: 160,
    borderRadius: 12,
    overflow: 'hidden',
  },
  dealImageWrapper: {
    position: 'relative',
  },
  dealImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#F5F5F5',
  },
  dealBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#E91E63',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  dealBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  dealWishlistBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dealInfo: {
    padding: 10,
  },
  dealName: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
    height: 36,
  },
  dealPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  dealPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  dealOriginalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  dealRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dealRatingText: {
    fontSize: 11,
  },

  // Filter Sort Bar
  filterSortBar: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterScroll: {
    padding: 8,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipActive: {
    backgroundColor: 'rgba(103, 126, 234, 0.1)',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
  },

  // Products Grid
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
  },
  productCard: {
    width: (SCREEN_WIDTH - 40) / 2,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  productImageWrapper: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#F5F5F5',
  },
  productDiscountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#E91E63',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  productDiscountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  productWishlistBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  plusBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#FFD700',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    padding: 10,
  },
  productBrand: {
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 2,
  },
  productName: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
    height: 36,
  },
  productRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#388E3C',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  reviewCount: {
    fontSize: 10,
  },
  productPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '700',
  },
  productOriginalPrice: {
    fontSize: 11,
    textDecorationLine: 'line-through',
  },
  freeDeliveryText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '600',
    marginTop: 4,
  },
});

export default SubCategoriesScreen;
