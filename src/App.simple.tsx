import React from 'react';
import { View, Text, StyleSheet, Platform, SafeAreaView, StatusBar } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Text style={styles.title}>✅ React Native Working!</Text>
        <Text style={styles.subtitle}>Platform: {Platform.OS}</Text>
        <Text style={styles.text}>React Native Version: 0.81.4</Text>
        <Text style={styles.text}>This proves the basic app works!</Text>
        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>⚠️ Issue Found:</Text>
          <Text style={styles.warningText}>
            Your UI components (Card, Button, Badge) are importing web-only @radix-ui packages that don't work in React Native.
          </Text>
          <Text style={styles.warningText}>
            They need to be rewritten for React Native using TouchableOpacity, View, and Text.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#10b981',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  warningBox: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#856404',
  },
  warningText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#856404',
    lineHeight: 20,
  },
});
