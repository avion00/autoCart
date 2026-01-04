// ============================================
// AutoCart - Categories Stack Navigator
// ============================================

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CategoriesStackParamList } from './types';

import CategoriesScreen from '../features/categories/screens/CategoriesScreen';
import SubCategoriesScreen from '../features/categories/screens/SubCategoriesScreen';
import ProductListScreen from '../features/product/screens/ProductListScreen';
import ProductDetailsScreen from '../features/product/screens/ProductDetailsScreen';

const Stack = createNativeStackNavigator<CategoriesStackParamList>();

const CategoriesStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="CategoriesMain" component={CategoriesScreen} />
      <Stack.Screen name="SubCategories" component={SubCategoriesScreen} />
      <Stack.Screen name="CategoryProducts" component={ProductListScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    </Stack.Navigator>
  );
};

export default CategoriesStack;
