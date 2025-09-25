import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { useThemeColor } from '@/hooks/use-theme-color';
import { BorderRadius, Spacing, Shadows, Colors } from '@/constants/theme';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface AnimatedTabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (tabId: string) => void;
  style?: ViewStyle;
  variant?: 'default' | 'pill' | 'underline';
  size?: 'small' | 'medium' | 'large';
}

export function AnimatedTabBar({
  tabs,
  activeTab,
  onTabPress,
  style,
  variant = 'default',
  size = 'medium',
}: AnimatedTabBarProps) {
  const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
  const indicatorPosition = useSharedValue(activeIndex);
  const backgroundColor = useThemeColor({}, 'backgroundElevated');
  const borderColor = useThemeColor({}, 'border');

  const handleTabPress = (tabId: string, index: number) => {
    indicatorPosition.value = withSpring(index, {
      damping: 20,
      stiffness: 300,
    });
    onTabPress(tabId);
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: Spacing.xs,
          paddingHorizontal: Spacing.sm,
          fontSize: 12,
        };
      case 'large':
        return {
          paddingVertical: Spacing.md,
          paddingHorizontal: Spacing.lg,
          fontSize: 16,
        };
      default:
        return {
          paddingVertical: Spacing.sm,
          paddingHorizontal: Spacing.md,
          fontSize: 14,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const indicatorStyle = useAnimatedStyle(() => {
    const tabWidth = 100 / tabs.length; // Percentage width
    const translateX = interpolateColor(
      indicatorPosition.value,
      [0, tabs.length - 1],
      [0, (tabs.length - 1) * tabWidth]
    );

    return {
      transform: [{ translateX: `${indicatorPosition.value * tabWidth}%` }],
      width: `${tabWidth}%`,
    };
  });

  const getTabBarStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      backgroundColor,
      borderRadius: BorderRadius.lg,
      ...Shadows.sm,
    };

    switch (variant) {
      case 'pill':
        return {
          ...baseStyle,
          borderRadius: BorderRadius.full,
          padding: Spacing.xs,
        };
      case 'underline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderBottomWidth: 2,
          borderBottomColor: borderColor,
          borderRadius: 0,
          shadowOpacity: 0,
          elevation: 0,
        };
      default:
        return {
          ...baseStyle,
          padding: Spacing.xs,
        };
    }
  };

  const getIndicatorStyle = (): ViewStyle => {
    switch (variant) {
      case 'pill':
        return {
          position: 'absolute',
          height: '80%',
          top: '10%',
          borderRadius: BorderRadius.full,
          backgroundColor: Colors.light.primary,
        };
      case 'underline':
        return {
          position: 'absolute',
          bottom: 0,
          height: 2,
          backgroundColor: Colors.light.primary,
        };
      default:
        return {
          position: 'absolute',
          height: '100%',
          borderRadius: BorderRadius.md,
          backgroundColor: Colors.light.primary + '20',
        };
    }
  };

  return (
    <Animated.View style={[getTabBarStyle(), style]}>
      {variant !== 'underline' && (
        <Animated.View style={[getIndicatorStyle(), indicatorStyle]} />
      )}
      
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab;
        
        return (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              {
                paddingVertical: sizeStyles.paddingVertical,
                paddingHorizontal: sizeStyles.paddingHorizontal,
              },
            ]}
            onPress={() => handleTabPress(tab.id, index)}
            activeOpacity={0.7}
          >
            {tab.icon && (
              <Animated.View style={styles.iconContainer}>
                {tab.icon}
              </Animated.View>
            )}
            <Animated.Text
              style={[
                styles.tabLabel,
                {
                  fontSize: sizeStyles.fontSize,
                  color: isActive ? Colors.light.primary : Colors.light.textSecondary,
                  fontWeight: isActive ? '600' : '400',
                },
              ]}
            >
              {tab.label}
            </Animated.Text>
          </TouchableOpacity>
        );
      })}
      
      {variant === 'underline' && (
        <Animated.View style={[getIndicatorStyle(), indicatorStyle]} />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
  },
  tabLabel: {
    textAlign: 'center',
  },
  iconContainer: {
    marginRight: Spacing.xs,
  },
});
