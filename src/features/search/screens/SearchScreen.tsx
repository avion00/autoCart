// ============================================
// AutoCart - Premium Search Screen
// Modern, Premium, User-Friendly Design
// ============================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Animated,
  TextInput,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../../theme';
import { Icon, ProductCard, Loader, EmptyState } from '../../../components';
import { useProductStore } from '../../../store';
import { Product } from '../../../types';

// ============================================
// CONSTANTS
// ============================================
const RECENT_SEARCHES = ['iPhone 15', 'Nike Shoes', 'Samsung TV', 'Headphones'];

const TRENDING_SEARCHES = [
  { term: 'Smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200' },
  { term: 'Laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200' },
  { term: 'Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200' },
  { term: 'Watches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200' },
  { term: 'Cameras', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200' },
  { term: 'Sneakers', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200' },
];

const QUICK_CATEGORIES = [
  { id: '1', name: 'Electronics', icon: 'smartphone', color: '#2874F0' },
  { id: '2', name: 'Fashion', icon: 'shopping-bag', color: '#E91E63' },
  { id: '3', name: 'Home', icon: 'home', color: '#FF9800' },
  { id: '4', name: 'Beauty', icon: 'heart', color: '#9C27B0' },
  { id: '5', name: 'Sports', icon: 'activity', color: '#4CAF50' },
  { id: '6', name: 'Books', icon: 'book', color: '#795548' },
];

const SEARCH_TIPS = [
  'Try searching for specific brands',
  'Use filters to narrow results',
  'Check trending items for deals',
];

// ============================================
// SEARCH SCREEN COMPONENT
// ============================================
const SearchScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { products, isLoading, searchProducts, fetchProducts } = useProductStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
    
    // Auto focus search input
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      setHasSearched(true);
      searchProducts(searchQuery.trim());
      // Add to recent searches
      if (!recentSearches.includes(searchQuery.trim())) {
        setRecentSearches(prev => [searchQuery.trim(), ...prev.slice(0, 4)]);
      }
    }
  }, [searchQuery, searchProducts, recentSearches]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setHasSearched(false);
    fetchProducts();
  };

  const handleRecentSearchPress = (term: string) => {
    setSearchQuery(term);
    setHasSearched(true);
    searchProducts(term);
  };

  const handleTrendingPress = (term: string) => {
    setSearchQuery(term);
    setHasSearched(true);
    searchProducts(term);
  };

  const handleProductPress = (productId: string) => {
    (navigation as any).navigate('ProductDetails', { productId });
  };

  // ============================================
  // PREMIUM HEADER WITH SEARCH
  // ============================================
  const PremiumHeader = () => (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={['#2874F0', '#1565C0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <StatusBar barStyle="light-content" backgroundColor="#2874F0" />
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.headerBackBtn} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={[styles.searchBarWrapper, { backgroundColor: theme.colors.cardBackground }]}>
            <View style={styles.searchBarInner}>
              <Icon name="search" size={20} color={theme.colors.textTertiary} style={styles.searchIcon} />
              <TextInput
                ref={inputRef}
                style={[styles.searchInput, { color: theme.colors.textPrimary }]}
                placeholder="Search products, brands..."
                placeholderTextColor={theme.colors.textTertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity style={styles.clearBtn} onPress={handleClearSearch}>
                  <View style={[styles.clearBtnInner, { backgroundColor: theme.colors.border }]}>
                    <Icon name="x" size={14} color={theme.colors.textSecondary} />
                  </View>
                </TouchableOpacity>
              )}
              <View style={[styles.searchDivider, { backgroundColor: theme.colors.border }]} />
              <TouchableOpacity style={styles.micBtn} activeOpacity={0.7}>
                <Icon name="mic" size={20} color="#2874F0" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  // ============================================
  // RECENT SEARCHES SECTION
  // ============================================
  const RecentSearchesSection = () => (
    <Animated.View 
      style={[
        styles.section, 
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}
    >
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Recent Searches
        </Text>
        <TouchableOpacity onPress={() => setRecentSearches([])}>
          <Text style={styles.clearAllText}>Clear All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.recentSearches}>
        {recentSearches.map((term, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.recentChip, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}
            onPress={() => handleRecentSearchPress(term)}
            activeOpacity={0.7}
          >
            <Icon name="clock" size={14} color={theme.colors.textTertiary} />
            <Text style={[styles.recentChipText, { color: theme.colors.textSecondary }]}>{term}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  // ============================================
  // TRENDING SEARCHES SECTION
  // ============================================
  const TrendingSearchesSection = () => (
    <Animated.View 
      style={[
        styles.section, 
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Icon name="trending-up" size={20} color="#FF5722" />
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, marginLeft: 8 }]}>
            Trending Now
          </Text>
        </View>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.trendingScroll}
      >
        {TRENDING_SEARCHES.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.trendingCard}
            onPress={() => handleTrendingPress(item.term)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: item.image }} style={styles.trendingImage} />
            <View style={styles.trendingOverlay}>
              <View style={styles.trendingContent}>
                <Text style={styles.trendingText}>{item.term}</Text>
                <View style={styles.trendingArrowBox}>
                  <Icon name="arrow-right" size={14} color="#FFFFFF" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );

  // ============================================
  // QUICK CATEGORIES SECTION
  // ============================================
  const QuickCategoriesSection = () => (
    <Animated.View 
      style={[
        styles.section, 
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}
    >
      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
        Browse Categories
      </Text>
      <View style={styles.categoriesGrid}>
        {QUICK_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}
            onPress={() => handleTrendingPress(category.name)}
            activeOpacity={0.7}
          >
            <View style={[styles.categoryIconBox, { backgroundColor: category.color + '15' }]}>
              <Icon name={category.icon as any} size={22} color={category.color} />
            </View>
            <Text style={[styles.categoryName, { color: theme.colors.textPrimary }]}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  // ============================================
  // SEARCH TIPS SECTION
  // ============================================
  const SearchTipsSection = () => (
    <Animated.View 
      style={[
        styles.section, 
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}
    >
      <View style={[styles.tipsCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}>
        <View style={styles.tipsHeader}>
          <Icon name="zap" size={18} color="#FF9800" />
          <Text style={[styles.tipsTitle, { color: theme.colors.textPrimary }]}>Search Tips</Text>
        </View>
        {SEARCH_TIPS.map((tip, index) => (
          <View key={index} style={styles.tipItem}>
            <View style={[styles.tipBullet, { backgroundColor: '#2874F0' }]} />
            <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>{tip}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );

  // ============================================
  // SEARCH RESULTS HEADER
  // ============================================
  const ResultsHeader = () => (
    <View style={[styles.resultsHeader, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.resultsCount, { color: theme.colors.textSecondary }]}>
        {products.length} results for "{searchQuery}"
      </Text>
      <View style={styles.resultsActions}>
        <TouchableOpacity style={[styles.filterBtn, { borderColor: theme.colors.border }]}>
          <Icon name="sliders" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.filterBtnText, { color: theme.colors.textSecondary }]}>Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterBtn, { borderColor: theme.colors.border }]}>
          <Icon name="arrow-up-down" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.filterBtnText, { color: theme.colors.textSecondary }]}>Sort</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // ============================================
  // NO RESULTS WITH AI SUGGESTIONS
  // ============================================
  const NoResultsWithAI = () => (
    <View style={styles.noResultsContainer}>
      <View style={[styles.noResultsCard, { backgroundColor: theme.colors.cardBackground }]}>
        <View style={styles.noResultsIconBox}>
          <Icon name="search" size={40} color={theme.colors.textTertiary} />
        </View>
        <Text style={[styles.noResultsTitle, { color: theme.colors.textPrimary }]}>
          No results found
        </Text>
        <Text style={[styles.noResultsSubtitle, { color: theme.colors.textSecondary }]}>
          We couldn't find anything for "{searchQuery}"
        </Text>
        
        <View style={styles.aiSuggestionBox}>
          <View style={styles.aiHeader}>
            <Icon name="zap" size={16} color="#FF9800" />
            <Text style={[styles.aiTitle, { color: theme.colors.textPrimary }]}>Try these instead</Text>
          </View>
          <View style={styles.popularItems}>
            {TRENDING_SEARCHES.slice(0, 4).map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.popularCard}
                onPress={() => handleTrendingPress(item.term)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: item.image }} style={styles.popularImage} />
                <Text style={[styles.popularText, { color: theme.colors.textPrimary }]}>{item.term}</Text>
                <View style={[styles.popularBadge, { backgroundColor: '#2874F0' }]}>
                  <Icon name="arrow-right" size={12} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  // ============================================
  // RENDER PRODUCT ITEM
  // ============================================
  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productItem}>
      <ProductCard
        product={item}
        variant="grid"
        onPress={() => handleProductPress(item.id)}
      />
    </View>
  );

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <PremiumHeader />
      
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <Loader />
        </View>
      ) : hasSearched ? (
        products.length > 0 ? (
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.productRow}
            contentContainerStyle={styles.productList}
            ListHeaderComponent={<ResultsHeader />}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <NoResultsWithAI />
          </ScrollView>
        )
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {recentSearches.length > 0 && <RecentSearchesSection />}
          <TrendingSearchesSection />
          <QuickCategoriesSection />
          <SearchTipsSection />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

