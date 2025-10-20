
import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';

interface SeparatorProps extends ViewProps {
  orientation?: 'horizontal' | 'vertical';
}

const Separator = React.forwardRef<View, SeparatorProps>(({ orientation = 'horizontal', style, ...props }, ref) => {
  const separatorStyle = orientation === 'horizontal' ? styles.horizontal : styles.vertical;
  return <View ref={ref} style={[separatorStyle, style]} {...props} />;
});
Separator.displayName = 'Separator';

const styles = StyleSheet.create({
  horizontal: {
    height: 1,
    width: '100%',
    backgroundColor: '#334155',
  },
  vertical: {
    width: 1,
    height: '100%',
    backgroundColor: '#334155',
  },
});

export { Separator };
