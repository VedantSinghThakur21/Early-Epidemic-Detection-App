
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// import MapView, { Marker, Callout } from 'react-native-maps'; // Temporarily disabled for Expo Go
import { Badge } from './ui/badge';
import { MapPin, TrendingUp, Calendar, Globe2, Map } from 'lucide-react-native';

interface Outbreak {
  id: number;
  disease: string;
  location: {
    lat: number;
    lng: number;
    name: string;
    country?: string;
    region?: string;
  };
  severity: string;
  cases: number;
  date: string;
}

interface MapViewProps {
  outbreaks: Outbreak[];
}

export default function MapView({ outbreaks }: MapViewProps) {
  const [selectedOutbreak, setSelectedOutbreak] = useState<Outbreak | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return '#ef4444';
      case 'moderate':
        return '#f97316';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const handleMarkerPress = (outbreak: Outbreak) => {
    setSelectedOutbreak(outbreak);
  };

  return (
    <View style={styles.container}>
      {/* Temporary placeholder - react-native-maps not supported in Expo Go */}
      <View style={styles.mapPlaceholder}>
        <Map size={64} color="#60a5fa" />
        <Text style={styles.placeholderText}>Map View</Text>
        <Text style={styles.placeholderSubtext}>
          Interactive map requires native build
        </Text>
        <Text style={styles.placeholderSubtext}>
          {outbreaks.length} outbreak locations tracked
        </Text>
      </View>
      
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Global Outbreak Locations</Text>
        <ScrollView>
          {outbreaks.map(outbreak => (
            <TouchableOpacity key={outbreak.id} style={styles.listItem} onPress={() => handleMarkerPress(outbreak)}>
              <View style={[styles.severityIndicator, { backgroundColor: getSeverityColor(outbreak.severity) }]} />
              <View style={styles.listItemTextContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <MapPin size={14} color="#60a5fa" style={{ marginRight: 4 }} />
                  <Text style={styles.listItemTitle}>{outbreak.disease}</Text>
                </View>
                <Text style={styles.listItemSubtitle}>
                  {outbreak.location.name} • {outbreak.location.country}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <Text style={styles.listItemCasesLabel}>Cases: </Text>
                  <Text style={styles.listItemCases}>{outbreak.cases.toLocaleString()}</Text>
                </View>
              </View>
              <Badge variant={outbreak.severity === 'high' ? 'destructive' : outbreak.severity === 'moderate' ? 'default' : 'secondary'}>
                {outbreak.severity.toUpperCase()}
              </Badge>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 0.6,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#60a5fa',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 8,
    textAlign: 'center',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#1e293b',
    padding: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  severityIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  listItemTextContainer: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  listItemSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
  },
  listItemCasesLabel: {
    fontSize: 13,
    color: '#94a3b8',
  },
  listItemCases: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#60a5fa',
  },
});
