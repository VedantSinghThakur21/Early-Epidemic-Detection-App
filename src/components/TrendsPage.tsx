import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-gifted-charts';
import { TrendingUp, TrendingDown, Activity, MapPin, AlertTriangle } from 'lucide-react-native';
import { useDashboardStats, useMapData } from '../hooks/useEpiWatch';
import { Badge } from './ui/badge';

export default function TrendsPage() {
  const { data: stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useDashboardStats();
  const { data: mapData, loading: mapLoading, error: mapError, refetch: refetchMap } = useMapData();
  
  const [refreshing, setRefreshing] = React.useState(false);
  // Metrics shown in header cards: cases, critical alerts, active alerts
  const [selectedMetric, setSelectedMetric] = React.useState<'cases' | 'critical' | 'active'>('cases');

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchStats(), refetchMap()]);
    setRefreshing(false);
  };

  // Process stats data for line chart (simulated time series)
  const trendData = useMemo(() => {
    if (!stats) return [];
    
    // Simulate historical data points (in real app, you'd get this from API)
    const baseValue =
      selectedMetric === 'cases'
        ? (stats.total_cases || 0)
        : selectedMetric === 'critical'
          ? (stats.critical_alerts || 0)
          : (stats.active_alerts || 0);
    const points = 7; // Last 7 days
    
    return Array.from({ length: points }, (_, i) => {
      const dayOffset = points - i - 1;
      const variation = Math.random() * 0.3; // ±30% variation
      const value = Math.max(0, baseValue * (1 - variation * (dayOffset / points)));
      
      return {
        value: Math.round(value),
        label: i === 0 ? '7d' : i === points - 1 ? 'Now' : '',
        dataPointText: i === points - 1 ? Math.round(value).toString() : '',
      };
    });
  }, [stats, selectedMetric]);

  // Process map data for top outbreak locations
  const topLocations = useMemo(() => {
    if (!mapData || mapData.length === 0) return [];
    
    // Group by country and sum cases
    const countryTotals = mapData.reduce((acc, outbreak) => {
      const country = outbreak.country;
      const cases = outbreak.outbreak_count || 0;
      
      if (!acc[country]) {
        acc[country] = { country, cases: 0, severity: outbreak.risk_level };
      }
      acc[country].cases += cases;
      
      // Keep highest severity
      if (outbreak.risk_level === 'high') {
        acc[country].severity = 'high';
      } else if (outbreak.risk_level === 'moderate' && acc[country].severity !== 'high') {
        acc[country].severity = 'moderate';
      }
      
      return acc;
    }, {} as Record<string, { country: string; cases: number; severity: string }>);
    
    // Convert to array and sort by cases
    return Object.values(countryTotals)
      .sort((a, b) => b.cases - a.cases)
      .slice(0, 5)
      .map((item, index) => ({
        value: item.cases,
        label: item.country.substring(0, 3).toUpperCase(),
        frontColor: item.severity === 'high' ? '#ef4444' : item.severity === 'moderate' ? '#f97316' : '#10b981',
        country: item.country,
      }));
  }, [mapData]);

  // Process disease distribution
  const diseaseDistribution = useMemo(() => {
    if (!mapData || mapData.length === 0) return [];
    
    const diseaseTotals = mapData.reduce((acc, outbreak) => {
      const disease = outbreak.disease;
      const cases = outbreak.outbreak_count || 0;
      
      if (!acc[disease]) {
        acc[disease] = 0;
      }
      acc[disease] += cases;
      
      return acc;
    }, {} as Record<string, number>);
    
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];
    
    return Object.entries(diseaseTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([disease, cases], index) => ({
        value: cases,
        color: colors[index % colors.length],
        text: cases.toString(),
        disease,
      }));
  }, [mapData]);

  // Calculate severity breakdown
  const severityBreakdown = useMemo(() => {
    if (!mapData || mapData.length === 0) return { high: 0, moderate: 0, low: 0 };
    
    return mapData.reduce((acc, outbreak) => {
      if (outbreak.risk_level === 'high') acc.high++;
      else if (outbreak.risk_level === 'moderate') acc.moderate++;
      else acc.low++;
      return acc;
    }, { high: 0, moderate: 0, low: 0 });
  }, [mapData]);

  const loading = statsLoading || mapLoading;
  const error = statsError || mapError;

  if (loading && !stats && !mapData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading trends data...</Text>
      </View>
    );
  }

  if (error && !stats && !mapData) {
    return (
      <View style={styles.errorContainer}>
        <AlertTriangle size={48} color="#ef4444" />
        <Text style={styles.errorText}>Failed to load trends</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#3b82f6" />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Global Health Trends</Text>
          <Text style={styles.subtitle}>Real-time epidemic monitoring</Text>
        </View>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Live</Text>
        </View>
      </View>

      {/* Key Metrics Cards */}
      <View style={styles.metricsContainer}>
        <TouchableOpacity 
          style={[styles.metricCard, selectedMetric === 'cases' && styles.metricCardActive]}
          onPress={() => setSelectedMetric('cases')}
        >
          <View style={styles.metricIconContainer}>
            <Activity size={20} color="#3b82f6" />
          </View>
          <Text style={styles.metricValue}>{(stats?.total_cases || 0).toLocaleString()}</Text>
          <Text style={styles.metricLabel}>Total Cases</Text>
          <View style={styles.metricTrend}>
            <TrendingUp size={14} color="#10b981" />
            <Text style={styles.metricTrendText}>Live</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.metricCard, selectedMetric === 'critical' && styles.metricCardActive]}
          onPress={() => setSelectedMetric('critical')}
        >
          <View style={[styles.metricIconContainer, { backgroundColor: '#fee2e2' }]}>
            <AlertTriangle size={20} color="#ef4444" />
          </View>
          <Text style={styles.metricValue}>{(stats?.critical_alerts || 0).toLocaleString()}</Text>
          <Text style={styles.metricLabel}>Critical Alerts</Text>
          <View style={styles.metricTrend}>
            <Text style={[styles.metricTrendText, { color: '#64748b' }]}>
              {stats?.active_alerts ? ((stats.critical_alerts / stats.active_alerts) * 100).toFixed(1) : 0}% of active
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.metricCard, selectedMetric === 'active' && styles.metricCardActive]}
          onPress={() => setSelectedMetric('active')}
        >
          <View style={[styles.metricIconContainer, { backgroundColor: '#dcfce7' }]}>
            <TrendingUp size={20} color="#10b981" />
          </View>
          <Text style={styles.metricValue}>{(stats?.active_alerts || 0).toLocaleString()}</Text>
          <Text style={styles.metricLabel}>Active Alerts</Text>
          <View style={styles.metricTrend}>
            <TrendingUp size={14} color="#10b981" />
            <Text style={[styles.metricTrendText, { color: '#10b981' }]}>
              {stats?.countries ? stats.countries : 0} countries
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Trend Line Chart */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>7-Day Trend</Text>
          <Badge variant="secondary">{selectedMetric.toUpperCase()}</Badge>
        </View>
        
        {trendData.length > 0 ? (
          <View style={styles.chartContainer}>
            <LineChart
              data={trendData}
              width={320}
              height={200}
              spacing={45}
              color="#3b82f6"
              thickness={3}
              startFillColor="rgba(59, 130, 246, 0.3)"
              endFillColor="rgba(59, 130, 246, 0.05)"
              startOpacity={0.9}
              endOpacity={0.2}
              initialSpacing={15}
              noOfSections={4}
              yAxisColor="#475569"
              xAxisColor="#475569"
              yAxisTextStyle={{ color: '#94a3b8', fontSize: 10 }}
              xAxisLabelTextStyle={{ color: '#94a3b8', fontSize: 10 }}
              dataPointsColor="#3b82f6"
              dataPointsRadius={4}
              textColor="#e2e8f0"
              textFontSize={12}
              textShiftY={-8}
              textShiftX={-10}
              hideRules
              areaChart
              curved
            />
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No trend data available</Text>
          </View>
        )}
      </View>

      {/* Severity Breakdown */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Alert Severity Breakdown</Text>
        <View style={styles.severityContainer}>
          <View style={styles.severityItem}>
            <View style={[styles.severityBar, { width: `${severityBreakdown.high > 0 ? (severityBreakdown.high / (severityBreakdown.high + severityBreakdown.moderate + severityBreakdown.low)) * 100 : 0}%`, backgroundColor: '#ef4444' }]} />
            <View style={styles.severityInfo}>
              <View style={[styles.severityDot, { backgroundColor: '#ef4444' }]} />
              <Text style={styles.severityLabel}>Critical</Text>
              <Text style={styles.severityValue}>{severityBreakdown.high}</Text>
            </View>
          </View>
          
          <View style={styles.severityItem}>
            <View style={[styles.severityBar, { width: `${severityBreakdown.moderate > 0 ? (severityBreakdown.moderate / (severityBreakdown.high + severityBreakdown.moderate + severityBreakdown.low)) * 100 : 0}%`, backgroundColor: '#f97316' }]} />
            <View style={styles.severityInfo}>
              <View style={[styles.severityDot, { backgroundColor: '#f97316' }]} />
              <Text style={styles.severityLabel}>Moderate</Text>
              <Text style={styles.severityValue}>{severityBreakdown.moderate}</Text>
            </View>
          </View>
          
          <View style={styles.severityItem}>
            <View style={[styles.severityBar, { width: `${severityBreakdown.low > 0 ? (severityBreakdown.low / (severityBreakdown.high + severityBreakdown.moderate + severityBreakdown.low)) * 100 : 0}%`, backgroundColor: '#10b981' }]} />
            <View style={styles.severityInfo}>
              <View style={[styles.severityDot, { backgroundColor: '#10b981' }]} />
              <Text style={styles.severityLabel}>Low</Text>
              <Text style={styles.severityValue}>{severityBreakdown.low}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Top Outbreak Locations */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Top Outbreak Locations</Text>
          <MapPin size={18} color="#60a5fa" />
        </View>
        
        {topLocations.length > 0 ? (
          <View style={styles.chartContainer}>
            <BarChart
              data={topLocations}
              width={320}
              height={200}
              barWidth={40}
              spacing={20}
              roundedTop
              roundedBottom
              hideRules
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{ color: '#94a3b8', fontSize: 10 }}
              noOfSections={3}
              maxValue={Math.max(...topLocations.map(d => d.value)) * 1.1}
              initialSpacing={20}
            />
            
            {/* Country labels */}
            <View style={styles.locationLabels}>
              {topLocations.map((loc, index) => (
                <View key={index} style={styles.locationLabelItem}>
                  <Text style={styles.locationLabel}>{loc.country}</Text>
                  <Text style={styles.locationValue}>{loc.value.toLocaleString()}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No location data available</Text>
          </View>
        )}
      </View>

      {/* Disease Distribution */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Disease Distribution</Text>
        
        {diseaseDistribution.length > 0 ? (
          <View style={styles.pieChartContainer}>
            <PieChart
              data={diseaseDistribution}
              donut
              radius={80}
              innerRadius={50}
              innerCircleColor="#1e293b"
              centerLabelComponent={() => (
                <View style={styles.pieCenterLabel}>
                  <Text style={styles.pieCenterValue}>{diseaseDistribution.length}</Text>
                  <Text style={styles.pieCenterText}>Diseases</Text>
                </View>
              )}
            />
            
            {/* Legend */}
            <View style={styles.diseaseLegend}>
              {diseaseDistribution.map((item, index) => (
                <View key={index} style={styles.diseaseItem}>
                  <View style={[styles.diseaseDot, { backgroundColor: item.color }]} />
                  <Text style={styles.diseaseName} numberOfLines={1}>
                    {item.disease.length > 20 ? item.disease.substring(0, 20) + '...' : item.disease}
                  </Text>
                  <Text style={styles.diseaseValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No disease data available</Text>
          </View>
        )}
      </View>

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Data updates in real-time from global health monitoring systems
        </Text>
        <Text style={styles.footerSubtext}>
          Last updated: {new Date().toLocaleTimeString()}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    color: '#94a3b8',
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  liveText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '600',
  },
  metricsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  metricCardActive: {
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  metricIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
  },
  metricTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricTrendText: {
    fontSize: 11,
    color: '#10b981',
    fontWeight: '600',
  },
  chartCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
  },
  noDataContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  noDataText: {
    color: '#64748b',
    fontSize: 14,
  },
  severityContainer: {
    gap: 16,
  },
  severityItem: {
    gap: 8,
  },
  severityBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  severityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  severityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  severityLabel: {
    flex: 1,
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '500',
  },
  severityValue: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  locationLabels: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  locationLabelItem: {
    flex: 1,
    alignItems: 'center',
  },
  locationLabel: {
    color: '#94a3b8',
    fontSize: 11,
    marginBottom: 4,
  },
  locationValue: {
    color: '#60a5fa',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pieChartContainer: {
    alignItems: 'center',
    gap: 20,
  },
  pieCenterLabel: {
    alignItems: 'center',
  },
  pieCenterValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  pieCenterText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  diseaseLegend: {
    width: '100%',
    gap: 12,
  },
  diseaseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  diseaseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  diseaseName: {
    flex: 1,
    color: '#e2e8f0',
    fontSize: 14,
  },
  diseaseValue: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    gap: 4,
    marginBottom: 20,
  },
  footerText: {
    color: '#64748b',
    fontSize: 12,
    textAlign: 'center',
  },
  footerSubtext: {
    color: '#475569',
    fontSize: 11,
  },
});
