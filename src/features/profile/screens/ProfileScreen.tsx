// ============================================
// AutoCart - Profile Screen (Premium Flipkart Style)
// ============================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../../theme';
import { Icon } from '../../../components';
import { useAuthStore, useCartStore, useWishlistStore } from '../../../store';

const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items: cartItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  // Quick Actions
  const quickActions = [
    { id: '1', icon: 'package', label: 'Orders', screen: 'Orders', count: 12 },
    { id: '2', icon: 'heart', label: 'Wishlist', screen: 'Wishlist', count: wishlistItems.length },
    { id: '3', icon: 'gift', label: 'Coupons', screen: 'Coupons', count: 3 },
    { id: '4', icon: 'headphones', label: 'Help', screen: 'HelpCenter', count: null },
  ];

  // Account Settings Menu
  const accountMenu = [
    { id: '1', icon: 'user', label: 'Edit Profile', subtitle: 'Name, Phone, Email', screen: 'EditProfile', color: '#2874F0' },
    { id: '2', icon: 'map-pin', label: 'Saved Addresses', subtitle: 'Home, Work, Other', screen: 'Addresses', color: '#4CAF50' },
    { id: '3', icon: 'credit-card', label: 'Payment Methods', subtitle: 'Cards, UPI, Wallets', screen: 'PaymentMethods', color: '#FF9800' },
    { id: '4', icon: 'shield', label: 'Account Security', subtitle: 'Password, 2FA', screen: 'Security', color: '#9C27B0' },
  ];

  // More Options Menu
  const moreMenu = [
    { id: '1', icon: 'bell', label: 'Notifications', subtitle: 'Order updates, Offers', screen: 'Notifications', color: '#E91E63' },
    { id: '2', icon: 'globe', label: 'Language', subtitle: 'English', screen: 'Language', color: '#00BCD4' },
    { id: '3', icon: 'moon', label: 'Dark Mode', subtitle: 'System default', screen: 'Theme', color: '#607D8B' },
    { id: '4', icon: 'store', label: 'Become a Seller', subtitle: 'Start your business', screen: 'VendorDashboard', color: '#6366F1' },
  ];

  // Support Menu
  const supportMenu = [
    { id: '1', icon: 'help-circle', label: 'Help Center', screen: 'HelpCenter' },
    { id: '2', icon: 'message-circle', label: 'Chat with Us', screen: 'Chat' },
    { id: '3', icon: 'file-text', label: 'Terms & Policies', screen: 'Terms' },
    { id: '4', icon: 'info', label: 'About AutoCart', screen: 'About' },
  ];

  const handleMenuPress = (screen: string) => {
    (navigation as any).navigate(screen);
  };

  const handleLogout = () => {
    logout();
  };

  // Clean Header
  const Header = () => (
    <View style={[styles.header, { backgroundColor: theme.colors.cardBackground, borderBottomColor: theme.colors.border }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.cardBackground} />
      <View style={styles.headerTop}>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>My Account</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.headerBtn, { backgroundColor: theme.colors.background }]}>
            <Icon name="settings" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.headerBtn, { backgroundColor: theme.colors.background }]}
            onPress={() => (navigation as any).navigate('Cart')}
          >
            <Icon name="shopping-cart" size={20} color={theme.colors.textSecondary} />
            {cartItems.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItems.length > 9 ? '9+' : cartItems.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Profile Card
  const ProfileCard = () => (
    <View style={[styles.profileCard, { backgroundColor: theme.colors.cardBackground }]}>
      <TouchableOpacity 
        style={styles.profileContent}
        onPress={() => isAuthenticated ? handleMenuPress('EditProfile') : handleMenuPress('Login')}
        activeOpacity={0.8}
      >
        <View style={styles.avatarSection}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <LinearGradient
              colors={['#2874F0', '#1565C0']}
              style={styles.avatarPlaceholder}
            >
              <Icon name="user" size={32} color="#FFFFFF" />
            </LinearGradient>
          )}
          {isAuthenticated && (
            <View style={styles.verifiedBadge}>
              <Icon name="check" size={10} color="#FFFFFF" />
            </View>
          )}
        </View>
        <View style={styles.profileInfo}>
          <View style={styles.nameRow}>
            <Text style={[styles.userName, { color: theme.colors.textPrimary }]}>
              {user?.name || 'Hello, Guest'}
            </Text>
            {isAuthenticated && (
              <View style={styles.plusBadge}>
                <Text style={styles.plusText}>PLUS</Text>
              </View>
            )}
          </View>
          <Text style={[styles.userEmail, { color: theme.colors.textTertiary }]}>
            {user?.email || 'Sign in for best experience'}
          </Text>
          {isAuthenticated && user?.phone && (
            <Text style={[styles.userPhone, { color: theme.colors.textTertiary }]}>
              {user.phone}
            </Text>
          )}
        </View>
        <Icon name="chevron-right" size={22} color={theme.colors.textTertiary} />
      </TouchableOpacity>

      {!isAuthenticated && (
        <View style={styles.authButtons}>
          <TouchableOpacity 
            style={styles.signInBtn}
            onPress={() => handleMenuPress('Login')}
          >
            <LinearGradient
              colors={['#2874F0', '#1565C0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.signInGradient}
            >
              <Text style={styles.signInText}>Sign In</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.signUpBtn, { borderColor: '#2874F0' }]}
            onPress={() => handleMenuPress('Register')}
          >
            <Text style={styles.signUpText}>New? Create Account</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  // Quick Actions Grid
  const QuickActions = () => (
    <View style={[styles.quickActionsCard, { backgroundColor: theme.colors.cardBackground }]}>
      <View style={styles.quickActionsGrid}>
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={action.id}
            style={[
              styles.quickAction,
              index < quickActions.length - 1 && styles.quickActionBorder,
              { borderColor: theme.colors.border }
            ]}
            onPress={() => handleMenuPress(action.screen)}
            activeOpacity={0.7}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#E3F2FD' }]}>
              <Icon name={action.icon as any} size={22} color="#2874F0" />
            </View>
            <Text style={[styles.quickActionLabel, { color: theme.colors.textPrimary }]}>
              {action.label}
            </Text>
            {action.count !== null && (
              <Text style={[styles.quickActionCount, { color: theme.colors.textTertiary }]}>
                {action.count}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Menu Section with Title
  const MenuSection = ({ title, items, showSubtitle = true }: { title: string; items: any[]; showSubtitle?: boolean }) => (
    <View style={styles.menuSection}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textTertiary }]}>{title}</Text>
      <View style={[styles.menuCard, { backgroundColor: theme.colors.cardBackground }]}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuItem,
              index < items.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.colors.border }
            ]}
            onPress={() => handleMenuPress(item.screen)}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconBox, { backgroundColor: (item.color || '#2874F0') + '12' }]}>
              <Icon name={item.icon as any} size={20} color={item.color || '#2874F0'} />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuLabel, { color: theme.colors.textPrimary }]}>{item.label}</Text>
              {showSubtitle && item.subtitle && (
                <Text style={[styles.menuSubtitle, { color: theme.colors.textTertiary }]}>{item.subtitle}</Text>
              )}
            </View>
            <Icon name="chevron-right" size={18} color={theme.colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Logout Section
  const LogoutSection = () => (
    isAuthenticated ? (
      <TouchableOpacity
        style={[styles.logoutBtn, { backgroundColor: theme.colors.cardBackground }]}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Icon name="log-out" size={20} color="#D32F2F" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    ) : null
  );

  // Footer
  const Footer = () => (
    <View style={styles.footer}>
      <View style={styles.footerLogos}>
        <View style={[styles.footerBadge, { backgroundColor: theme.colors.cardBackground }]}>
          <Icon name="shield" size={16} color="#4CAF50" />
          <Text style={[styles.footerBadgeText, { color: theme.colors.textSecondary }]}>100% Secure</Text>
        </View>
        <View style={[styles.footerBadge, { backgroundColor: theme.colors.cardBackground }]}>
          <Icon name="truck" size={16} color="#2874F0" />
          <Text style={[styles.footerBadgeText, { color: theme.colors.textSecondary }]}>Free Delivery</Text>
        </View>
      </View>
      <Text style={[styles.versionText, { color: theme.colors.textTertiary }]}>
        AutoCart v1.0.0
      </Text>
      <Text style={[styles.copyrightText, { color: theme.colors.textTertiary }]}>
        Made with ❤️ in India
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ProfileCard />
        <QuickActions />
        <MenuSection title="ACCOUNT SETTINGS" items={accountMenu} />
        <MenuSection title="MORE OPTIONS" items={moreMenu} />
        <MenuSection title="HELP & SUPPORT" items={supportMenu} showSubtitle={false} />
        <LogoutSection />
        <Footer />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
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
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF5722',
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

  // Profile Card
  profileCard: {
    margin: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatarSection: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
  },
  plusBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  plusText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#000000',
  },
  userEmail: {
    fontSize: 13,
    marginTop: 3,
  },
  userPhone: {
    fontSize: 12,
    marginTop: 2,
  },
  authButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  signInBtn: {
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  signInGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  signInText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  signUpBtn: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  signUpText: {
    color: '#2874F0',
    fontSize: 14,
    fontWeight: '600',
  },

  // Quick Actions
  quickActionsCard: {
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  quickActionsGrid: {
    flexDirection: 'row',
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  quickActionBorder: {
    borderRightWidth: 1,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  quickActionCount: {
    fontSize: 11,
    marginTop: 2,
  },

  // Menu Section
  menuSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginHorizontal: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  menuCard: {
    marginHorizontal: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  menuIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  menuSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },

  // Logout
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
    marginTop: 8,
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#D32F2F',
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  footerLogos: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  footerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  footerBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  versionText: {
    fontSize: 12,
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 11,
  },
});

export default ProfileScreen;
