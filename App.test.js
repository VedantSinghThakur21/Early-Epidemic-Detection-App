import { registerRootComponent } from 'expo';
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

function TestApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello from React Native!</Text>
      <Text style={styles.text}>Platform: {Platform.OS}</Text>
      <Text style={styles.text}>If you see this, React Native works!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
    marginVertical: 10,
  },
});

registerRootComponent(TestApp);
