import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { Badge } from './ui/badge';
import { MapPin } from 'lucide-react-native';

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
  const [isMapExpanded, setIsMapExpanded] = useState(false);

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

  // Convert lat/lng to SVG coordinates (simplified projection)
  const projectCoordinates = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 500;
    const y = ((90 - lat) / 180) * 250;
    return { x, y };
  };

  return (
    <View style={styles.container}>
      {/* Interactive World Map */}
      <View style={[styles.mapContainer, isMapExpanded && styles.mapContainerExpanded]}>
        {/* Live indicator */}
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Live</Text>
        </View>
        
        {/* World Map - Using OpenStreetMap free tile service */}
        <View style={{ flex: 1, position: 'relative', backgroundColor: '#0a1929' }}>
          {/* Real world map from OpenStreetMap (free tile service) */}
          <Image
            source={{ uri: 'https://tile.openstreetmap.org/0/0/0.png' }}
            style={{ 
              width: '100%', 
              height: '100%',
              opacity: 0.5
            }}
            resizeMode="cover"
          />
          
          {/* Dark overlay for dark mode effect */}
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 41, 66, 0.6)'
          }} />
          
          {/* Interactive outbreak markers overlaid on top */}
          <Svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 500 250" 
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
          {outbreaks.map((outbreak) => {
            const { x, y } = projectCoordinates(outbreak.location.lat, outbreak.location.lng);
            const color = getSeverityColor(outbreak.severity);
            const isSelected = selectedOutbreak?.id === outbreak.id;
            
            return (
              <G key={outbreak.id}>
                {/* Pulsing outer circle */}
                <Circle 
                  cx={x} 
                  cy={y} 
                  r={isSelected ? "18" : "14"} 
                  fill="none" 
                  stroke={color} 
                  strokeWidth={isSelected ? "3" : "2.5"} 
                  opacity={isSelected ? "0.6" : "0.3"} 
                />
                <Circle 
                  cx={x} 
                  cy={y} 
                  r={isSelected ? "12" : "10"} 
                  fill="none" 
                  stroke={color} 
                  strokeWidth="2" 
                  opacity={isSelected ? "0.8" : "0.5"} 
                />
                {/* Inner dot - Make it touchable */}
                <Circle 
                  cx={x} 
                  cy={y} 
                  r={isSelected ? "7" : "5"} 
                  fill={color} 
                  stroke="white" 
                  strokeWidth={isSelected ? "2.5" : "1.5"}
                  onPress={() => handleMarkerPress(outbreak)}
                />
              </G>
            );
          })}
          </Svg>
        </View>

        {/* Map Legend */}
        <View style={styles.mapLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
            <Text style={styles.legendText}>Critical</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#f97316' }]} />
            <Text style={styles.legendText}>Major</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#eab308' }]} />
            <Text style={styles.legendText}>Moderate</Text>
          </View>
        </View>

        {/* Expand/Collapse button */}
        <TouchableOpacity 
          style={styles.expandButton}
          onPress={() => setIsMapExpanded(!isMapExpanded)}
        >
          <Text style={styles.expandButtonText}>
            {isMapExpanded ? '▼ Collapse' : '▲ Expand Map'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Outbreak List */}
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
  mapContainer: {
    height: 220,
    backgroundColor: '#1e3a5f',
    borderBottomWidth: 2,
    borderBottomColor: '#60a5fa',
    borderRadius: 16,
    margin: 16,
    overflow: 'hidden',
  },
  mapContainerExpanded: {
    height: 500,
    margin: 8,
  },
  liveIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    zIndex: 10,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  liveText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  customMarkerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    opacity: 0.5,
  },
  markerDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
  },
  expandButton: {
    position: 'absolute',
    bottom: 70,
    left: '50%',
    transform: [{ translateX: -60 }],
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  expandButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  mapLegend: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 12,
    zIndex: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#1e293b',
    padding: 16,
    marginTop: 8,
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
