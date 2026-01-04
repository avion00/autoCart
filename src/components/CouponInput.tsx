// ============================================
// AutoCart - Coupon Input Component
// ============================================

import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme';
import { Icon } from './Icon';

interface CouponInputProps {
  onApply: (code: string) => Promise<boolean>;
  onRemove?: () => void;
  appliedCoupon?: string | null;
  disabled?: boolean;
}

export const CouponInput: React.FC<CouponInputProps> = ({
  onApply,
  onRemove,
  appliedCoupon,
  disabled = false,
}) => {
  const theme = useTheme();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApply = async () => {
    if (!code.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    const success = await onApply(code.trim());
    
    if (!success) {
      setError('Invalid coupon code');
    } else {
      setCode('');
    }
    
    setIsLoading(false);
  };

  if (appliedCoupon) {
    return (
      <View style={[styles.appliedContainer, { backgroundColor: theme.colors.success + '15', borderColor: theme.colors.success }]}>
        <View style={styles.appliedContent}>
          <Icon name="check-circle" size={20} color={theme.colors.success} />
          <Text style={[styles.appliedText, { color: theme.colors.success }]}>
            Coupon "{appliedCoupon}" applied
          </Text>
        </View>
        {onRemove && (
          <TouchableOpacity onPress={onRemove}>
            <Icon name="x" size={20} color={theme.colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View>
      <View style={[styles.container, { borderColor: error ? theme.colors.error : theme.colors.border }]}>
        <Icon name="tag" size={18} color={theme.colors.textTertiary} style={styles.icon} />
        <TextInput
          style={[styles.input, { color: theme.colors.textPrimary }]}
          value={code}
          onChangeText={(text) => {
            setCode(text.toUpperCase());
            setError('');
          }}
          placeholder="Enter coupon code"
          placeholderTextColor={theme.colors.inputPlaceholder}
          autoCapitalize="characters"
          editable={!disabled}
        />
        <TouchableOpacity
          style={[styles.applyButton, { backgroundColor: theme.colors.primary, opacity: disabled || !code.trim() ? 0.5 : 1 }]}
          onPress={handleApply}
          disabled={disabled || !code.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.applyText}>Apply</Text>
          )}
        </TouchableOpacity>
      </View>
      {error && <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 12,
    overflow: 'hidden',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 12,
  },
  applyButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  applyText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
  appliedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  appliedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appliedText: {
    fontWeight: '600',
    fontSize: 14,
  },
});

export default CouponInput;
