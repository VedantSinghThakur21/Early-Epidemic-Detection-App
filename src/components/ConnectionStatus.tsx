import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { testConnection } from '../services/axiosConfig';

export const ConnectionStatus: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    responseTime?: number;
  } | null>(null);

  const handleTestConnection = async () => {
    setTesting(true);
    setResult(null);
    
    try {
      const testResult = await testConnection();
      setResult(testResult);
    } catch (error) {
      setResult({
        success: false,
        message: 'Connection test failed',
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleTestConnection}
        disabled={testing}
      >
        {testing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>🔍 Test API Connection</Text>
        )}
      </TouchableOpacity>

      {result && (
        <View style={[
          styles.result,
          result.success ? styles.resultSuccess : styles.resultError
        ]}>
          <Text style={styles.resultText}>
            {result.success ? '✅' : '❌'} {result.message}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#6366f1',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  result: {
    marginTop: 12,
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  resultSuccess: {
    backgroundColor: '#10b98120',
    borderColor: '#10b981',
  },
  resultError: {
    backgroundColor: '#ef444420',
    borderColor: '#ef4444',
  },
  resultText: {
    fontSize: 13,
    color: '#fff',
  },
});
