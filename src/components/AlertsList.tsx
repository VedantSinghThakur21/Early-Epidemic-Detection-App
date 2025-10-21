
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { Filter, Clock, MapPin, AlertTriangle } from 'lucide-react-native';
import { useAlerts } from '../hooks/useEpiWatch';
import { Alert } from '../types/epiwatch.types';

interface AlertsListProps {
  alerts?: Alert[]; // Made optional for backwards compatibility
  onAlertClick?: (alertId: string) => void; // Changed from number to string
}

// Extended Alert type for UI display
interface DisplayAlert extends Alert {
  title: string;
  description: string;
  time: string;
  severityLevel: 'critical' | 'high' | 'moderate' | 'low'; // For UI display
}

export default function AlertsList({ alerts: propAlerts, onAlertClick }: AlertsListProps) {
  // Fetch real-time alerts from API
  const { data: apiAlerts, loading, error, refetch, updateFilters } = useAlerts({ limit: 20 });
  
  // Transform API alerts to add UI-friendly properties
  const transformedAlerts: DisplayAlert[] = (apiAlerts || []).map(alert => ({
    ...alert,
    title: `${alert.disease}`,
    description: alert.context_description || alert.message,
    time: new Date(alert.timestamp).toLocaleString(),
    // Keep severity_level for UI filtering
    severityLevel: alert.severity_level,
  }));
  
  // Use prop alerts if provided (for backwards compatibility), otherwise use transformed API data
  const alerts: DisplayAlert[] = propAlerts 
    ? (propAlerts as unknown as DisplayAlert[]) 
    : transformedAlerts;
  
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'high' | 'moderate' | 'low'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleFilterChange = (severity: 'all' | 'critical' | 'high' | 'moderate' | 'low') => {
    setFilterSeverity(severity);
    if (severity !== 'all') {
      // API expects 'medium' for filtering, but returns 'moderate' in responses
      const apiSeverity = severity === 'moderate' ? 'medium' : severity;
      updateFilters({ limit: 20, severity: apiSeverity as any });
    } else {
      updateFilters({ limit: 20 });
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filterSeverity === 'all') return true;
    // API returns 'moderate' in responses, but we filter with 'moderate' too
    return alert.severityLevel === filterSeverity;
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
      {/* Loading State */}
      {loading && alerts.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>
            Loading epidemic alerts...
          </Text>
        </View>
      )}

      {/* Error State */}
      {error && alerts.length === 0 && (
        <View style={styles.errorContainer}>
          <AlertTriangle size={48} color="#ef4444" />
          <Text style={styles.errorText}>Connection Issue</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          {error.includes('waking up') && (
            <Text style={styles.errorHint}>
              💡 First load takes 30-60 seconds{'\n'}
              Please be patient...
            </Text>
          )}
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {alerts.length > 0 && (
        <>
      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Text style={styles.infoBannerText}>
          📊 Showing {alerts.length} active anomaly alerts
        </Text>
        <Text style={styles.infoBannerSubtext}>
          Alerts are generated when disease cases significantly exceed expected levels
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filterSeverity === 'all' && styles.activeFilterButton]}
          onPress={() => handleFilterChange('all')}
        >
          <Text style={[styles.filterButtonText, filterSeverity === 'all' && styles.activeFilterButtonText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterSeverity === 'critical' && styles.activeFilterButton]}
          onPress={() => handleFilterChange('critical')}
        >
          <Text style={[styles.filterButtonText, filterSeverity === 'critical' && styles.activeFilterButtonText]}>Critical</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterSeverity === 'high' && styles.activeFilterButton]}
          onPress={() => handleFilterChange('high')}
        >
          <Text style={[styles.filterButtonText, filterSeverity === 'high' && styles.activeFilterButtonText]}>High</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterSeverity === 'moderate' && styles.activeFilterButton]}
          onPress={() => handleFilterChange('moderate')}
        >
          <Text style={[styles.filterButtonText, filterSeverity === 'moderate' && styles.activeFilterButtonText]}>Moderate</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
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
                  <View style={[styles.severityIconContainer, getBadgeStyle(alert.severityLevel)]}>
                    {getSeverityIcon(alert.severityLevel)}
                  </View>
                  <Text style={styles.alertTitle} numberOfLines={2}>{alert.title}</Text>
                </View>
                <Text style={[styles.badge, getBadgeStyle(alert.severityLevel)]}>{alert.severityLevel}</Text>
              </View>
              
              {/* Severity Score */}
              <View style={styles.severityScoreContainer}>
                <Text style={styles.severityScoreLabel}>Severity Score:</Text>
                <Text style={styles.severityScoreValue}>{alert.severity.toFixed(1)}/100</Text>
              </View>
              
              {/* Case Statistics */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Actual Cases</Text>
                  <Text style={styles.statValue}>{alert.actual_count}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Expected</Text>
                  <Text style={styles.statValue}>{alert.expected_count}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Deviation</Text>
                  <Text style={[styles.statValue, styles.deviationValue]}>
                    +{alert.deviation_pct.toFixed(0)}%
                  </Text>
                </View>
              </View>
              
              <Text style={styles.alertDescription}>{alert.description}</Text>
              
              <View style={styles.alertFooter}>
                <View style={styles.footerInfo}>
                  <MapPin size={12} color="#94a3b8" />
                  <Text style={styles.footerText}>{alert.city_location}</Text>
                </View>
                <View style={styles.footerInfo}>
                  <Clock size={12} color="#94a3b8" />
                  <Text style={styles.footerText}>{new Date(alert.date).toLocaleDateString()}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.investigateButton} onPress={() => onAlertClick?.(alert.id)}>
                <Text style={styles.investigateButtonText}>Investigate Alert</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
      </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    color: '#94a3b8',
    textAlign: 'center',
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    color: '#ef4444',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorMessage: {
    marginTop: 8,
    color: '#94a3b8',
    textAlign: 'center',
    fontSize: 14,
  },
  errorHint: {
    marginTop: 12,
    color: '#60a5fa',
    textAlign: 'center',
    fontSize: 13,
    fontStyle: 'italic',
    paddingHorizontal: 20,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
  infoBanner: {
    backgroundColor: '#1e3a5f',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  infoBannerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e0e7ff',
    marginBottom: 4,
  },
  infoBannerSubtext: {
    fontSize: 12,
    color: '#94a3b8',
  },
  severityScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  severityScoreLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginRight: 8,
  },
  severityScoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 6,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e2e8f0',
  },
  deviationValue: {
    color: '#ef4444',
  },
});
