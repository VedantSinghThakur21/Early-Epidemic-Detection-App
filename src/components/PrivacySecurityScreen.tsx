
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { ArrowLeft, Shield, Lock, Key, Fingerprint, Eye, CheckCircle2, Clock } from 'lucide-react-native';

interface PrivacySecurityScreenProps {
  onBack: () => void;
}

export default function PrivacySecurityScreen({ onBack }: PrivacySecurityScreenProps) {
  const [biometricAuth, setBiometricAuth] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);

  const securityLogs = [
    { action: 'Login', location: 'Mumbai, India', time: '2 hours ago' },
    { action: 'Data Export', location: 'Mumbai, India', time: '1 day ago' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
        <Badge variant="outline" style={styles.secureBadge}>
          <CheckCircle2 size={12} color="#34d399" />
          <Text style={styles.secureBadgeText}>Secure</Text>
        </Badge>
      </View>

      <ScrollView style={styles.contentContainer}>
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.settingRow}>
              <Label>Biometric Login</Label>
              <Switch value={biometricAuth} onValueChange={setBiometricAuth} />
            </View>
            <Separator style={styles.separator} />
            <View style={styles.settingRow}>
              <Label>Two-Factor Authentication</Label>
              <Switch value={twoFactorAuth} onValueChange={setTwoFactorAuth} />
            </View>
            <Separator style={styles.separator} />
            <Button variant="outline" style={{ marginTop: 16 }}>
              <Key size={16} color="#94a3b8" style={{ marginRight: 8 }} />
              Change Password
            </Button>
          </CardContent>
        </Card>

        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {securityLogs.map((log, index) => (
              <View key={index} style={styles.logItem}>
                <View>
                  <Text style={styles.logAction}>{log.action}</Text>
                  <Text style={styles.logDetails}>{log.location} • {log.time}</Text>
                </View>
                <CheckCircle2 size={16} color="#34d399" />
              </View>
            ))}
          </CardContent>
        </Card>

        <Card style={styles.card}>
          <CardContent>
            <Text style={styles.complianceText}>This app complies with HIPAA, GDPR, and local health data regulations.</Text>
            <View style={styles.complianceBadges}>
              <Badge variant="outline">HIPAA Compliant</Badge>
              <Badge variant="outline">GDPR</Badge>
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    backgroundColor: '#1a202c',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#34d399',
  },
  secureBadgeText: {
    color: '#34d399',
    marginLeft: 4,
    fontSize: 12,
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  separator: {
    marginVertical: 8,
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  logAction: {
    color: 'white',
    fontSize: 14,
  },
  logDetails: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
  },
  complianceText: {
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 12,
  },
  complianceBadges: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
});
