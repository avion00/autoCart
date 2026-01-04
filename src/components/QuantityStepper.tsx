// ============================================
// AutoCart - Quantity Stepper Component
// ============================================

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme';
import { Icon } from './Icon';

interface QuantityStepperProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  size?: 'small' | 'medium' | 'large';
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
  size = 'medium',
}) => {
  const theme = useTheme();

  const getSize = () => {
    switch (size) {
      case 'small': return { button: 28, icon: 14, font: 13 };
      case 'medium': return { button: 36, icon: 18, font: 15 };
      case 'large': return { button: 44, icon: 22, font: 17 };
      default: return { button: 36, icon: 18, font: 15 };
    }
  };

  const sizes = getSize();

  return (
    <View style={[styles.container, { borderColor: theme.colors.border }]}>
      <TouchableOpacity
        style={[
          styles.button,
          { 
            width: sizes.button, 
            height: sizes.button,
            backgroundColor: quantity <= min ? theme.colors.border : theme.colors.primary,
          },
        ]}
        onPress={onDecrease}
        disabled={quantity <= min}
        activeOpacity={0.7}
      >
        <Icon 
          name="minus" 
          size={sizes.icon} 
          color={quantity <= min ? theme.colors.textTertiary : '#FFFFFF'} 
        />
      </TouchableOpacity>
      <View style={[styles.quantityContainer, { minWidth: sizes.button }]}>
        <Text style={[styles.quantity, { color: theme.colors.textPrimary, fontSize: sizes.font }]}>
          {quantity}
        </Text>
      </View>
      <TouchableOpacity
        style={[
          styles.button,
          { 
            width: sizes.button, 
            height: sizes.button,
            backgroundColor: quantity >= max ? theme.colors.border : theme.colors.primary,
          },
        ]}
        onPress={onIncrease}
        disabled={quantity >= max}
        activeOpacity={0.7}
      >
        <Icon 
          name="plus" 
          size={sizes.icon} 
          color={quantity >= max ? theme.colors.textTertiary : '#FFFFFF'} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  quantity: {
    fontWeight: '600',
  },
});

export default QuantityStepper;
