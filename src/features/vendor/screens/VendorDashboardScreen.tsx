// ============================================
// AutoCart - Vendor Dashboard Screen
// ============================================

import React, { useRef, useEffect, useState } from 'react';
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
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../../theme';
import { Icon } from '../../../components';
import { useAuthStore } from '../../../store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock vendor data
const mockVendorStats = {
  totalSales: 125430,
  totalOrders: 342,
  totalProducts: 56,
  pendingOrders: 12,
  rating: 4.8,
  reviewCount: 1250,
};

const mockRecentOrders = [
  { id: '1', orderNumber: 'ORD-001', customer: 'John Doe', amount: 299.99, status: 'pending', date: '2024-01-15' },
  { id: '2', orderNumber: 'ORD-002', customer: 'Jane Smith', amount: 149.50, status: 'shipped', date: '2024-01-14' },
  { id: '3', orderNumber: 'ORD-003', customer: 'Mike Johnson', amount: 599.00, status: 'delivered', date: '2024-01-13' },
];

const mockTopProducts = [
  { id: '1', name: 'iPhone 15 Pro', sales: 45, revenue: 53955, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200' },
  { id: '2', name: 'MacBook Pro', sales: 23, revenue: 57477, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200' },
  { id: '3', name: 'AirPods Pro', sales: 89, revenue: 22311, image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=200' },
];

const VendorDashboardScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return '#4CAF50';
      case 'shipped': return '#2196F3';
      case 'pending': return '#FF9800';
      case 'cancelled': return '#F44336';
      default: return theme.colors.textSecondary;
    }
  };

  // Header
  const Header = () => (
    <LinearGradient
      colors={['#6366F1', '#4F46E5']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.header}
    >
      <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="arrow-left" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Vendor Dashboard</Text>
            <Text style={styles.headerSubtitle}>{user?.name || 'Vendor Store'}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn}>
            <Icon name="bell" size={20} color="#FFFFFF" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Icon name="settings" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );

  // Stats Cards
  const StatsSection = () => (
    <Animated.View style={[styles.statsSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsScroll}>
        <View style={[styles.statCard, { backgroundColor: '#4CAF50' }]}>
          <View style={styles.statIconBox}>
            <Icon name="dollar-sign" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.statValue}>${(mockVendorStats.totalSales / 1000).toFixed(1)}K</Text>
          <Text style={styles.statLabel}>Total Sales</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#2196F3' }]}>
          <View style={styles.statIconBox}>
            <Icon name="shopping-bag" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.statValue}>{mockVendorStats.totalOrders}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#FF9800' }]}>
          <View style={styles.statIconBox}>
            <Icon name="clock" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.statValue}>{mockVendorStats.pendingOrders}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#9C27B0' }]}>
          <View style={styles.statIconBox}>
            <Icon name="package" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.statValue}>{mockVendorStats.totalProducts}</Text>
          <Text style={styles.statLabel}>Products</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#E91E63' }]}>
          <View style={styles.statIconBox}>
            <Icon name="star" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.statValue}>{mockVendorStats.rating}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </ScrollView>
    </Animated.View>
  );

  // Quick Actions
  const QuickActions = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.colors.cardBackground }]}>
          <View style={[styles.actionIcon, { backgroundColor: '#2196F3' + '20' }]}>
            <Icon name="plus-circle" size={24} color="#2196F3" />
          </View>
          <Text style={[styles.actionLabel, { color: theme.colors.textPrimary }]}>Add Product</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.colors.cardBackground }]}>
          <View style={[styles.actionIcon, { backgroundColor: '#4CAF50' + '20' }]}>
            <Icon name="list" size={24} color="#4CAF50" />
          </View>
          <Text style={[styles.actionLabel, { color: theme.colors.textPrimary }]}>Manage Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.colors.cardBackground }]}>
          <View style={[styles.actionIcon, { backgroundColor: '#FF9800' + '20' }]}>
            <Icon name="bar-chart-2" size={24} color="#FF9800" />
          </View>
          <Text style={[styles.actionLabel, { color: theme.colors.textPrimary }]}>Analytics</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.colors.cardBackground }]}>
          <View style={[styles.actionIcon, { backgroundColor: '#9C27B0' + '20' }]}>
            <Icon name="percent" size={24} color="#9C27B0" />
          </View>
          <Text style={[styles.actionLabel, { color: theme.colors.textPrimary }]}>Promotions</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  // Recent Orders
  const RecentOrders = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Recent Orders</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      {mockRecentOrders.map((order) => (
        <TouchableOpacity
          key={order.id}
          style={[styles.orderCard, { backgroundColor: theme.colors.cardBackground }]}
        >
          <View style={styles.orderInfo}>
            <Text style={[styles.orderNumber, { color: theme.colors.textPrimary }]}>{order.orderNumber}</Text>
            <Text style={[styles.orderCustomer, { color: theme.colors.textSecondary }]}>{order.customer}</Text>
            <Text style={[styles.orderDate, { color: theme.colors.textTertiary }]}>{order.date}</Text>
          </View>
          <View style={styles.orderRight}>
            <Text style={[styles.orderAmount, { color: theme.colors.textPrimary }]}>${order.amount.toFixed(2)}</Text>
            <View style={[styles.orderStatus, { backgroundColor: getStatusColor(order.status) + '20' }]}>
              <Text style={[styles.orderStatusText, { color: getStatusColor(order.status) }]}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );

  // Top Products
  const TopProducts = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Top Products</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      {mockTopProducts.map((product, index) => (
        <View
          key={product.id}
          style={[styles.productCard, { backgroundColor: theme.colors.cardBackground }]}
        >
          <Text style={[styles.productRank, { color: theme.colors.primary }]}>#{index + 1}</Text>
          <Image source={{ uri: product.image }} style={styles.productImage} />
          <View style={styles.productInfo}>
            <Text style={[styles.productName, { color: theme.colors.textPrimary }]} numberOfLines={1}>
              {product.name}
            </Text>
            <Text style={[styles.productSales, { color: theme.colors.textSecondary }]}>
              {product.sales} sold
            </Text>
          </View>
          <Text style={[styles.productRevenue, { color: theme.colors.success }]}>
            ${(product.revenue / 1000).toFixed(1)}K
          </Text>
        </View>
      ))}
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <StatsSection />
        <QuickActions />
        <RecentOrders />
        <TopProducts />
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

  // Header
  header: {
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5722',
  },

  // Stats
  statsSection: {
    marginTop: -10,
  },
  statsScroll: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    width: 130,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },

  // Section
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2874F0',
  },

  // Quick Actions
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (SCREEN_WIDTH - 44) / 2,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Orders
  orderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  orderCustomer: {
    fontSize: 13,
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
  },
  orderRight: {
    alignItems: 'flex-end',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  orderStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Products
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  productRank: {
    fontSize: 16,
    fontWeight: '700',
    width: 30,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  productSales: {
    fontSize: 12,
  },
  productRevenue: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default VendorDashboardScreen;
