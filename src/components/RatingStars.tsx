// ============================================
// AutoCart - Rating Stars Component
// ============================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { Icon } from './Icon';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: number;
  showEmpty?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  size = 16,
  showEmpty = true,
}) => {
  const theme = useTheme();

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < maxRating; i++) {
      if (i < fullStars) {
        stars.push(
          <Icon key={i} name="star" size={size} color={theme.colors.ratingFilled} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Icon key={i} name="star" size={size} color={theme.colors.ratingFilled} />
        );
      } else if (showEmpty) {
        stars.push(
          <Icon key={i} name="star" size={size} color={theme.colors.ratingEmpty} />
        );
      }
    }

    return stars;
  };

  return <View style={styles.container}>{renderStars()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});

export default RatingStars;
