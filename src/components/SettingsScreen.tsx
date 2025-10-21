
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Alert, Platform } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { ArrowLeft, Download, Trash2, RefreshCw } from 'lucide-react-native';

interface SettingsScreenProps {
  onBack: () => void;
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  const handleExportData = async () => {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        user: 'Dr. Kavita Desai',
      };
      const result = await Share.share({
        message: JSON.stringify(exportData, null, 2),
        title: 'Export Sentinel Data',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const handleSyncNow = () => {
    Alert.alert('Syncing...', 'Data synchronization in progress.', [
      { text: 'OK', onPress: () => Alert.alert('Success', 'Data synchronized successfully!') }
    ]);
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear all cached data? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => Alert.alert('Success', 'Cache cleared successfully!') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.contentContainer}>
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Switch value={pushNotifications} onValueChange={setPushNotifications} />
            </View>
            <Separator style={styles.separator} />
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Email Alerts</Text>
              <Switch value={emailAlerts} onValueChange={setEmailAlerts} />
            </View>
          </CardContent>
        </Card>

        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Switch value={darkMode} onValueChange={setDarkMode} />
            </View>
          </CardContent>
        </Card>

        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>Data & Sync</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Auto Sync</Text>
              <Switch value={autoSync} onValueChange={setAutoSync} />
            </View>
            <Separator style={styles.separator} />
            <TouchableOpacity style={styles.syncButton} onPress={handleSyncNow}>
              <RefreshCw size={16} color="#94a3b8" style={{ marginRight: 8 }} />
              <Text style={styles.syncButtonText}>Sync Now</Text>
            </TouchableOpacity>
          </CardContent>
        </Card>

        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <TouchableOpacity style={styles.exportButton} onPress={handleExportData}>
              <Download size={16} color="#94a3b8" style={{ marginRight: 8 }} />
              <Text style={styles.exportButtonText}>Export Data</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.clearButton} onPress={handleClearCache}>
              <Trash2 size={16} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.clearButtonText}>Clear Cache</Text>
            </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    backgroundColor: '#1a202c',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
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
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#cbd5e1',
  },
  separator: {
    marginVertical: 8,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  syncButtonText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  exportButtonText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});
