// ============================================
// AutoCart - Orders Screen (Premium Flipkart Style)
// ============================================

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  StatusBar,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../../theme';
import { Icon } from '../../../components';

// Enhanced mock orders data with images
const mockOrders = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    date: '2024-01-15',
    status: 'delivered',
    deliveredDate: '2024-01-18',
    total: 1299.99,
    itemCount: 2,
    items: [
      { name: 'iPhone 15 Pro Max', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200', price: 999.99 },
      { name: 'AirPods Pro', image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=200', price: 299.99 },
    ],
    paymentMethod: 'Credit Card',
    address: 'John Doe, 123 Main St, New York',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    date: '2024-01-12',
    status: 'shipped',
    expectedDelivery: '2024-01-20',
    total: 349.99,
    itemCount: 1,
    items: [
      { name: 'Sony WH-1000XM5', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=200', price: 349.99 },
    ],
    paymentMethod: 'UPI',
    address: 'John Doe, 123 Main St, New York',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    date: '2024-01-10',
    status: 'processing',
    expectedDelivery: '2024-01-22',
    total: 799.99,
    itemCount: 1,
    items: [
      { name: 'Apple Watch Ultra 2', image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=200', price: 799.99 },
    ],
    paymentMethod: 'Cash on Delivery',
    address: 'John Doe, 123 Main St, New York',
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    date: '2024-01-05',
    status: 'cancelled',
    total: 199.99,
    itemCount: 1,
    items: [
      { name: 'Wireless Charger', image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?w=200', price: 199.99 },
    ],
    paymentMethod: 'Wallet',
    cancelReason: 'Customer requested cancellation',
  },
];

type OrderItem = {
  name: string;
  image: string;
  price: number;
};

type Order = {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  deliveredDate?: string;
  expectedDelivery?: string;
  total: number;
  itemCount: number;
  items: OrderItem[];
  paymentMethod: string;
  address?: string;
  cancelReason?: string;
};

const OrdersScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return '#388E3C';
      case 'shipped': return '#1976D2';
      case 'processing': return '#F57C00';
      case 'cancelled': return '#D32F2F';
      default: return theme.colors.textSecondary;
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'delivered': return '#E8F5E9';
      case 'shipped': return '#E3F2FD';
      case 'processing': return '#FFF3E0';
      case 'cancelled': return '#FFEBEE';
      default: return '#F5F5F5';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return 'check-circle';
      case 'shipped': return 'truck';
      case 'processing': return 'clock';
      case 'cancelled': return 'x-circle';
      default: return 'package';
    }
  };

  const getStatusMessage = (order: Order) => {
    switch (order.status) {
      case 'delivered': 
        return `Delivered on ${new Date(order.deliveredDate || order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      case 'shipped': 
        return `Expected by ${new Date(order.expectedDelivery || order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      case 'processing': 
        return 'Order is being prepared';
      case 'cancelled': 
        return order.cancelReason || 'Order was cancelled';
      default: 
        return '';
    }
  };

  // Premium Header
  const Header = () => (
    <View style={[styles.header, { backgroundColor: theme.colors.cardBackground, borderBottomColor: theme.colors.border }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.cardBackground} />
      <View style={styles.headerTop}>
        <View style={styles.headerLeft}>
          <View style={[styles.headerIconBox, { backgroundColor: '#E3F2FD' }]}>
            <Icon name="package" size={20} color="#2874F0" />
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>My Orders</Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.textTertiary }]}>
              {mockOrders.length} orders placed
            </Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.headerBtn, { backgroundColor: theme.colors.background }]}
            onPress={() => setShowSearch(!showSearch)}
          >
            <Icon name="search" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerBtn, { backgroundColor: theme.colors.background }]}>
            <Icon name="filter" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      {showSearch && (
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.background }]}>
          <Icon name="search" size={18} color={theme.colors.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.textPrimary }]}
            placeholder="Search orders by ID or product..."
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
      )}
    </View>
  );

  // Enhanced Tabs
  const Tabs = () => (
    <View style={[styles.tabsWrapper, { backgroundColor: theme.colors.cardBackground }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
        {[
          { key: 'all', label: 'All Orders', count: mockOrders.length },
          { key: 'processing', label: 'Processing', count: mockOrders.filter(o => o.status === 'processing').length },
          { key: 'shipped', label: 'Shipped', count: mockOrders.filter(o => o.status === 'shipped').length },
          { key: 'delivered', label: 'Delivered', count: mockOrders.filter(o => o.status === 'delivered').length },
          { key: 'cancelled', label: 'Cancelled', count: mockOrders.filter(o => o.status === 'cancelled').length },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.activeTab,
              activeTab === tab.key && { borderBottomColor: '#2874F0' }
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab.key ? '#2874F0' : theme.colors.textSecondary }
              ]}
            >
              {tab.label}
            </Text>
            {tab.count > 0 && (
              <View style={[
                styles.tabBadge,
                { backgroundColor: activeTab === tab.key ? '#2874F0' : theme.colors.border }
              ]}>
                <Text style={[
                  styles.tabBadgeText,
                  { color: activeTab === tab.key ? '#FFFFFF' : theme.colors.textTertiary }
                ]}>
                  {tab.count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // Enhanced Order Card
  const renderOrder = ({ item, index }: { item: Order; index: number }) => (
    <Animated.View 
      style={[
        styles.orderCard, 
        { backgroundColor: theme.colors.cardBackground, opacity: fadeAnim }
      ]}
    >
      {/* Order Header */}
      <View style={styles.orderHeader}>
        <View style={styles.orderHeaderLeft}>
          <Text style={[styles.orderNumber, { color: theme.colors.textPrimary }]}>
            {item.orderNumber}
          </Text>
          <Text style={[styles.orderDate, { color: theme.colors.textTertiary }]}>
            Placed on {new Date(item.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(item.status) }]}>
          <Icon name={getStatusIcon(item.status)} size={12} color={getStatusColor(item.status)} />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      {/* Status Message */}
      <View style={[styles.statusMessage, { backgroundColor: getStatusBgColor(item.status) }]}>
        <Icon name={getStatusIcon(item.status)} size={14} color={getStatusColor(item.status)} />
        <Text style={[styles.statusMessageText, { color: getStatusColor(item.status) }]}>
          {getStatusMessage(item)}
        </Text>
      </View>

      {/* Order Items */}
      <View style={styles.orderItems}>
        {item.items.slice(0, 2).map((orderItem, idx) => (
          <View key={idx} style={styles.orderItemRow}>
            <Image source={{ uri: orderItem.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={[styles.itemName, { color: theme.colors.textPrimary }]} numberOfLines={2}>
                {orderItem.name}
              </Text>
              <Text style={[styles.itemPrice, { color: theme.colors.textSecondary }]}>
                ${orderItem.price.toFixed(2)}
              </Text>
            </View>
            {item.status === 'delivered' && (
              <TouchableOpacity style={styles.rateBtn}>
                <Icon name="star" size={14} color="#FF9800" />
                <Text style={styles.rateBtnText}>Rate</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        {item.items.length > 2 && (
          <TouchableOpacity style={styles.moreItemsBtn}>
            <Text style={[styles.moreItemsText, { color: '#2874F0' }]}>
              +{item.items.length - 2} more items
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Order Footer */}
      <View style={[styles.orderFooter, { borderTopColor: theme.colors.border }]}>
        <View style={styles.orderTotal}>
          <Text style={[styles.totalLabel, { color: theme.colors.textTertiary }]}>Order Total</Text>
          <Text style={[styles.totalValue, { color: theme.colors.textPrimary }]}>
            ${item.total.toFixed(2)}
          </Text>
        </View>
        <View style={styles.paymentInfo}>
          <Icon name="credit-card" size={12} color={theme.colors.textTertiary} />
          <Text style={[styles.paymentText, { color: theme.colors.textTertiary }]}>
            {item.paymentMethod}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.orderActions}>
        {item.status !== 'cancelled' && item.status !== 'delivered' && (
          <TouchableOpacity 
            style={[styles.primaryBtn, { backgroundColor: '#2874F0' }]}
            activeOpacity={0.8}
          >
            <Icon name="map-pin" size={16} color="#FFFFFF" />
            <Text style={styles.primaryBtnText}>Track Order</Text>
          </TouchableOpacity>
        )}
        {item.status === 'delivered' && (
          <TouchableOpacity 
            style={[styles.primaryBtn, { backgroundColor: '#2874F0' }]}
            activeOpacity={0.8}
          >
            <Icon name="refresh-cw" size={16} color="#FFFFFF" />
            <Text style={styles.primaryBtnText}>Buy Again</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={[styles.secondaryBtn, { borderColor: theme.colors.border }]}
          activeOpacity={0.8}
        >
          <Icon name="file-text" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.secondaryBtnText, { color: theme.colors.textSecondary }]}>Details</Text>
        </TouchableOpacity>
        {item.status === 'delivered' && (
          <TouchableOpacity 
            style={[styles.secondaryBtn, { borderColor: theme.colors.border }]}
            activeOpacity={0.8}
          >
            <Icon name="help-circle" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.secondaryBtnText, { color: theme.colors.textSecondary }]}>Help</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );

  // Empty State
  const EmptyOrders = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconCircle, { backgroundColor: '#E3F2FD' }]}>
        <Icon name="package" size={50} color="#2874F0" />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>No Orders Yet</Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
        Looks like you haven't placed any orders yet.{'\n'}Start shopping to see your orders here!
      </Text>
      <TouchableOpacity
        style={styles.shopNowBtn}
        onPress={() => (navigation as any).navigate('Home')}
        activeOpacity={0.8}
      >
        <LinearGradient 
          colors={['#2874F0', '#1565C0']} 
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.shopNowGradient}
        >
          <Icon name="shopping-bag" size={18} color="#FFFFFF" />
          <Text style={styles.shopNowText}>Start Shopping</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const filteredOrders = (activeTab === 'all' 
    ? mockOrders 
    : mockOrders.filter(order => order.status === activeTab)
  ).filter(order => 
    searchQuery === '' || 
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <Header />
      <Tabs />
      {filteredOrders.length === 0 ? (
        <EmptyOrders />
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrder}
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
    padding: 12,
    paddingBottom: 100,
  },

  // Header
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },

  // Tabs
  tabsWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tabBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },

  // Order Card
  orderCard: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 14,
  },
  orderHeaderLeft: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '700',
  },
  orderDate: {
    fontSize: 12,
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    gap: 5,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  statusMessageText: {
    fontSize: 12,
    fontWeight: '500',
  },

  // Order Items
  orderItems: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  rateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#FFF3E0',
    gap: 4,
  },
  rateBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF9800',
  },
  moreItemsBtn: {
    paddingVertical: 8,
  },
  moreItemsText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Order Footer
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  orderTotal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  totalLabel: {
    fontSize: 13,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  paymentText: {
    fontSize: 12,
  },

  // Action Buttons
  orderActions: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 10,
  },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 4,
    gap: 6,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    gap: 6,
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  shopNowBtn: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  shopNowGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 14,
    gap: 8,
  },
  shopNowText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default OrdersScreen;
