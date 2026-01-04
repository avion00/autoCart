// ============================================
// AutoCart - Categories Screen (Clean & Modern)
// ============================================

import React, { useEffect, useRef } from 'react';
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
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import { Icon, Loader } from '../../../components';
import { useProductStore } from '../../../store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Category images mapping
const categoryImages: Record<string, string> = {
  '1': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600', // Electronics
  '2': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600', // Fashion
  '3': 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600', // Home & Living
  '4': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600', // Beauty
  '5': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600', // Sports
  '6': 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600', // Books & More
  '7': 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600', // Gaming
  '8': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600', // Grocery
};

const CategoriesScreen: React.FC = () => {
  // All hooks must be called first, before any conditional returns
  const theme = useTheme();
  const navigation = useNavigation();
  const { categories, isLoading, fetchCategories } = useProductStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchCategories();
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const handleCategoryPress = (categoryId: string, categoryName: string) => {
    (navigation as any).navigate('SubCategories', { categoryId, categoryName });
  };

  // Split categories for layout
  const featuredCategories = categories.slice(0, 2);
  const regularCategories = categories.slice(2);

  // Loading state
  if (isLoading && categories.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
        <View style={[styles.header, { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.border }]}>
          <StatusBar barStyle={theme.colors.background === '#FFFFFF' ? 'dark-content' : 'light-content'} backgroundColor={theme.colors.background} />
          <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>Categories</Text>
          <TouchableOpacity style={[styles.headerBtn, { backgroundColor: theme.colors.cardBackground }]}>
            <Icon name="search" size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <View style={styles.loaderContainer}>
          <Loader />
        </View>
      </SafeAreaView>
    );
  }

  // Main render
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.border }]}>
        <StatusBar barStyle={theme.colors.background === '#FFFFFF' ? 'dark-content' : 'light-content'} backgroundColor={theme.colors.background} />
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>Categories</Text>
        <TouchableOpacity style={[styles.headerBtn, { backgroundColor: theme.colors.cardBackground }]}>
          <Icon name="search" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}>
            <Icon name="search" size={18} color={theme.colors.textTertiary} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.textPrimary }]}
              placeholder="Search categories..."
              placeholderTextColor={theme.colors.textTertiary}
            />
          </View>
        </View>
        
        {/* Quick Access Circles */}
        <View style={styles.quickAccessSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Quick Access</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickAccessScroll}>
            {categories.slice(0, 6).map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.quickAccessItem}
                onPress={() => handleCategoryPress(category.id, category.name)}
              >
                <View style={[styles.quickAccessImageWrapper, { borderColor: theme.colors.border }]}>
                  <Image
                    source={{ uri: categoryImages[category.id] || category.image }}
                    style={styles.quickAccessImage}
                  />
                </View>
                <Text style={[styles.quickAccessName, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Categories - Large Cards */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Featured</Text>
          <View style={styles.featuredGrid}>
            {featuredCategories.map((category, index) => (
              <Animated.View key={category.id} style={[styles.featuredCard, { opacity: fadeAnim }]}>
                <TouchableOpacity
                  style={styles.featuredTouchable}
                  onPress={() => handleCategoryPress(category.id, category.name)}
                  activeOpacity={0.9}
                >
                  <Image
                    source={{ uri: categoryImages[category.id] || category.image }}
                    style={styles.featuredImage}
                  />
                  <View style={styles.featuredOverlay} />
                  <View style={styles.featuredContent}>
                    <Text style={styles.featuredName}>{category.name}</Text>
                    <Text style={styles.featuredCount}>{category.productCount.toLocaleString()} Products</Text>
                    <View style={styles.featuredArrow}>
                      <Icon name="arrow-right" size={18} color="#FFFFFF" />
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* All Categories - List Style */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>All Categories</Text>
          <View style={[styles.categoriesList, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}>
            {regularCategories.map((category, index) => (
              <View key={category.id}>
                <Animated.View style={[styles.categoryCard, { opacity: fadeAnim }]}>
                  <TouchableOpacity
                    style={[styles.categoryTouchable, { backgroundColor: theme.colors.cardBackground }]}
                    onPress={() => handleCategoryPress(category.id, category.name)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.categoryImageWrapper}>
                      <Image
                        source={{ uri: categoryImages[category.id] || category.image }}
                        style={styles.categoryImage}
                      />
                    </View>
                    <View style={styles.categoryInfo}>
                      <Text style={[styles.categoryName, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                        {category.name}
                      </Text>
                      <Text style={[styles.categoryCount, { color: theme.colors.textTertiary }]}>
                        {category.productCount.toLocaleString()} items
                      </Text>
                    </View>
                    <Icon name="chevron-right" size={18} color={theme.colors.textTertiary} />
                  </TouchableOpacity>
                </Animated.View>
                {index < regularCategories.length - 1 && (
                  <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Browse All Banner */}
        <TouchableOpacity style={[styles.browseAllBanner, { backgroundColor: theme.colors.primary }]}>
          <View style={styles.browseAllContent}>
            <Icon name="grid" size={24} color="#FFFFFF" />
            <View style={styles.browseAllText}>
              <Text style={styles.browseAllTitle}>Browse All Products</Text>
              <Text style={styles.browseAllSubtitle}>Explore our entire collection</Text>
            </View>
          </View>
          <Icon name="arrow-right" size={20} color="#FFFFFF" />
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Search
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    paddingHorizontal: 20,
  },

  // Quick Access
  quickAccessSection: {
    marginBottom: 24,
  },
  quickAccessScroll: {
    paddingHorizontal: 20,
    gap: 16,
  },
  quickAccessItem: {
    alignItems: 'center',
    width: 72,
  },
  quickAccessImageWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  quickAccessImage: {
    width: '100%',
    height: '100%',
  },
  quickAccessName: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },

  // Featured Cards
  featuredGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  featuredCard: {
    flex: 1,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
  },
  featuredTouchable: {
    flex: 1,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  featuredContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  featuredName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featuredCount: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
  },
  featuredArrow: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Categories List
  categoriesList: {
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  categoryCard: {
    // No extra styling needed
  },
  categoryTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 14,
  },
  categoryImageWrapper: {
    width: 56,
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 13,
  },
  divider: {
    height: 1,
    marginLeft: 84,
  },

  // Browse All Banner
  browseAllBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  browseAllContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  browseAllText: {
    // Container for text
  },
  browseAllTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  browseAllSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
  },
});

export default CategoriesScreen;
