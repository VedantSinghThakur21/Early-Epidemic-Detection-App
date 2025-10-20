
import React from 'react';
import { Switch as RNSwitch, StyleSheet, SwitchProps } from 'react-native';

const Switch = React.forwardRef<RNSwitch, SwitchProps>(({ style, ...props }, ref) => {
  return (
    <RNSwitch
      ref={ref}
      trackColor={{ false: '#334155', true: '#2563eb' }}
      thumbColor={props.value ? '#f8fafc' : '#e2e8f0'}
      ios_backgroundColor="#334155"
      style={[styles.switch, style]}
      {...props}
    />
  );
});
Switch.displayName = 'Switch';

const styles = StyleSheet.create({
  switch: {
    // The Switch component has fixed size, but we can apply transforms
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
});

export { Switch };
