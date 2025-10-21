
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { TrendingUp, TrendingDown, Activity, AlertTriangle, Minus, Calendar } from 'lucide-react-native';
import { useTrends, useDashboardStats, useMapData } from '../hooks/useEpiWatch';

// Color palette for different diseases
const DISEASE_COLORS = [
  '#ef4444', // red
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#10b981', // emerald
  '#3b82f6', // blue
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
];

type PeriodType = 'weekly' | 'yearly';

export default function TrendChart() {
  const { data: trendsData, loading: trendsLoading, error: trendsError } = useTrends();
  const { data: stats, loading: statsLoading } = useDashboardStats();
  const { data: mapData, loading: mapLoading } = useMapData();
  
  // Use top diseases from stats as default selection
  const [selectedDiseaseIndex, setSelectedDiseaseIndex] = useState(0);
  const [periodType, setPeriodType] = useState<PeriodType>('yearly');
  
  // Combine trends with statistics to show which diseases have real data
  const availableDiseases = stats?.top_diseases || [];
  
  // Aggregate map data by year for yearly trends (2010-2025)
  const yearlyTrends = useMemo(() => {
    if (!mapData || !stats || mapData.length === 0) return [];
    
    const START_YEAR = 2010;
    const CURRENT_YEAR = new Date().getFullYear();
    
    return availableDiseases.map((disease) => {
      // Filter map data for this disease within 2010-2025 range
      const diseaseData = mapData.filter(
        (outbreak) => 
          outbreak.disease.toLowerCase() === disease.disease.toLowerCase() &&
          outbreak.year >= START_YEAR &&
          outbreak.year <= CURRENT_YEAR
      );
      
      // Group by year and sum outbreak_count
      const yearlyMap: { [year: number]: number } = {};
      diseaseData.forEach((outbreak) => {
        const year = outbreak.year;
        if (!yearlyMap[year]) {
          yearlyMap[year] = 0;
        }
        yearlyMap[year] += outbreak.outbreak_count;
      });
      
      // Convert to array and sort by year
      const yearlyData = Object.entries(yearlyMap)
        .map(([year, count]) => ({
          year: parseInt(year),
          count: count,
        }))
        .sort((a, b) => a.year - b.year);
      
      // Calculate total and trend
      const totalCount = yearlyData.reduce((sum, point) => sum + point.count, 0);
      let trendDirection: 'up' | 'down' | 'stable' = 'stable';
      if (yearlyData.length >= 2) {
        const firstHalf = yearlyData.slice(0, Math.floor(yearlyData.length / 2));
        const secondHalf = yearlyData.slice(Math.floor(yearlyData.length / 2));
        const firstAvg = firstHalf.reduce((sum, p) => sum + p.count, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, p) => sum + p.count, 0) / secondHalf.length;
        trendDirection = secondAvg > firstAvg ? 'up' : secondAvg < firstAvg ? 'down' : 'stable';
      }
      
      return {
        disease: disease.disease,
        total_count: totalCount,
        yearly_data: yearlyData,
        trend_direction: trendDirection,
        change_pct: disease.change_pct,
        severity: totalCount > 100 ? 'major' : totalCount > 50 ? 'moderate' : 'minor',
      };
    });
  }, [mapData, stats, availableDiseases]);
  
  if ((trendsLoading || statsLoading || mapLoading) && !trendsData && !stats && !mapData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading trends data...</Text>
      </View>
    );
  }

  if ((trendsError || !stats) && !trendsData) {
    return (
      <View style={styles.errorContainer}>
        <AlertTriangle size={48} color="#ef4444" />
        <Text style={styles.errorText}>Failed to load trends</Text>
        <Text style={styles.errorMessage}>{trendsError || 'No statistics available'}</Text>
      </View>
    );
  }

  if (!stats || availableDiseases.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Activity size={48} color="#64748b" />
        <Text style={styles.errorText}>No trends data available</Text>
        <Text style={styles.errorMessage}>Check back later for epidemic trends</Text>
      </View>
    );
  }

  // Use yearly trends if available and period is yearly, otherwise fall back to weekly
  const useYearlyData = periodType === 'yearly' && yearlyTrends.length > 0;
  const currentTrendSource = useYearlyData ? yearlyTrends[selectedDiseaseIndex] : trendsData?.[selectedDiseaseIndex];
  const currentStats = availableDiseases[selectedDiseaseIndex];
  const diseaseColor = DISEASE_COLORS[selectedDiseaseIndex % DISEASE_COLORS.length];
  
  // Type guard to check if we have yearly data
  const isYearlyTrend = (trend: typeof currentTrendSource): trend is typeof yearlyTrends[number] => {
    return trend && 'yearly_data' in trend;
  };
  
  // Get current trend for display (fallback to trends API data)
  const currentTrend = trendsData?.[selectedDiseaseIndex];
  
  // Transform data based on period type
  const chartData = useYearlyData && isYearlyTrend(currentTrendSource)
    ? currentTrendSource.yearly_data.map((point) => ({
        value: point.count,
        label: point.year.toString(),
        dataPointText: point.count > 0 ? point.count.toString() : '',
      }))
    : trendsData?.[selectedDiseaseIndex]?.trend_data.map((point, index) => ({
        value: point.count,
        label: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dataPointText: point.count > 0 ? point.count.toString() : '',
      })) || [];
  
  // Calculate max value for chart scaling
  const maxValue = Math.max(...chartData.map(d => d.value), 10);
  const chartMaxValue = Math.ceil(maxValue * 1.2); // 20% padding
  
  // Check if we have actual data
  const hasRealData = maxValue > 0;
  
  // Get trend icon
  const getTrendIcon = () => {
    if (currentTrend.trend_direction === 'up') {
      return <TrendingUp size={14} color="#ef4444" />;
    } else if (currentTrend.trend_direction === 'down') {
      return <TrendingDown size={14} color="#10b981" />;
    } else {
      return <Minus size={14} color="#94a3b8" />;
    }
  };
  
  // Get trend color
  const getTrendColor = () => {
    if (currentStats?.trend === 'up') return '#ef4444';
    if (currentStats?.trend === 'down') return '#10b981';
    return '#94a3b8';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Activity size={24} color={diseaseColor} />
          <View>
            <Text style={styles.title}>Epidemic Trends Analysis</Text>
            <Text style={styles.subtitle}>
              {periodType === 'yearly' ? '2010-2025 Historical Trends' : 'Last 7 days'}
            </Text>
          </View>
        </View>
      </View>

      {/* Disease Selection Buttons */}
      <View style={styles.selectionContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectionScroll}>
          {trendsData.map((trend, index) => {
            const color = DISEASE_COLORS[index % DISEASE_COLORS.length];
            const stats = availableDiseases[index];
            return (
              <TouchableOpacity
                key={trend.disease}
                style={[
                  styles.selectionButton,
                  selectedDiseaseIndex === index && { backgroundColor: color, borderColor: color }
                ]}
                onPress={() => setSelectedDiseaseIndex(index)}
              >
                <View style={[styles.colorDot, { backgroundColor: color }]} />
                <View>
                  <Text style={[
                    styles.selectionButtonText,
                    selectedDiseaseIndex === index && styles.selectionButtonTextActive
                  ]}>
                    {trend.disease}
                  </Text>
                  {stats && (
                    <Text style={[
                      styles.selectionButtonCount,
                      selectedDiseaseIndex === index && styles.selectionButtonCountActive
                    ]}>
                      {stats.current_count} cases
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Period Selection */}
      <View style={styles.periodSelection}>
        <TouchableOpacity
          style={[
            styles.periodButton,
            periodType === 'weekly' && styles.periodButtonActive
          ]}
          onPress={() => setPeriodType('weekly')}
        >
          <Activity size={16} color={periodType === 'weekly' ? '#fff' : '#64748b'} />
          <Text style={[
            styles.periodButtonText,
            periodType === 'weekly' && styles.periodButtonTextActive
          ]}>
            Weekly
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.periodButton,
            periodType === 'yearly' && styles.periodButtonActive
          ]}
          onPress={() => setPeriodType('yearly')}
        >
          <Calendar size={16} color={periodType === 'yearly' ? '#fff' : '#64748b'} />
          <Text style={[
            styles.periodButtonText,
            periodType === 'yearly' && styles.periodButtonTextActive
          ]}>
            Yearly
          </Text>
        </TouchableOpacity>
      </View>

      {/* Info Banner */}
      {!hasRealData && periodType === 'weekly' && (
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerText}>
            📊 Showing {availableDiseases.length} top diseases
          </Text>
          <Text style={styles.infoBannerSubtext}>
            Weekly trend time-series data is currently being collected. Switch to "Yearly" view to see historical outbreak trends.
          </Text>
        </View>
      )}
      
      {periodType === 'yearly' && yearlyTrends.length > 0 && (
        <View style={[styles.infoBanner, { borderLeftColor: '#10b981' }]}>
          <Text style={styles.infoBannerText}>
            📈 Historical Trends (2010-2025)
          </Text>
          <Text style={styles.infoBannerSubtext}>
            Showing yearly aggregated outbreak counts from 2010 to {new Date().getFullYear()}. Data is compiled from the global outbreak map dataset.
          </Text>
        </View>
      )}

      {/* Chart */}
      <View style={styles.chartContainer}>
        {maxValue === 0 ? (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No case data for the selected period</Text>
          </View>
        ) : (
          <LineChart
            data={chartData}
            width={320}
            height={220}
            spacing={45}
            color={diseaseColor}
            thickness={3}
            startFillColor={`${diseaseColor}50`}
            endFillColor={`${diseaseColor}10`}
            startOpacity={0.9}
            endOpacity={0.2}
            initialSpacing={10}
            noOfSections={5}
            maxValue={chartMaxValue}
            yAxisColor="#334155"
            xAxisColor="#334155"
            yAxisTextStyle={{ color: '#94a3b8', fontSize: 10 }}
            xAxisLabelTextStyle={{ color: '#94a3b8', fontSize: 10 }}
            dataPointsColor={diseaseColor}
            dataPointsRadius={4}
            textColor="#94a3b8"
            textFontSize={10}
            areaChart
            curved
          />
        )}
      </View>

      {/* Stats Card */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: `${diseaseColor}20` }]}>
            <Text style={[styles.statIcon, { color: diseaseColor }]}>
              {currentTrend.disease[0].toUpperCase()}
            </Text>
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statLabel}>{currentTrend.disease}</Text>
            <Text style={styles.statValue}>
              {currentStats ? currentStats.current_count.toLocaleString() : currentTrend.total_count}
            </Text>
            <Text style={styles.statDescription}>
              {currentStats ? `Current outbreak count` : currentTrend.description}
            </Text>
          </View>
          <View style={[styles.statTrendBadge, { backgroundColor: `${getTrendColor()}20` }]}>
            {getTrendIcon()}
            <Text style={[styles.statTrendText, { color: getTrendColor() }]}>
              {currentStats 
                ? `${currentStats.change_pct > 0 ? '+' : ''}${currentStats.change_pct}%`
                : `${currentTrend.change_pct > 0 ? '+' : ''}${currentTrend.change_pct}%`
              }
            </Text>
          </View>
        </View>
      </View>

      {/* Additional Info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Disease Analysis</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Direction:</Text>
          <View style={styles.infoValueRow}>
            {getTrendIcon()}
            <Text style={[styles.infoValue, { color: getTrendColor() }]}>
              {currentStats?.trend 
                ? currentStats.trend.charAt(0).toUpperCase() + currentStats.trend.slice(1)
                : currentTrend.trend_direction.charAt(0).toUpperCase() + currentTrend.trend_direction.slice(1)
              }
            </Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Severity:</Text>
          <Text style={[styles.infoValue, { 
            color: currentTrend.severity === 'major' ? '#ef4444' : 
                   currentTrend.severity === 'moderate' ? '#f59e0b' : '#10b981' 
          }]}>
            {currentTrend.severity.charAt(0).toUpperCase() + currentTrend.severity.slice(1)}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Total Cases:</Text>
          <Text style={styles.infoValue}>
            {currentStats 
              ? currentStats.current_count.toLocaleString()
              : currentTrend.total_count.toLocaleString()
            }
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Change:</Text>
          <Text style={[styles.infoValue, { 
            color: (currentStats?.change_pct || currentTrend.change_pct) < 0 ? '#10b981' : '#ef4444'
          }]}>
            {currentStats 
              ? `${currentStats.change_pct > 0 ? '+' : ''}${currentStats.change_pct}%`
              : `${currentTrend.change_pct > 0 ? '+' : ''}${currentTrend.change_pct}%`
            }
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
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
    padding: 40,
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
  header: {
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  selectionContainer: {
    marginBottom: 16,
  },
  selectionScroll: {
    flexGrow: 0,
  },
  selectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  selectionButtonText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  selectionButtonTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectionButtonCount: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
  },
  selectionButtonCountActive: {
    color: '#e2e8f0',
    fontSize: 11,
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
    lineHeight: 16,
  },
  periodSelection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  periodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#1e293b',
    borderWidth: 2,
    borderColor: '#334155',
  },
  periodButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  periodButtonTextActive: {
    color: '#ffffff',
  },
  chartContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  noDataContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: '#64748b',
    fontSize: 14,
  },
  statsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  statDescription: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
  },
  statTrendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  statTrendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  infoLabel: {
    fontSize: 14,
    color: '#94a3b8',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  infoValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
