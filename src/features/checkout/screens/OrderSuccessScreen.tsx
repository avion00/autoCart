// ============================================
// AutoCart - Order Success Screen
// ============================================

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../../theme';
import { Icon, Button } from '../../../components';
import { useCartStore } from '../../../store';

const OrderSuccessScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params as { orderId: string };
  const { clearCart } = useCartStore();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    clearCart();
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, damping: 10 }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleContinueShopping = () => {
    (navigation as any).getParent()?.navigate('Home');
  };

  const handleViewOrder = () => {
    (navigation as any).getParent()?.navigate('Orders');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <View style={styles.content}>
        <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient colors={['#4CAF50', '#45A049']} style={styles.iconGradient}>
            <Icon name="check" size={60} color="#FFFFFF" />
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Order Placed Successfully!
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Thank you for your purchase. Your order has been confirmed.
          </Text>

          <View style={[styles.orderCard, { backgroundColor: theme.colors.cardBackground }]}>
            <Text style={[styles.orderLabel, { color: theme.colors.textSecondary }]}>
              Order ID
            </Text>
            <Text style={[styles.orderId, { color: theme.colors.textPrimary }]}>
              {orderId}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.infoItem, { backgroundColor: theme.colors.cardBackground }]}>
              <Icon name="truck" size={24} color={theme.colors.primary} />
              <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                Estimated delivery in 3-5 days
              </Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.actions, { opacity: fadeAnim }]}>
          <Button
            title="View Order"
            onPress={handleViewOrder}
            variant="outline"
            style={styles.viewOrderBtn}
          />
          <Button
            title="Continue Shopping"
            onPress={handleContinueShopping}
            style={styles.continueBtn}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  orderCard: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  orderLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  orderId: {
    fontSize: 18,
    fontWeight: '700',
  },
  infoRow: {
    width: '100%',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
  },
  actions: {
    width: '100%',
    marginTop: 32,
    gap: 12,
  },
  viewOrderBtn: {
    width: '100%',
  },
  continueBtn: {
    width: '100%',
  },
});

export default OrderSuccessScreen;
