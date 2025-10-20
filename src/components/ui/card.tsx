
import React from 'react';
import { View, Text, StyleSheet, ViewProps, TextProps } from 'react-native';

const Card = React.forwardRef<View, ViewProps>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.card, style]} {...props} />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<View, ViewProps>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.cardHeader, style]} {...props} />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<Text, TextProps>(({ style, ...props }, ref) => (
  <Text ref={ref} style={[styles.cardTitle, style]} {...props} />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<Text, TextProps>(({ style, ...props }, ref) => (
  <Text ref={ref} style={[styles.cardDescription, style]} {...props} />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<View, ViewProps>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.cardContent, style]} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<View, ViewProps>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.cardFooter, style]} {...props} />
));
CardFooter.displayName = 'CardFooter';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  cardHeader: {
    padding: 24,
    paddingBottom: 0,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  cardDescription: {
    fontSize: 14,
    color: '#94a3b8',
  },
  cardContent: {
    padding: 24,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingTop: 0,
  },
});

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
