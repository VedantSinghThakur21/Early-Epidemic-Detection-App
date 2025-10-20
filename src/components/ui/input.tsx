
import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

const Input = React.forwardRef<TextInput, TextInputProps>(({ style, ...props }, ref) => {
  return (
    <TextInput
      ref={ref}
      style={[styles.input, style]}
      placeholderTextColor="#64748b"
      {...props}
    />
  );
});
Input.displayName = 'Input';

const styles = StyleSheet.create({
  input: {
    height: 40,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: 'white',
    fontSize: 14,
  },
});

export { Input };
