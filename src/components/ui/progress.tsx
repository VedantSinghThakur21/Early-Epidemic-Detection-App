
import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';

interface ProgressProps extends ViewProps {
  value: number;
}

const Progress = React.forwardRef<View, ProgressProps>(({ value, style, ...props }, ref) => {
  return (
    <View ref={ref} style={[styles.background, style]} {...props}>
      <View style={[styles.indicator, { width: `${value}%` }]} />
    </View>
  );
});
Progress.displayName = 'Progress';

const styles = StyleSheet.create({
  background: {
    height: 8,
    width: '100%',
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  indicator: {
    height: '100%',
    backgroundColor: '#2563eb',
  },
});

export { Progress };
