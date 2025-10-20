
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewProps, TextProps, TouchableOpacityProps } from 'react-native';

// Define the props for the button
interface ButtonProps extends TouchableOpacityProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  style?: ViewProps['style'];
  textStyle?: TextProps['style'];
  children?: React.ReactNode;
}

// Create the Button component with forwardRef
const Button = React.forwardRef<TouchableOpacity, ButtonProps>(
  ({ variant = 'default', size = 'default', style, textStyle, children, ...props }, ref) => {

    // Conditionally apply styles based on props
    const containerStyle = [
      styles.baseContainer,
      styles[`variant_${variant}`],
      styles[`size_${size}`],
      style,
    ];

    const content =
      typeof children === 'string' ? (
        <Text style={[styles.baseText, styles[`text_${variant}`], styles[`text_size_${size}`], textStyle]}>
          {children}
        </Text>
      ) : (
        children
      );

    return (
      <TouchableOpacity ref={ref} style={containerStyle} {...props}>
        {content}
      </TouchableOpacity>
    );
  }
);
Button.displayName = 'Button';

// Define all styles in a single StyleSheet
const styles = StyleSheet.create({
  // Base styles
  baseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  baseText: {
    fontWeight: '500',
    textAlign: 'center',
  },

  // Variant container styles
  variant_default: { backgroundColor: '#2563eb' },
  variant_destructive: { backgroundColor: '#ef4444' },
  variant_outline: { borderWidth: 1, borderColor: '#334155' },
  variant_secondary: { backgroundColor: '#334155' },
  variant_ghost: { backgroundColor: 'transparent' },
  variant_link: { backgroundColor: 'transparent' },

  // Variant text styles
  text_default: { color: 'white' },
  text_destructive: { color: 'white' },
  text_outline: { color: '#cbd5e1' },
  text_secondary: { color: 'white' },
  text_ghost: { color: '#cbd5e1' },
  text_link: { color: '#60a5fa', textDecorationLine: 'underline' },

  // Size container styles
  size_default: { height: 40, paddingHorizontal: 16 },
  size_sm: { height: 36, paddingHorizontal: 12, borderRadius: 6 },
  size_lg: { height: 48, paddingHorizontal: 24, borderRadius: 10 },
  size_icon: { height: 40, width: 40 },

  // Size text styles
  text_size_default: { fontSize: 14 },
  text_size_sm: { fontSize: 12 },
  text_size_lg: { fontSize: 16 },
  text_size_icon: {},
});

export { Button };
