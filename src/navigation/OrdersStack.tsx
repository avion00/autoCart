// ============================================
// AutoCart - Orders Stack Navigator
// ============================================

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OrdersStackParamList } from './types';

import OrdersScreen from '../features/orders/screens/OrdersScreen';

const Stack = createNativeStackNavigator<OrdersStackParamList>();

const OrdersStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="OrdersMain" component={OrdersScreen} />
    </Stack.Navigator>
  );
};

export default OrdersStack;
