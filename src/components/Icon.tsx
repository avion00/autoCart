// ============================================
// AutoCart - Icon Component
// ============================================

import React from 'react';
import FeatherIcon from 'react-native-vector-icons/Feather';

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  color = '#000000',
  style 
}) => {
  return (
    <FeatherIcon 
      name={name} 
      size={size} 
      color={color} 
      style={style}
    />
  );
};

export default Icon;
