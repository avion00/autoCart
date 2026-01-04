// ============================================
// AutoCart - Product List Screen
// ============================================

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../../theme';
import { Icon, ProductCard, Loader, EmptyState } from '../../../components';
import { useProductStore } from '../../../store';
import { Product } from '../../../types';

const ProductListScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { categoryId, categoryName } = route.params as { categoryId: string; categoryName: string };

  const { products, isLoading, fetchProducts } = useProductStore();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState('relevance');

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchProducts();
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    const filtered = products.filter(p => p.categoryId === categoryId);
    setFilteredProducts(filtered);
  }, [products, categoryId]);

  const handleProductPress = (productId: string) => {
    (navigation as any).navigate('ProductDetails', { productId });
  };

  // Header
  const Header = () => (
    <LinearGradient colors={['#2874F0', '#1565C0']} style={styles.header}>
      <StatusBar barStyle="light-content" backgroundColor="#2874F0" />
      <View style={styles.headerContent}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.headerText} numberOfLines={1}>{categoryName}</Text>
          <Text style={styles.headerSubtext}>{filteredProducts.length} products</Text>
        </View>
        <TouchableOpacity style={styles.searchBtn}>
          <Icon name="search" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  // Sort Bar
  const SortBar = () => (
    <View style={[styles.sortBar, { backgroundColor: theme.colors.cardBackground }]}>
      <TouchableOpacity style={styles.sortOption}>
        <Icon name="sliders" size={16} color={theme.colors.textSecondary} />
        <Text style={[styles.sortText, { color: theme.colors.textSecondary }]}>Filter</Text>
      </TouchableOpacity>
      <View style={[styles.sortDivider, { backgroundColor: theme.colors.border }]} />
      <TouchableOpacity style={styles.sortOption}>
        <Icon name="arrow-up-down" size={16} color={theme.colors.textSecondary} />
        <Text style={[styles.sortText, { color: theme.colors.textSecondary }]}>Sort</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProduct = ({ item, index }: { item: Product; index: number }) => (
    <Animated.View style={[styles.productItem, { opacity: fadeAnim }]}>
      <ProductCard
        product={item}
        onPress={() => handleProductPress(item.id)}
        variant="grid"
      />
    </Animated.View>
  );

  if (isLoading && filteredProducts.length === 0) {
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
      <SortBar />
      {filteredProducts.length === 0 ? (
        <EmptyState
          icon="package"
          title="No Products Found"
          description="There are no products in this category yet."
          actionLabel="Go Back"
          onAction={() => navigation.goBack()}
        />
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Header
  header: {
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
  },
  headerTitle: {
    flex: 1,
    marginLeft: 12,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtext: {
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

  // Sort Bar
  sortBar: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  sortOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  sortDivider: {
    width: 1,
    height: 20,
  },
  sortText: {
    fontSize: 13,
    fontWeight: '500',
  },

  // List
  list: {
    padding: 8,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  productItem: {
    width: '48%',
    marginBottom: 12,
  },
});

export default ProductListScreen;
