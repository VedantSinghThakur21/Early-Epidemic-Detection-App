
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react-native';

const OUTBREAK_DATA = {
  dengue: {
    name: 'Dengue Fever',
    color: '#ef4444',
    data: [
      { value: 150, label: 'Week 1' },
      { value: 180, label: 'Week 2' },
      { value: 210, label: 'Week 3' },
      { value: 245, label: 'Week 4' },
      { value: 268, label: 'Week 5' },
      { value: 287, label: 'Week 6' },
    ],
    total: 287,
    trend: '+23%',
    region: 'Asia',
  },
  malaria: {
    name: 'Malaria',
    color: '#f59e0b',
    data: [
      { value: 80, label: 'Week 1' },
      { value: 95, label: 'Week 2' },
      { value: 105, label: 'Week 3' },
      { value: 118, label: 'Week 4' },
      { value: 125, label: 'Week 5' },
      { value: 134, label: 'Week 6' },
    ],
    total: 134,
    trend: '+18%',
    region: 'Africa',
  },
  cholera: {
    name: 'Cholera',
    color: '#8b5cf6',
    data: [
      { value: 45, label: 'Week 1' },
      { value: 48, label: 'Week 2' },
      { value: 52, label: 'Week 3' },
      { value: 58, label: 'Week 4' },
      { value: 62, label: 'Week 5' },
      { value: 67, label: 'Week 6' },
    ],
    total: 67,
    trend: '+12%',
    region: 'Asia',
  },
  influenza: {
    name: 'Influenza',
    color: '#10b981',
    data: [
      { value: 90, label: 'Week 1' },
      { value: 88, label: 'Week 2' },
      { value: 95, label: 'Week 3' },
      { value: 98, label: 'Week 4' },
      { value: 100, label: 'Week 5' },
      { value: 103, label: 'Week 6' },
    ],
    total: 103,
    trend: '+5%',
    region: 'N. America',
  },
};

export default function TrendChart() {
  const [selectedOutbreak, setSelectedOutbreak] = useState<keyof typeof OUTBREAK_DATA>('dengue');
  
  const currentData = OUTBREAK_DATA[selectedOutbreak];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Activity size={24} color={currentData.color} />
          <View>
            <Text style={styles.title}>Epidemic Trends Analysis</Text>
            <Text style={styles.subtitle}>Last 6 weeks</Text>
          </View>
        </View>
      </View>

      {/* Outbreak Selection Buttons */}
      <View style={styles.selectionContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectionScroll}>
          {Object.entries(OUTBREAK_DATA).map(([key, outbreak]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.selectionButton,
                selectedOutbreak === key && { backgroundColor: outbreak.color, borderColor: outbreak.color }
              ]}
              onPress={() => setSelectedOutbreak(key as keyof typeof OUTBREAK_DATA)}
            >
              <View style={[styles.colorDot, { backgroundColor: outbreak.color }]} />
              <Text style={[
                styles.selectionButtonText,
                selectedOutbreak === key && styles.selectionButtonTextActive
              ]}>
                {outbreak.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.chartContainer}>
        <LineChart
          data={currentData.data}
          width={320}
          height={220}
          spacing={50}
          color={currentData.color}
          thickness={3}
          startFillColor={`${currentData.color}50`}
          endFillColor={`${currentData.color}10`}
          startOpacity={0.9}
          endOpacity={0.2}
          initialSpacing={10}
          noOfSections={5}
          maxValue={300}
          yAxisColor="#334155"
          xAxisColor="#334155"
          yAxisTextStyle={{ color: '#94a3b8', fontSize: 10 }}
          xAxisLabelTextStyle={{ color: '#94a3b8', fontSize: 10 }}
          dataPointsColor={currentData.color}
          dataPointsRadius={5}
          textColor="#94a3b8"
          textFontSize={10}
          areaChart
          curved
        />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: `${currentData.color}20` }]}>
            <Text style={[styles.statIcon, { color: currentData.color }]}>{currentData.name[0]}</Text>
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statLabel}>{currentData.name}</Text>
            <Text style={styles.statValue}>{currentData.total}</Text>
            <Text style={styles.statRegion}>{currentData.region}</Text>
          </View>
          <View style={[styles.statTrendBadge, { backgroundColor: `${currentData.color}20` }]}>
            <TrendingUp size={14} color={currentData.color} />
            <Text style={[styles.statTrendText, { color: currentData.color }]}>{currentData.trend}</Text>
          </View>
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
  chartContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statsContainer: {
    gap: 12,
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
  statRegion: {
    fontSize: 11,
    color: '#64748b',
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
});
