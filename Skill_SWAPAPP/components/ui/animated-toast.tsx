import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Colors, Gradients, Shadows, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface AnimatedToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onDismiss?: () => void;
  style?: ViewStyle;
  showIcon?: boolean;
  hapticFeedback?: boolean;
}

export function AnimatedToast({
  message,
  type = 'info',
  duration = 3000,
  onDismiss,
  style,
  showIcon = true,
  hapticFeedback = true,
}: AnimatedToastProps) {
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const backgroundColor = useThemeColor({}, 'backgroundElevated');

  useEffect(() => {
    // Show animation
    translateY.value = withSpring(0, {
      damping: 15,
      stiffness: 150,
    });
    opacity.value = withTiming(1, { duration: 300 });
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });

    // Haptic feedback
    if (hapticFeedback) {
      const hapticType = {
        success: Haptics.NotificationFeedbackType.Success,
        error: Haptics.NotificationFeedbackType.Error,
        warning: Haptics.NotificationFeedbackType.Warning,
        info: Haptics.ImpactFeedbackStyle.Light,
      }[type];

      if (type === 'info') {
        Haptics.impactAsync(hapticType as any);
      } else {
        Haptics.notificationAsync(hapticType as any);
      }
    }

    // Auto dismiss
    const timer = setTimeout(() => {
      dismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    translateY.value = withTiming(-100, { duration: 300 });
    opacity.value = withTiming(0, { duration: 300 });
    scale.value = withTiming(0.8, { duration: 300 }, () => {
      if (onDismiss) {
        runOnJS(onDismiss)();
      }
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          gradient: Gradients.success,
          icon: '✅',
          color: Colors.light.success,
        };
      case 'error':
        return {
          gradient: Gradients.error,
          icon: '❌',
          color: Colors.light.error,
        };
      case 'warning':
        return {
          gradient: Gradients.warning,
          icon: '⚠️',
          color: Colors.light.warning,
        };
      default:
        return {
          gradient: Gradients.info,
          icon: 'ℹ️',
          color: Colors.light.info,
        };
    }
  };

  const config = getToastConfig();

  return (
    <Animated.View style={[styles.container, animatedStyle, style]}>
      <View style={[styles.toast, { backgroundColor }]}>
        <LinearGradient
          colors={config.gradient as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientBorder}
        />
        
        <View style={styles.content}>
          {showIcon && (
            <Animated.View style={styles.iconContainer}>
              <Animated.Text style={styles.icon}>{config.icon}</Animated.Text>
            </Animated.View>
          )}
          
          <ThemedText type="body" color="text" style={styles.message}>
            {message}
          </ThemedText>
        </View>
      </View>
    </Animated.View>
  );
}

// Toast Container for managing multiple toasts
export interface ToastContainerProps {
  toasts: {
    id: string;
    message: string;
    type?: ToastType;
    duration?: number;
  }[];
  onRemoveToast: (id: string) => void;
  style?: ViewStyle;
}

export function ToastContainer({
  toasts,
  onRemoveToast,
  style,
}: ToastContainerProps) {
  return (
    <View style={[styles.toastContainer, style]}>
      {toasts.map((toast, index) => (
        <View
          key={toast.id}
          style={[
            styles.toastItem,
            { top: index * 70 }, // Stack toasts vertically
          ]}
        >
          <AnimatedToast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onDismiss={() => onRemoveToast(toast.id)}
          />
        </View>
      ))}
    </View>
  );
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = React.useState<{
    id: string;
    message: string;
    type?: ToastType;
    duration?: number;
  }[]>([]);

  const showToast = (
    message: string,
    type: ToastType = 'info',
    duration: number = 3000
  ) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  return {
    toasts,
    showToast,
    removeToast,
    clearAllToasts,
  };
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: 1000,
  },
  toast: {
    borderRadius: BorderRadius.lg,
    ...Shadows.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  gradientBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  iconContainer: {
    marginRight: Spacing.md,
  },
  icon: {
    fontSize: 20,
  },
  message: {
    flex: 1,
    lineHeight: 22,
  },
  toastContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'box-none',
    zIndex: 1000,
  },
  toastItem: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
  },
});