// ============================================
// STYLES
// ============================================
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
  
  // Header Styles
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
    gap: 12,
  },
  headerBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarWrapper: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    overflow: 'hidden',
  },
  searchBarInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  clearBtnInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchDivider: {
    width: 1,
    height: 24,
    marginHorizontal: 10,
  },
  micBtn: {
    padding: 4,
  },

  // Section Styles
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
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
    fontSize: 17,
    fontWeight: '700',
  },
  clearAllText: {
    fontSize: 13,
    color: '#2874F0',
    fontWeight: '600',
  },

  // Recent Searches
  recentSearches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  recentChipText: {
    fontSize: 13,
  },

  // Trending Searches
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5722',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  trendingScroll: {
    paddingRight: 16,
    gap: 12,
  },
  trendingCard: {
    width: 140,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
  },
  trendingImage: {
    width: '100%',
    height: '100%',
  },
  trendingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    padding: 10,
  },
  trendingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trendingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  trendingArrowBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Categories
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  categoryCard: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
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
  },

  // Tips
  tipsCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  tipText: {
    fontSize: 13,
  },

  // Results
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsCount: {
    fontSize: 13,
  },
  resultsActions: {
    flexDirection: 'row',
    gap: 8,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
  },
  filterBtnText: {
    fontSize: 12,
    fontWeight: '500',
  },

  // Product List
  productList: {
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productItem: {
    width: '48%',
    marginBottom: 12,
  },

  // No Results
  noResultsContainer: {
    padding: 16,
  },
  noResultsCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  noResultsIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  noResultsSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  aiSuggestionBox: {
    width: '100%',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  aiTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  popularItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  popularCard: {
    width: '47%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  popularImage: {
    width: '100%',
    height: 80,
  },
  popularText: {
    fontSize: 13,
    fontWeight: '600',
    padding: 10,
  },
  popularBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchScreen;
