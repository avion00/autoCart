// ============================================
// AutoCart - Loader Component
// ============================================

import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useTheme } from '../theme';

interface LoaderProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ 
  size = 'large', 
  color,
  text,
  fullScreen = false 
}) => {
  const theme = useTheme();
  const loaderColor = color || theme.colors.primary;

  if (fullScreen) {
    return (
      <View style={[styles.fullScreen, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size={size} color={loaderColor} />
        {text && (
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
            {text}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={loaderColor} />
      {text && (
        <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
          {text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 12,
    fontSize: 14,
  },
});

export default Loader;
