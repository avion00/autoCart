// ============================================
// AutoCart - App Header Component
// ============================================

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../theme';
import { Icon } from './Icon';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showCart?: boolean;
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
  gradientColors?: string[];
  transparent?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  showBack = true,
  showSearch = false,
  showCart = false,
  rightAction,
  gradientColors = ['#2874F0', '#1565C0'],
  transparent = false,
}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const Content = () => (
    <View style={[styles.content, { paddingTop: insets.top > 0 ? 8 : 12 }]}>
      <View style={styles.leftSection}>
        {showBack && (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      <View style={styles.rightSection}>
        {showSearch && (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => (navigation as any).navigate('Search')}
          >
            <Icon name="search" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        {showCart && (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => (navigation as any).navigate('Cart')}
          >
            <Icon name="shopping-cart" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        {rightAction && (
          <TouchableOpacity style={styles.iconBtn} onPress={rightAction.onPress}>
            <Icon name={rightAction.icon} size={22} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (transparent) {
    return (
      <View style={[styles.container, { backgroundColor: 'transparent' }]}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <Content />
      </View>
    );
  }

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={gradientColors[0]} />
      <Content />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftSection: {
    width: 48,
  },
  titleSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    width: 48,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
});

export default AppHeader;
