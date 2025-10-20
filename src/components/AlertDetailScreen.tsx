
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { ArrowLeft, Share2, MapPin, Clock, AlertTriangle, Activity, CheckCircle2, TrendingUp, Database, Users, Info } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';

interface AlertDetailScreenProps {
  alert: {
    id: number;
    title: string;
    description: string;
    severity: string;
    time: string;
    location: string;
  };
  onBack: () => void;
  onViewOnMap: () => void;
}

export default function AlertDetailScreen({ alert, onBack, onViewOnMap }: AlertDetailScreenProps) {
  const aiConfidence = 87;
  const sourcesValidated = 12;
  const totalSources = 15;

  const getSeverityConfig = (severity: string) => {
    const configs = {
      high: { color: '#f87171', backgroundColor: 'rgba(239, 68, 68, 0.2)' },
      moderate: { color: '#fbbf24', backgroundColor: 'rgba(251, 191, 36, 0.2)' },
      low: { color: '#34d399', backgroundColor: 'rgba(52, 211, 153, 0.2)' },
    };
    return configs[severity as keyof typeof configs] || configs.low;
  };

  const config = getSeverityConfig(alert.severity);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - aiConfidence / 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.headerButton}>
          <ArrowLeft size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alert Details</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Share2 size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={[styles.card, { borderLeftColor: config.color, borderLeftWidth: 4 }]}>
          <Text style={styles.alertTitle}>{alert.title}</Text>
          <Text style={styles.alertDescription}>{alert.description}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{alert.severity}</Text>
          </View>
          <View style={styles.infoRow}>
            <MapPin size={14} color="#94a3b8" />
            <Text style={styles.infoText}>{alert.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Clock size={14} color="#94a3b8" />
            <Text style={styles.infoText}>{alert.time}</Text>
          </View>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Svg width="80" height="80" viewBox="0 0 80 80">
              <Circle cx="40" cy="40" r={radius} stroke="#334155" strokeWidth="6" />
              <Circle
                cx="40"
                cy="40"
                r={radius}
                stroke="#3b82f6"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 40 40)"
              />
            </Svg>
            <Text style={styles.confidenceText}>{aiConfidence}%</Text>
            <Text style={styles.metricLabel}>AI Confidence</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Data Sources Validated</Text>
            <Text style={styles.progressText}>{sourcesValidated}/{totalSources}</Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${(sourcesValidated / totalSources) * 100}%` }]} />
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.mapButton} onPress={onViewOnMap}>
          <MapPin size={16} color="white" />
          <Text style={styles.mapButtonText}>View on Map</Text>
        </TouchableOpacity>

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
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    backgroundColor: '#1a202c',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  alertTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  alertDescription: {
    color: '#94a3b8',
    marginBottom: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    color: '#94a3b8',
    marginLeft: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  confidenceText: {
    position: 'absolute',
    top: 54,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  metricLabel: {
    color: '#94a3b8',
    marginTop: 8,
  },
  progressText: {
    color: '#3b82f6',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
  },
  mapButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
