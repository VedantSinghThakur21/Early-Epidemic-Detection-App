
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Filter, Clock, MapPin, AlertTriangle } from 'lucide-react-native';

interface AlertItem {
  id: number;
  title: string;
  description: string;
  severity: string;
  time: string;
  location: string;
}

interface AlertsListProps {
  alerts: AlertItem[];
  onAlertClick?: (alertId: number) => void;
}

export default function AlertsList({ alerts, onAlertClick }: AlertsListProps) {
  const [filterSeverity, setFilterSeverity] = useState('all');

  const filteredAlerts = alerts.filter(alert => {
    return filterSeverity === 'all' || alert.severity === filterSeverity;
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle size={16} color="#f87171" />;
      case 'moderate':
        return <AlertTriangle size={16} color="#fbbf24" />;
      default:
        return <Clock size={16} color="#34d399" />;
    }
  };

  const getBadgeStyle = (severity: string) => {
    switch (severity) {
      case 'high':
        return styles.badgeHigh;
      case 'moderate':
        return styles.badgeModerate;
      default:
        return styles.badgeLow;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filterSeverity === 'all' && styles.activeFilterButton]}
          onPress={() => setFilterSeverity('all')}
        >
          <Text style={[styles.filterButtonText, filterSeverity === 'all' && styles.activeFilterButtonText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterSeverity === 'high' && styles.activeFilterButton]}
          onPress={() => setFilterSeverity('high')}
        >
          <Text style={[styles.filterButtonText, filterSeverity === 'high' && styles.activeFilterButtonText]}>Critical</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterSeverity === 'moderate' && styles.activeFilterButton]}
          onPress={() => setFilterSeverity('moderate')}
        >
          <Text style={[styles.filterButtonText, filterSeverity === 'moderate' && styles.activeFilterButtonText]}>Moderate</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list}>
        {filteredAlerts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Filter size={32} color="#64748b" />
            </View>
            <Text style={styles.emptyText}>No alerts match your criteria</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filter settings</Text>
          </View>
        ) : (
          filteredAlerts.map(alert => (
            <View key={alert.id} style={styles.alertItem}>
              <View style={styles.alertHeader}>
                <View style={styles.alertTitleContainer}>
                  <View style={[styles.severityIconContainer, getBadgeStyle(alert.severity)]}>
                    {getSeverityIcon(alert.severity)}
                  </View>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                </View>
                <Text style={[styles.badge, getBadgeStyle(alert.severity)]}>{alert.severity}</Text>
              </View>
              <Text style={styles.alertDescription}>{alert.description}</Text>
              <View style={styles.alertFooter}>
                <View style={styles.footerInfo}>
                  <MapPin size={12} color="#94a3b8" />
                  <Text style={styles.footerText}>{alert.location}</Text>
                </View>
                <View style={styles.footerInfo}>
                  <Clock size={12} color="#94a3b8" />
                  <Text style={styles.footerText}>{alert.time}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.investigateButton} onPress={() => onAlertClick?.(alert.id)}>
                <Text style={styles.investigateButtonText}>Investigate Alert</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  activeFilterButton: {
    backgroundColor: '#2563eb',
  },
  filterButtonText: {
    color: 'white',
  },
  activeFilterButtonText: {
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  alertItem: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  severityIconContainer: {
    padding: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  badge: {
    fontSize: 12,
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    textTransform: 'capitalize',
  },
  badgeHigh: {
    backgroundColor: '#ef4444',
  },
  badgeModerate: {
    backgroundColor: '#f97316',
  },
  badgeLow: {
    backgroundColor: '#10b981',
  },
  alertDescription: {
    color: '#94a3b8',
    marginBottom: 12,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    color: '#94a3b8',
    marginLeft: 4,
  },
  investigateButton: {
    backgroundColor: '#334155',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  investigateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#94a3b8',
  },
  emptySubtext: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
});
