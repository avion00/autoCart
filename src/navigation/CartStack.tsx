// ============================================
// AutoCart - Cart Stack Navigator
// ============================================

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartStackParamList } from './types';

import CartScreen from '../features/cart/screens/CartScreen';
import CheckoutScreen from '../features/checkout/screens/CheckoutScreen';
import OrderSuccessScreen from '../features/checkout/screens/OrderSuccessScreen';

const Stack = createNativeStackNavigator<CartStackParamList>();

const CartStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="CartMain" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderConfirmation" component={OrderSuccessScreen} />
    </Stack.Navigator>
  );
};

export default CartStack;
