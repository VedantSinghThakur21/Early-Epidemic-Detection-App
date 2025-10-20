
import React from 'react';
import { View, Text, StyleSheet, ViewProps, TextProps } from 'react-native';

interface BadgeProps extends ViewProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  style?: ViewProps['style'];
  textStyle?: TextProps['style'];
  children?: React.ReactNode;
}

const Badge = React.forwardRef<View, BadgeProps>(
  ({ variant = 'default', style, textStyle, children, ...props }, ref) => {
    const containerStyle = [
      styles.baseContainer,
      styles[`variant_${variant}`],
      style,
    ];

    const content =
      typeof children === 'string' ? (
        <Text style={[styles.baseText, styles[`text_${variant}`], textStyle]}>
          {children}
        </Text>
      ) : (
        children
      );

    return (
      <View ref={ref} style={containerStyle} {...props}>
        {content}
      </View>
    );
  }
);
Badge.displayName = 'Badge';

const styles = StyleSheet.create({
  baseContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
  },
  baseText: {
    fontSize: 12,
    fontWeight: '500',
  },
  variant_default: {
    backgroundColor: '#2563eb',
    borderColor: 'transparent',
  },
  text_default: {
    color: 'white',
  },
  variant_secondary: {
    backgroundColor: '#334155',
    borderColor: 'transparent',
  },
  text_secondary: {
    color: 'white',
  },
  variant_destructive: {
    backgroundColor: '#ef4444',
    borderColor: 'transparent',
  },
  text_destructive: {
    color: 'white',
  },
  variant_outline: {
    borderColor: '#334155',
    backgroundColor: 'transparent',
  },
  text_outline: {
    color: '#cbd5e1',
  },
});

export { Badge };
