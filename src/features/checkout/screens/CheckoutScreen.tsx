// ============================================
// AutoCart - Checkout Screen (Premium Flipkart Style)
// ============================================

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../../theme';
import { Icon } from '../../../components';
import { useCartStore, useAuthStore } from '../../../store';

const CheckoutScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { items, subtotal, discount, deliveryFee, tax, total } = useCartStore();
  const { addresses } = useAuthStore();

  const [selectedAddress, setSelectedAddress] = useState(addresses.find(a => a.isDefault) || addresses[0]);
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    await new Promise<void>(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    (navigation as any).navigate('OrderConfirmation', { orderId: `ORD-${Date.now()}` });
  };

  const totalSavings = discount + (deliveryFee === 0 ? 40 : 0);

  // Flipkart-style Header with Steps
  const Header = () => (
    <View style={styles.headerContainer}>
      <LinearGradient colors={['#2874F0', '#1565C0']} style={styles.header}>
        <StatusBar barStyle="light-content" backgroundColor="#2874F0" />
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleSection}>
            <Text style={styles.headerTitle}>Checkout</Text>
            <Text style={styles.headerSubtitle}>{items.length} items • ${total.toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.headerBtn}>
            <Icon name="help-circle" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      {/* Progress Steps */}
      <View style={[styles.stepsContainer, { backgroundColor: theme.colors.cardBackground }]}>
        <View style={styles.stepsRow}>
          {[
            { num: 1, label: 'Address' },
            { num: 2, label: 'Payment' },
            { num: 3, label: 'Summary' },
          ].map((step, index) => (
            <React.Fragment key={step.num}>
              <TouchableOpacity 
                style={styles.stepItem}
                onPress={() => setCurrentStep(step.num)}
              >
                <View style={[
                  styles.stepCircle,
                  currentStep >= step.num 
                    ? { backgroundColor: '#2874F0' }
                    : { backgroundColor: '#E0E0E0' }
                ]}>
                  {currentStep > step.num ? (
                    <Icon name="check" size={14} color="#FFFFFF" />
                  ) : (
                    <Text style={[
                      styles.stepNum,
                      currentStep >= step.num ? { color: '#FFFFFF' } : { color: '#9E9E9E' }
                    ]}>{step.num}</Text>
                  )}
                </View>
                <Text style={[
                  styles.stepLabel,
                  currentStep >= step.num 
                    ? { color: '#2874F0', fontWeight: '600' }
                    : { color: theme.colors.textTertiary }
                ]}>{step.label}</Text>
              </TouchableOpacity>
              {index < 2 && (
                <View style={[
                  styles.stepLine,
                  currentStep > step.num 
                    ? { backgroundColor: '#2874F0' }
                    : { backgroundColor: '#E0E0E0' }
                ]} />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>
    </View>
  );

  // Delivery Info Banner
  const DeliveryBanner = () => (
    <View style={[styles.deliveryBanner, { backgroundColor: '#E8F5E9' }]}>
      <Icon name="truck" size={18} color="#2E7D32" />
      <Text style={styles.deliveryBannerText}>
        <Text style={{ fontWeight: '700' }}>Free Delivery</Text> by Tomorrow, 10 PM
      </Text>
      <Icon name="info" size={16} color="#2E7D32" />
    </View>
  );

  // Address Section - Enhanced
  const AddressSection = () => (
    <Animated.View style={[styles.section, { backgroundColor: theme.colors.cardBackground, opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIcon, { backgroundColor: '#E3F2FD' }]}>
          <Icon name="map-pin" size={18} color="#2874F0" />
        </View>
        <View style={styles.sectionTitleWrap}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Delivery Address</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.colors.textTertiary }]}>Where should we deliver?</Text>
        </View>
      </View>
      
      {selectedAddress ? (
        <View style={[styles.addressCard, { borderColor: '#2874F0', backgroundColor: '#FAFAFA' }]}>
          <View style={styles.addressBadge}>
            <Icon name="home" size={12} color="#FFFFFF" />
            <Text style={styles.addressBadgeText}>HOME</Text>
          </View>
          <View style={styles.addressContent}>
            <View style={styles.addressNameRow}>
              <Text style={[styles.addressName, { color: theme.colors.textPrimary }]}>
                {selectedAddress.name}
              </Text>
              <View style={styles.verifiedBadge}>
                <Icon name="check-circle" size={12} color="#4CAF50" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>
            <Text style={[styles.addressText, { color: theme.colors.textSecondary }]}>
              {selectedAddress.addressLine1}
              {selectedAddress.addressLine2 && `, ${selectedAddress.addressLine2}`}
            </Text>
            <Text style={[styles.addressText, { color: theme.colors.textSecondary }]}>
              {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}
            </Text>
            <View style={styles.addressPhoneRow}>
              <Icon name="phone" size={12} color={theme.colors.textTertiary} />
              <Text style={[styles.addressPhone, { color: theme.colors.textSecondary }]}>
                {selectedAddress.phone}
              </Text>
            </View>
          </View>
          <View style={styles.addressActions}>
            <TouchableOpacity style={[styles.addressActionBtn, { borderColor: theme.colors.border }]}>
              <Icon name="edit-2" size={14} color="#2874F0" />
              <Text style={styles.addressActionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.addressActionBtn, { borderColor: theme.colors.border }]}>
              <Icon name="refresh-cw" size={14} color="#2874F0" />
              <Text style={styles.addressActionText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={[styles.addAddressBtn, { borderColor: '#2874F0' }]}>
          <View style={styles.addAddressIcon}>
            <Icon name="plus" size={20} color="#2874F0" />
          </View>
          <View>
            <Text style={[styles.addAddressTitle, { color: '#2874F0' }]}>Add New Address</Text>
            <Text style={[styles.addAddressSubtitle, { color: theme.colors.textTertiary }]}>
              Add delivery location
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </Animated.View>
  );

  // Payment Section - Enhanced
  const PaymentSection = () => (
    <Animated.View style={[styles.section, { backgroundColor: theme.colors.cardBackground, opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIcon, { backgroundColor: '#FFF3E0' }]}>
          <Icon name="credit-card" size={18} color="#FF9800" />
        </View>
        <View style={styles.sectionTitleWrap}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Payment Method</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.colors.textTertiary }]}>Choose how to pay</Text>
        </View>
      </View>

      {/* Recommended Badge */}
      <View style={styles.recommendedBadge}>
        <Icon name="zap" size={12} color="#FF9800" />
        <Text style={styles.recommendedText}>Recommended</Text>
      </View>

      {[
        { id: 'cod', name: 'Cash on Delivery', desc: 'Pay when you receive', icon: 'dollar-sign', recommended: true },
        { id: 'card', name: 'Credit/Debit Card', desc: 'Visa, Mastercard, RuPay', icon: 'credit-card', recommended: false },
        { id: 'upi', name: 'UPI', desc: 'Google Pay, PhonePe, Paytm', icon: 'smartphone', recommended: false },
        { id: 'wallet', name: 'Wallet', desc: 'AutoCart Pay Balance: $0.00', icon: 'briefcase', recommended: false },
        { id: 'netbanking', name: 'Net Banking', desc: 'All major banks supported', icon: 'landmark', recommended: false },
      ].map((method, index) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.paymentOption,
            { 
              borderColor: selectedPayment === method.id ? '#2874F0' : theme.colors.border,
              backgroundColor: selectedPayment === method.id ? '#F3F8FF' : 'transparent'
            }
          ]}
          onPress={() => setSelectedPayment(method.id)}
        >
          <View style={[
            styles.paymentIconBox,
            { backgroundColor: selectedPayment === method.id ? '#E3F2FD' : '#F5F5F5' }
          ]}>
            <Icon name={method.icon} size={18} color={selectedPayment === method.id ? '#2874F0' : '#757575'} />
          </View>
          <View style={styles.paymentInfo}>
            <Text style={[styles.paymentText, { color: theme.colors.textPrimary }]}>{method.name}</Text>
            <Text style={[styles.paymentDesc, { color: theme.colors.textTertiary }]}>{method.desc}</Text>
          </View>
          <View style={[
            styles.radioOuter,
            { borderColor: selectedPayment === method.id ? '#2874F0' : '#BDBDBD' }
          ]}>
            {selectedPayment === method.id && (
              <View style={[styles.radioInner, { backgroundColor: '#2874F0' }]} />
            )}
          </View>
        </TouchableOpacity>
      ))}

      {/* Secure Payment Info */}
      <View style={styles.secureInfo}>
        <Icon name="shield" size={14} color="#4CAF50" />
        <Text style={styles.secureText}>Your payment information is secure & encrypted</Text>
      </View>
    </Animated.View>
  );

  // Order Items Preview
  const OrderItemsPreview = () => (
    <Animated.View style={[styles.section, { backgroundColor: theme.colors.cardBackground, opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIcon, { backgroundColor: '#E8F5E9' }]}>
          <Icon name="shopping-bag" size={18} color="#4CAF50" />
        </View>
        <View style={styles.sectionTitleWrap}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Order Items</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.colors.textTertiary }]}>{items.length} items in cart</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.itemsScroll}>
        {items.slice(0, 4).map((item) => (
          <View key={item.id} style={styles.itemPreview}>
            <Image source={{ uri: item.product.images?.[0] || '' }} style={styles.itemPreviewImage} />
            <View style={styles.itemQtyBadge}>
              <Text style={styles.itemQtyText}>×{item.quantity}</Text>
            </View>
          </View>
        ))}
        {items.length > 4 && (
          <View style={[styles.itemPreview, styles.moreItems]}>
            <Text style={styles.moreItemsText}>+{items.length - 4}</Text>
          </View>
        )}
      </ScrollView>
    </Animated.View>
  );

  // Order Summary - Enhanced
  const OrderSummary = () => (
    <Animated.View style={[styles.section, { backgroundColor: theme.colors.cardBackground, opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIcon, { backgroundColor: '#FCE4EC' }]}>
          <Icon name="file-text" size={18} color="#E91E63" />
        </View>
        <View style={styles.sectionTitleWrap}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Price Details</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.colors.textTertiary }]}>Breakdown of charges</Text>
        </View>
      </View>

      <View style={styles.priceRows}>
        <View style={styles.priceRow}>
          <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
            Price ({items.length} items)
          </Text>
          <Text style={[styles.priceValue, { color: theme.colors.textPrimary }]}>
            ${subtotal.toFixed(2)}
          </Text>
        </View>

        {discount > 0 && (
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: '#4CAF50' }]}>Discount</Text>
            <Text style={[styles.priceValue, { color: '#4CAF50' }]}>
              -${discount.toFixed(2)}
            </Text>
          </View>
        )}

        <View style={styles.priceRow}>
          <View style={styles.priceLabelRow}>
            <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>Delivery Charges</Text>
            <TouchableOpacity>
              <Icon name="info" size={14} color={theme.colors.textTertiary} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.priceValue, { color: deliveryFee === 0 ? '#4CAF50' : theme.colors.textPrimary }]}>
            {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
          </Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>Platform Fee</Text>
          <Text style={[styles.priceValue, { color: '#4CAF50' }]}>FREE</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>Tax (GST)</Text>
          <Text style={[styles.priceValue, { color: theme.colors.textPrimary }]}>
            ${tax.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={[styles.totalDivider, { backgroundColor: theme.colors.border }]} />

      <View style={styles.totalRow}>
        <Text style={[styles.totalLabel, { color: theme.colors.textPrimary }]}>Total Amount</Text>
        <Text style={[styles.totalValue, { color: theme.colors.textPrimary }]}>
          ${total.toFixed(2)}
        </Text>
      </View>

      {totalSavings > 0 && (
        <View style={styles.savingsBanner}>
          <Icon name="tag" size={16} color="#4CAF50" />
          <Text style={styles.savingsText}>
            You're saving <Text style={{ fontWeight: '700' }}>${totalSavings.toFixed(2)}</Text> on this order
          </Text>
        </View>
      )}
    </Animated.View>
  );

  // Trust & Safety Section
  const TrustSection = () => (
    <View style={[styles.trustSection, { backgroundColor: theme.colors.cardBackground }]}>
      <View style={styles.trustItem}>
        <View style={[styles.trustIcon, { backgroundColor: '#E3F2FD' }]}>
          <Icon name="shield" size={20} color="#2874F0" />
        </View>
        <Text style={[styles.trustText, { color: theme.colors.textSecondary }]}>Safe & Secure{'\n'}Payments</Text>
      </View>
      <View style={styles.trustItem}>
        <View style={[styles.trustIcon, { backgroundColor: '#E8F5E9' }]}>
          <Icon name="refresh-cw" size={20} color="#4CAF50" />
        </View>
        <Text style={[styles.trustText, { color: theme.colors.textSecondary }]}>Easy 7-Day{'\n'}Returns</Text>
      </View>
      <View style={styles.trustItem}>
        <View style={[styles.trustIcon, { backgroundColor: '#FFF3E0' }]}>
          <Icon name="award" size={20} color="#FF9800" />
        </View>
        <Text style={[styles.trustText, { color: theme.colors.textSecondary }]}>100%{'\n'}Authentic</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <DeliveryBanner />
        <AddressSection />
        <PaymentSection />
        <OrderItemsPreview />
        <OrderSummary />
        <TrustSection />
      </ScrollView>

      {/* Bottom Checkout Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.cardBackground, borderTopColor: theme.colors.border }]}>
        <View style={styles.bottomLeft}>
          <Text style={[styles.bottomTotal, { color: theme.colors.textPrimary }]}>
            ${total.toFixed(2)}
          </Text>
          <TouchableOpacity style={styles.viewDetailsBtn}>
            <Text style={styles.viewDetailsText}>View Details</Text>
            <Icon name="chevron-up" size={14} color="#2874F0" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={[styles.placeOrderBtn, isProcessing && { opacity: 0.7 }]} 
          onPress={handlePlaceOrder} 
          disabled={isProcessing}
          activeOpacity={0.8}
        >
          <LinearGradient 
            colors={['#FB641B', '#FF9800']} 
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.placeOrderGradient}
          >
            {isProcessing ? (
              <Text style={styles.placeOrderText}>Processing...</Text>
            ) : (
              <>
                <Text style={styles.placeOrderText}>Place Order</Text>
                <Icon name="arrow-right" size={18} color="#FFFFFF" />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },

  // Header
  headerContainer: {
    overflow: 'hidden',
  },
  header: {
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleSection: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  headerBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Steps
  stepsContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepItem: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  stepNum: {
    fontSize: 12,
    fontWeight: '600',
  },
  stepLabel: {
    fontSize: 11,
  },
  stepLine: {
    width: 50,
    height: 2,
    marginHorizontal: 8,
    marginBottom: 20,
  },

  // Delivery Banner
  deliveryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 8,
  },
  deliveryBannerText: {
    flex: 1,
    fontSize: 13,
    color: '#2E7D32',
  },

  // Sections
  section: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 12,
    marginTop: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitleWrap: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  sectionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },

  // Address
  addressCard: {
    borderRadius: 8,
    borderWidth: 1.5,
    padding: 12,
    position: 'relative',
  },
  addressBadge: {
    position: 'absolute',
    top: -10,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2874F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 4,
  },
  addressBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addressContent: {
    marginTop: 8,
  },
  addressNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  addressName: {
    fontSize: 15,
    fontWeight: '600',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '500',
  },
  addressText: {
    fontSize: 13,
    lineHeight: 19,
  },
  addressPhoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  addressPhone: {
    fontSize: 13,
  },
  addressActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  addressActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    gap: 6,
  },
  addressActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2874F0',
  },
  addAddressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    gap: 12,
  },
  addAddressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addAddressTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  addAddressSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },

  // Payment
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 12,
    gap: 4,
  },
  recommendedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF9800',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1.5,
    marginBottom: 10,
  },
  paymentIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentText: {
    fontSize: 14,
    fontWeight: '500',
  },
  paymentDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  secureInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  secureText: {
    fontSize: 12,
    color: '#4CAF50',
  },

  // Order Items Preview
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2874F0',
  },
  itemsScroll: {
    marginTop: 4,
  },
  itemPreview: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
    position: 'relative',
  },
  itemPreviewImage: {
    width: '100%',
    height: '100%',
  },
  itemQtyBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  itemQtyText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  moreItems: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
  },
  moreItemsText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2874F0',
  },

  // Price Details
  priceRows: {
    gap: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priceLabel: {
    fontSize: 14,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalDivider: {
    height: 1,
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 6,
    gap: 8,
  },
  savingsText: {
    fontSize: 13,
    color: '#2E7D32',
  },

  // Trust Section
  trustSection: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
  },
  trustItem: {
    flex: 1,
    alignItems: 'center',
  },
  trustIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  trustText: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 15,
  },

  // Bottom Bar
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 100,
    borderTopWidth: 1,
  },
  bottomLeft: {
    marginRight: 16,
  },
  bottomTotal: {
    fontSize: 20,
    fontWeight: '700',
  },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2874F0',
  },
  placeOrderBtn: {
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  placeOrderGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  placeOrderText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CheckoutScreen;
