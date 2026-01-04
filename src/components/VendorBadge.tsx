// ============================================
// AutoCart - Vendor Badge Component
// ============================================

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme';
import { Icon } from './Icon';

interface VendorBadgeProps {
  name: string;
  logo?: string;
  rating?: number;
  verified?: boolean;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export const VendorBadge: React.FC<VendorBadgeProps> = ({
  name,
  logo,
  rating,
  verified = false,
  onPress,
  size = 'medium',
}) => {
  const theme = useTheme();

  const getSize = () => {
    switch (size) {
      case 'small': return { logo: 24, font: 12, icon: 10 };
      case 'medium': return { logo: 32, font: 14, icon: 12 };
      case 'large': return { logo: 40, font: 16, icon: 14 };
      default: return { logo: 32, font: 14, icon: 12 };
    }
  };

  const sizes = getSize();

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.container, { backgroundColor: theme.colors.cardBackground }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {logo ? (
        <Image source={{ uri: logo }} style={[styles.logo, { width: sizes.logo, height: sizes.logo }]} />
      ) : (
        <View style={[styles.logoPlaceholder, { width: sizes.logo, height: sizes.logo, backgroundColor: theme.colors.primary + '15' }]}>
          <Icon name="shopping-bag" size={sizes.icon} color={theme.colors.primary} />
        </View>
      )}
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, { color: theme.colors.textPrimary, fontSize: sizes.font }]} numberOfLines={1}>
            {name}
          </Text>
          {verified && (
            <View style={styles.verifiedBadge}>
              <Icon name="check" size={sizes.icon} color="#FFFFFF" />
            </View>
          )}
        </View>
        {rating && (
          <View style={styles.ratingRow}>
            <Icon name="star" size={sizes.icon} color="#FFC107" />
            <Text style={[styles.rating, { color: theme.colors.textSecondary, fontSize: sizes.font - 2 }]}>
              {rating.toFixed(1)}
            </Text>
          </View>
        )}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    gap: 8,
  },
  logo: {
    borderRadius: 16,
  },
  logoPlaceholder: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    fontWeight: '600',
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  rating: {},
});

export default VendorBadge;
