import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors, BorderRadius, Spacing, Shadows, Gradients } from '@/constants/theme';

export interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  gradient?: keyof typeof Gradients;
  style?: ViewStyle;
  disabled?: boolean;
  hapticFeedback?: boolean;
}

export function FloatingActionButton({
  onPress,
  icon,
  size = 'medium',
  position = 'bottom-right',
  variant = 'primary',
  gradient,
  style,
  disabled = false,
  hapticFeedback = true,
}: FloatingActionButtonProps) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const backgroundColor = useThemeColor({}, 'primary');

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          width: 48,
          height: 48,
          borderRadius: 24,
          iconSize: 20,
        };
      case 'large':
        return {
          width: 72,
          height: 72,
          borderRadius: 36,
          iconSize: 28,
        };
      default:
        return {
          width: 56,
          height: 56,
          borderRadius: 28,
          iconSize: 24,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const getPositionStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      position: 'absolute',
    };

    switch (position) {
      case 'bottom-left':
        return { ...baseStyle, bottom: Spacing.xl, left: Spacing.xl };
      case 'top-right':
        return { ...baseStyle, top: Spacing.xl, right: Spacing.xl };
      case 'top-left':
        return { ...baseStyle, top: Spacing.xl, left: Spacing.xl };
      default:
        return { ...baseStyle, bottom: Spacing.xl, right: Spacing.xl };
    }
  };

  const getVariantConfig = () => {
    switch (variant) {
      case 'secondary':
        return {
          gradient: Gradients.secondary,
          backgroundColor: Colors.light.secondary,
        };
      case 'success':
        return {
          gradient: Gradients.success,
          backgroundColor: Colors.light.success,
        };
      case 'warning':
        return {
          gradient: Gradients.warning,
          backgroundColor: Colors.light.warning,
        };
      case 'error':
        return {
          gradient: Gradients.error,
          backgroundColor: Colors.light.error,
        };
      default:
        return {
          // If a gradient key is provided, resolve it to the actual color array
          gradient: gradient ? Gradients[gradient] : Gradients.primary,
          backgroundColor,
        };
    }
  };

  const variantConfig = getVariantConfig();

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 150 });
    rotation.value = withTiming(5, { duration: 100 });
    
    if (hapticFeedback && !disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    rotation.value = withTiming(0, { duration: 100 });
  };

  const handlePress = () => {
    if (!disabled) {
      // Success animation
      scale.value = withSequence(
        withTiming(1.1, { duration: 100 }),
        withSpring(1, { damping: 15, stiffness: 150 })
      );
      
      rotation.value = withSequence(
        withTiming(-5, { duration: 100 }),
        withTiming(5, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );

      if (hapticFeedback) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      onPress();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: disabled ? 0.6 : 1,
  }));

  return (
    <Animated.View
      style={[
        getPositionStyles(),
        animatedStyle,
        style,
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
        style={[
          styles.fab,
          sizeStyles,
          { backgroundColor: variantConfig.backgroundColor },
        ]}
      >
        <LinearGradient
          colors={variantConfig.gradient as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradient,
            sizeStyles,
          ]}
        >
          {icon}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// Multi-action FAB
export interface MultiActionFABProps {
  mainIcon: React.ReactNode;
  actions: {
    icon: React.ReactNode;
    label?: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  }[];
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  style?: ViewStyle;
}

export function MultiActionFAB({
  mainIcon,
  actions,
  position = 'bottom-right',
  style,
}: MultiActionFABProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  const handleMainPress = () => {
    setIsExpanded(!isExpanded);
    rotation.value = withSpring(isExpanded ? 0 : 45, {
      damping: 15,
      stiffness: 150,
    });
    scale.value = withSpring(isExpanded ? 1 : 1.1, {
      damping: 15,
      stiffness: 150,
    });
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleActionPress = (action: any) => {
    setIsExpanded(false);
    rotation.value = withSpring(0, {
      damping: 15,
      stiffness: 150,
    });
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    action.onPress();
  };

  const mainAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  const getPositionStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      position: 'absolute',
    };

    switch (position) {
      case 'bottom-left':
        return { ...baseStyle, bottom: Spacing.xl, left: Spacing.xl };
      case 'top-right':
        return { ...baseStyle, top: Spacing.xl, right: Spacing.xl };
      case 'top-left':
        return { ...baseStyle, top: Spacing.xl, left: Spacing.xl };
      default:
        return { ...baseStyle, bottom: Spacing.xl, right: Spacing.xl };
    }
  };

  return (
    <View style={[getPositionStyles(), style]}>
      {/* Action buttons */}
      {isExpanded && (
        <View style={styles.actionsContainer}>
          {actions.map((action, index) => (
            <Animated.View
              key={index}
              style={[
                styles.actionButton,
                {
                  marginBottom: (index + 1) * 60,
                },
              ]}
            >
              <FloatingActionButton
                onPress={() => handleActionPress(action)}
                icon={action.icon}
                size="small"
                variant={action.variant || 'primary'}
                style={styles.actionButton}
              />
            </Animated.View>
          ))}
        </View>
      )}

      {/* Main FAB */}
      <Animated.View style={mainAnimatedStyle}>
        <FloatingActionButton
          onPress={handleMainPress}
          icon={mainIcon}
          size="medium"
          variant="primary"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    ...Shadows.lg,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    alignItems: 'center',
  },
  actionButton: {
    marginBottom: Spacing.md,
  },
});
