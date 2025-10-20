import { registerRootComponent } from 'expo';
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

function MinimalApp() {
  console.log('MinimalApp rendering...');
  console.log('Platform available:', typeof Platform);
  console.log('Platform.OS:', Platform.OS);
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>✅ React Native is Working!</Text>
      <Text style={styles.text}>Platform: {Platform.OS}</Text>
      <Text style={styles.text}>If you see this, the app works!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
});

console.log('About to register component...');
registerRootComponent(MinimalApp);
console.log('Component registered!');
