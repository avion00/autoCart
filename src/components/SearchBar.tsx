// ============================================
// AutoCart - Search Bar Component
// ============================================

import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useTheme } from '../theme';
import { Icon } from './Icon';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  showBackButton?: boolean;
  onBackPress?: () => void;
  showMicButton?: boolean;
  onMicPress?: () => void;
  showCameraButton?: boolean;
  onCameraPress?: () => void;
  editable?: boolean;
  onPress?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSubmit,
  onFocus,
  onBlur,
  onClear,
  placeholder = 'Search AutoCart',
  autoFocus = false,
  showBackButton = false,
  onBackPress,
  showMicButton = true,
  onMicPress,
  showCameraButton = true,
  onCameraPress,
  editable = true,
  onPress,
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.spring(scaleAnim, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    onBlur?.();
  };

  const handleClear = () => {
    onChangeText('');
    onClear?.();
    inputRef.current?.focus();
  };

  const Container = editable ? View : TouchableOpacity;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.searchBar,
          borderColor: isFocused
            ? theme.colors.inputBorderFocused
            : theme.colors.searchBarBorder,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {showBackButton ? (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onBackPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="arrow-left" size={22} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.searchIcon}>
          <Icon name="search" size={20} color={theme.colors.textTertiary} />
        </View>
      )}

      <Container
        style={styles.inputContainer}
        {...(!editable && { onPress, activeOpacity: 0.7 })}
      >
        <TextInput
          ref={inputRef}
          style={[styles.input, { color: theme.colors.textPrimary }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.inputPlaceholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={onSubmit}
          returnKeyType="search"
          autoFocus={autoFocus}
          autoCapitalize="none"
          autoCorrect={false}
          editable={editable}
          pointerEvents={editable ? 'auto' : 'none'}
        />
      </Container>

      {value.length > 0 && (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleClear}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="x" size={18} color={theme.colors.textTertiary} />
        </TouchableOpacity>
      )}

      {showMicButton && value.length === 0 && (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onMicPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="mic" size={20} color={theme.colors.textTertiary} />
        </TouchableOpacity>
      )}

      {showCameraButton && value.length === 0 && (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onCameraPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="camera" size={20} color={theme.colors.textTertiary} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 4,
  },
  searchIcon: {
    paddingHorizontal: 10,
  },
  inputContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  iconButton: {
    padding: 8,
  },
});

export default SearchBar;
