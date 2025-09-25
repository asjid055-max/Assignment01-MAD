import * as Haptics from 'expo-haptics';
import React, { useRef, useState } from 'react';
import { StyleProp, StyleSheet, TextInput, TextStyle, View, ViewStyle } from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface AnimatedInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  hapticFeedback?: boolean;
  editable?: boolean;
}

export function AnimatedInput({
  placeholder,
  value,
  onChangeText,
  label,
  error,
  multiline = false,
  numberOfLines = 1,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  style,
  inputStyle,
  disabled = false,
  hapticFeedback = true,
  editable,
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  
  const borderScale = useSharedValue(1);
  const borderOpacity = useSharedValue(0);

  const backgroundColor = useThemeColor({}, 'inputBackground');
  const borderColor = useThemeColor({}, 'inputBorder');
  const focusBorderColor = useThemeColor({}, 'inputBorderFocus');
  const placeholderColor = useThemeColor({}, 'inputPlaceholder');

  const animatedBorderStyle = useAnimatedStyle(() => {
    const borderColorAnimated = interpolateColor(
      borderOpacity.value,
      [0, 1],
      [borderColor, focusBorderColor]
    );

    return {
      borderWidth: 2,
      borderColor: borderColorAnimated,
      transform: [{ scale: borderScale.value }],
    };
  });

  const handleFocus = () => {
    setIsFocused(true);
    borderScale.value = withSpring(1.02, { damping: 15, stiffness: 150 });
    borderOpacity.value = withTiming(1, { duration: 200 });
    
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    borderScale.value = withSpring(1, { damping: 15, stiffness: 150 });
    borderOpacity.value = withTiming(0, { duration: 200 });
  };

  const handleChangeText = (text: string) => {
    onChangeText(text);
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <ThemedText type="label" style={styles.label}>
          {label}
        </ThemedText>
      )}
      
      <Animated.View style={[styles.inputContainer, animatedBorderStyle]}>
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            {
              backgroundColor,
              color: useThemeColor({}, 'text'),
              minHeight: multiline ? 80 : 48,
            },
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline={multiline}
          numberOfLines={numberOfLines}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable ?? !disabled}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
      </Animated.View>
      
      {error && (
        <ThemedText type="caption" color="error" style={styles.error}>
          {error}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  input: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  error: {
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});
