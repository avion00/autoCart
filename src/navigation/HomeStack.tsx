// ============================================
// AutoCart - Home Stack Navigator
// ============================================

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';

import HomeScreen from '../features/home/screens/HomeScreen';
import SearchScreen from '../features/search/screens/SearchScreen';
import ProductDetailsScreen from '../features/product/screens/ProductDetailsScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
