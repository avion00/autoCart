// ============================================
// AutoCart - Price Component
// ============================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

interface PriceProps {
  price: number;
  originalPrice?: number;
  size?: 'small' | 'medium' | 'large';
  showDiscount?: boolean;
  currency?: string;
}

export const Price: React.FC<PriceProps> = ({
  price,
  originalPrice,
  size = 'medium',
  showDiscount = true,
  currency = '$',
}) => {
  const theme = useTheme();

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const getFontSize = () => {
    switch (size) {
      case 'small': return { price: 14, original: 11, discount: 10 };
      case 'medium': return { price: 18, original: 13, discount: 11 };
      case 'large': return { price: 24, original: 16, discount: 12 };
      default: return { price: 18, original: 13, discount: 11 };
    }
  };

  const sizes = getFontSize();

  return (
    <View style={styles.container}>
      <Text style={[styles.price, { color: theme.colors.textPrimary, fontSize: sizes.price }]}>
        {currency}{price.toFixed(2)}
      </Text>
      {originalPrice && originalPrice > price && (
        <>
          <Text style={[styles.originalPrice, { color: theme.colors.textTertiary, fontSize: sizes.original }]}>
            {currency}{originalPrice.toFixed(2)}
          </Text>
          {showDiscount && (
            <View style={[styles.discountBadge, { backgroundColor: theme.colors.success }]}>
              <Text style={[styles.discountText, { fontSize: sizes.discount }]}>
                {discount}% OFF
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  price: {
    fontWeight: '700',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default Price;
