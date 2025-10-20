
import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';

const Label = React.forwardRef<Text, TextProps>(({ style, ...props }, ref) => {
  return <Text ref={ref} style={[styles.label, style]} {...props} />;
});
Label.displayName = 'Label';

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#cbd5e1',
    marginBottom: 4,
  },
});

export { Label };
