
import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { X, CheckCircle2, AlertTriangle, Map, TrendingUp, User, BookOpen } from 'lucide-react-native';

interface QuickStartGuideProps {
  onClose: () => void;
}

export default function QuickStartGuide({ onClose }: QuickStartGuideProps) {
  const features = [
    { icon: AlertTriangle, title: 'Alerts', description: 'Monitor real-time epidemic alerts.' },
    { icon: Map, title: 'Global Map', description: 'Interactive map of outbreaks.' },
    { icon: TrendingUp, title: 'Trends', description: 'Track disease patterns.' },
    { icon: User, title: 'Profile', description: 'Manage your settings.' },
  ];

  return (
    <Modal transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Card style={styles.card}>
          <ScrollView>
            <CardHeader>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={16} color="#94a3b8" />
              </TouchableOpacity>
              <View style={styles.headerContent}>
                <CheckCircle2 size={40} color="#3b82f6" />
                <CardTitle style={styles.title}>Welcome to Sentinel AI</CardTitle>
                <Text style={styles.subtitle}>Your Epidemic Intelligence Dashboard</Text>
              </View>
            </CardHeader>
            <CardContent>
              <Text style={styles.sectionTitle}>Key Features</Text>
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <View key={index} style={styles.featureRow}>
                    <View style={styles.featureIconContainer}>
                      <Icon size={20} color="white" />
                    </View>
                    <View style={styles.featureTextContainer}>
                      <Text style={styles.featureTitle}>{feature.title}</Text>
                      <Text style={styles.featureDescription}>{feature.description}</Text>
                    </View>
                  </View>
                );
              })}
              <View style={styles.tipsContainer}>
                <BookOpen size={16} color="#60a5fa" style={{marginRight: 8}}/>
                <Text style={styles.tipsTitle}>Quick Tips</Text>
              </View>
              <Text style={styles.tip}>• Tap any alert to see details.</Text>
              <Text style={styles.tip}>• Use the bottom tabs to navigate.</Text>
              <Button onPress={onClose} style={styles.getStartedButton}>
                <Text style={styles.getStartedButtonText}>Get Started</Text>
              </Button>
            </CardContent>
          </ScrollView>
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  card: {
    width: '90%',
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
  },
  headerContent: {
    alignItems: 'center',
    paddingTop: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#cbd5e1',
    marginBottom: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  featureDescription: {
    fontSize: 12,
    color: '#94a3b8',
  },
  tipsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#60a5fa',
  },
  tip: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
  getStartedButton: {
    marginTop: 24,
  },
  getStartedButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
