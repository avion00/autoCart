// ============================================
// AutoCart - Ultra Premium Main Tab Navigator
// Swipeable Tabs with Smooth Animations
// ============================================

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  Dimensions,
  Platform,
  PanResponder,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../theme';
import { Icon } from '../components';
import { MainTabParamList } from './types';
import { useCartStore } from '../store';

import HomeStack from './HomeStack';
import CategoriesStack from './CategoriesStack';
import CartStack from './CartStack';
import OrdersStack from './OrdersStack';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator<MainTabParamList>();
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Tab names in order for swipe navigation
const TAB_NAMES: (keyof MainTabParamList)[] = ['Home', 'Categories', 'Cart', 'Orders', 'Profile'];
const SWIPE_THRESHOLD = 50;
const SWIPE_VELOCITY_THRESHOLD = 0.3;

// ============================================
// ANIMATED TAB ITEM COMPONENT
// ============================================
interface AnimatedTabItemProps {
  route: any;
  index: number;
  isFocused: boolean;
  options: any;
  onPress: () => void;
  onLongPress: () => void;
  config: { icon: string; label: string; activeColor: string; gradient: string[] };
  cartCount: number;
  theme: any;
}

const AnimatedTabItem: React.FC<AnimatedTabItemProps> = ({
  route,
  index,
  isFocused,
  options,
  onPress,
  onLongPress,
  config,
  cartCount,
  theme,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const iconScaleAnim = useRef(new Animated.Value(isFocused ? 1.15 : 1)).current;
  const bgOpacityAnim = useRef(new Animated.Value(isFocused ? 1 : 0)).current;
  const labelOpacityAnim = useRef(new Animated.Value(isFocused ? 1 : 0.7)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const isCart = route.name === 'Cart';

  useEffect(() => {
    Animated.parallel([
      Animated.spring(iconScaleAnim, {
        toValue: isFocused ? 1.15 : 1,
        friction: 5,
        tension: 300,
        useNativeDriver: true,
      }),
      Animated.timing(bgOpacityAnim, {
        toValue: isFocused ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(labelOpacityAnim, {
        toValue: isFocused ? 1 : 0.6,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isFocused]);

  const handlePress = () => {
    // Bounce animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Icon bounce
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: -8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 0,
        friction: 3,
        tension: 300,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      onPress={handlePress}
      onLongPress={onLongPress}
      activeOpacity={1}
      style={styles.tabItem}
    >
      <Animated.View
        style={[
          styles.tabItemInner,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* Active background pill */}
        <Animated.View 
          style={[
            styles.activePill,
            { opacity: bgOpacityAnim }
          ]}
        >
          <LinearGradient
            colors={[config.activeColor + '20', config.activeColor + '10']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.activePillGradient}
          />
        </Animated.View>

        {/* Icon with animations */}
        <Animated.View
          style={[
            styles.iconWrapper,
            {
              transform: [
                { scale: iconScaleAnim },
                { translateY: bounceAnim },
              ],
            },
          ]}
        >
          <Icon 
            name={config.icon as any} 
            size={24} 
            color={isFocused ? config.activeColor : theme.colors.tabBarInactive} 
          />
          
          {/* Cart badge */}
          {isCart && cartCount > 0 && (
            <Animated.View style={[styles.badge, { transform: [{ scale: scaleAnim }] }]}>
              <LinearGradient
                colors={config.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.badgeGradient}
              >
                <Text style={styles.badgeText}>
                  {cartCount > 99 ? '99+' : cartCount}
                </Text>
              </LinearGradient>
            </Animated.View>
          )}
        </Animated.View>

        {/* Label */}
        <Animated.Text
          style={[
            styles.tabLabel,
            {
              color: isFocused ? config.activeColor : theme.colors.tabBarInactive,
              fontWeight: isFocused ? '700' : '500',
              opacity: labelOpacityAnim,
            },
          ]}
          numberOfLines={1}
        >
          {config.label}
        </Animated.Text>

        {/* Active indicator line */}
        {isFocused && (
          <Animated.View 
            style={[
              styles.activeIndicatorLine,
              { 
                backgroundColor: config.activeColor,
                opacity: bgOpacityAnim,
              }
            ]} 
          />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

// ============================================
// CUSTOM TAB BAR COMPONENT
// ============================================
interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const CustomTabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const cartCount = useCartStore(s => s.itemCount);
  const slideUpAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.spring(slideUpAnim, {
      toValue: 0,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, []);

  // Tab configuration with icons, colors and gradients
  const tabConfig: Record<string, { icon: string; label: string; activeColor: string; gradient: string[] }> = {
    Home: { icon: 'home', label: 'Home', activeColor: '#2874F0', gradient: ['#2874F0', '#1565C0'] },
    Categories: { icon: 'grid', label: 'Explore', activeColor: '#9C27B0', gradient: ['#9C27B0', '#7B1FA2'] },
    Cart: { icon: 'shopping-cart', label: 'Cart', activeColor: '#FF5722', gradient: ['#FF5722', '#E64A19'] },
    Orders: { icon: 'package', label: 'Orders', activeColor: '#00C853', gradient: ['#00C853', '#00A844'] },
    Profile: { icon: 'user', label: 'Account', activeColor: '#E91E63', gradient: ['#E91E63', '#C2185B'] },
  };

  const handleTabPress = (route: any, isFocused: boolean) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  const handleTabLongPress = (route: any) => {
    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    });
  };

  return (
    <Animated.View 
      style={[
        styles.tabBarContainer, 
        { 
          paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
          transform: [{ translateY: slideUpAnim }],
        }
      ]}
    >
      {/* Floating glass card */}
      <View style={[styles.tabBarCard, { backgroundColor: theme.colors.cardBackground }]}>
        {/* Top highlight line */}
        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)', 'transparent']}
          style={styles.topHighlight}
        />
        
        <View style={styles.tabBarInner}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;
            const config = tabConfig[route.name] || { 
              icon: 'circle', 
              label: route.name, 
              activeColor: '#2874F0',
              gradient: ['#2874F0', '#1565C0']
            };

            return (
              <AnimatedTabItem
                key={route.key}
                route={route}
                index={index}
                isFocused={isFocused}
                options={options}
                onPress={() => handleTabPress(route, isFocused)}
                onLongPress={() => handleTabLongPress(route)}
                config={config}
                cartCount={cartCount}
                theme={theme}
              />
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
};

// ============================================
// SWIPE GESTURE WRAPPER
// ============================================
interface SwipeableScreenProps {
  children: React.ReactNode;
  navigation: any;
  currentIndex: number;
}

const SwipeableScreen: React.FC<SwipeableScreenProps> = ({ children, navigation, currentIndex }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal swipes
        const { dx, dy } = gestureState;
        return Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10;
      },
      onPanResponderGrant: () => {
        // Reset values
      },
      onPanResponderMove: (_, gestureState) => {
        const { dx } = gestureState;
        // Limit the drag based on boundaries
        const canSwipeLeft = currentIndex < TAB_NAMES.length - 1;
        const canSwipeRight = currentIndex > 0;
        
        if ((dx < 0 && canSwipeLeft) || (dx > 0 && canSwipeRight)) {
          // Add resistance at edges
          const resistance = 0.4;
          translateX.setValue(dx * resistance);
          // Slight opacity change for feedback
          const opacityValue = 1 - Math.abs(dx) / (SCREEN_WIDTH * 2);
          opacity.setValue(Math.max(0.85, opacityValue));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dx, vx } = gestureState;
        const canSwipeLeft = currentIndex < TAB_NAMES.length - 1;
        const canSwipeRight = currentIndex > 0;
        
        // Check if swipe meets threshold
        const swipeLeft = (dx < -SWIPE_THRESHOLD || vx < -SWIPE_VELOCITY_THRESHOLD) && canSwipeLeft;
        const swipeRight = (dx > SWIPE_THRESHOLD || vx > SWIPE_VELOCITY_THRESHOLD) && canSwipeRight;

        if (swipeLeft) {
          // Navigate to next tab
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: -SCREEN_WIDTH * 0.3,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.7,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start(() => {
            navigation.navigate(TAB_NAMES[currentIndex + 1]);
            translateX.setValue(0);
            opacity.setValue(1);
          });
        } else if (swipeRight) {
          // Navigate to previous tab
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: SCREEN_WIDTH * 0.3,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.7,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start(() => {
            navigation.navigate(TAB_NAMES[currentIndex - 1]);
            translateX.setValue(0);
            opacity.setValue(1);
          });
        } else {
          // Snap back
          Animated.parallel([
            Animated.spring(translateX, {
              toValue: 0,
              friction: 8,
              tension: 100,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.swipeContainer,
        {
          transform: [{ translateX }],
          opacity,
        },
      ]}
      {...panResponder.panHandlers}
    >
      {children}
    </Animated.View>
  );
};

// ============================================
// WRAPPED SCREEN COMPONENTS
// ============================================
const WrappedHomeStack: React.FC = () => {
  const navigation = useNavigation();
  return (
    <SwipeableScreen navigation={navigation} currentIndex={0}>
      <HomeStack />
    </SwipeableScreen>
  );
};

const WrappedCategoriesStack: React.FC = () => {
  const navigation = useNavigation();
  return (
    <SwipeableScreen navigation={navigation} currentIndex={1}>
      <CategoriesStack />
    </SwipeableScreen>
  );
};

const WrappedCartStack: React.FC = () => {
  const navigation = useNavigation();
  return (
    <SwipeableScreen navigation={navigation} currentIndex={2}>
      <CartStack />
    </SwipeableScreen>
  );
};

const WrappedOrdersStack: React.FC = () => {
  const navigation = useNavigation();
  return (
    <SwipeableScreen navigation={navigation} currentIndex={3}>
      <OrdersStack />
    </SwipeableScreen>
  );
};

const WrappedProfileStack: React.FC = () => {
  const navigation = useNavigation();
  return (
    <SwipeableScreen navigation={navigation} currentIndex={4}>
      <ProfileStack />
    </SwipeableScreen>
  );
};

// ============================================
// MAIN TABS COMPONENT
// ============================================
export const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        animation: 'shift',
      }}
    >
      <Tab.Screen name="Home" component={WrappedHomeStack} />
      <Tab.Screen name="Categories" component={WrappedCategoriesStack} />
      <Tab.Screen name="Cart" component={WrappedCartStack} />
      <Tab.Screen name="Orders" component={WrappedOrdersStack} />
      <Tab.Screen name="Profile" component={WrappedProfileStack} />
    </Tab.Navigator>
  );
};

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
  },
  tabBarCard: {
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    borderWidth: Platform.OS === 'ios' ? 0.5 : 0,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  tabBarInner: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    minWidth: 56,
    position: 'relative',
  },
  activePill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    overflow: 'hidden',
  },
  activePillGradient: {
    flex: 1,
  },
  iconWrapper: {
    position: 'relative',
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -14,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  tabLabel: {
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  activeIndicatorLine: {
    position: 'absolute',
    bottom: 2,
    width: 16,
    height: 3,
    borderRadius: 1.5,
  },
  swipeContainer: {
    flex: 1,
  },
});

export default MainTabs;
