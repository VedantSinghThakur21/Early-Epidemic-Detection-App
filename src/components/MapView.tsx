import React, { useState, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl, TextInput, Platform } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { Badge } from './ui/badge';
import { MapPin, AlertTriangle, Search, X } from 'lucide-react-native';
import { useMapData } from '../hooks/useEpiWatch';
import { MapOutbreak } from '../types/epiwatch.types';

interface MapViewProps {
  outbreaks?: MapOutbreak[]; // Made optional for backwards compatibility
}

export default function MapView({ outbreaks: propOutbreaks }: MapViewProps) {
  // State declarations
  const [selectedOutbreak, setSelectedOutbreak] = useState<MapOutbreak | null>(null);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null);
  const [expandedDiseases, setExpandedDiseases] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grouped' | 'expanded'>('grouped');
  
  // Fetch real-time map data from API
  const { data: apiOutbreaks, loading, error, refetch } = useMapData();
  
  // Transform and consolidate API data by disease and country
  const transformedOutbreaks = React.useMemo(() => {
    if (!apiOutbreaks || apiOutbreaks.length === 0) return [];
    
    // Group outbreaks by disease + country combination
    const grouped = apiOutbreaks.reduce((acc, outbreak) => {
      const key = `${outbreak.disease}|${outbreak.country}`;
      
      if (!acc[key]) {
        acc[key] = {
          ...outbreak,
          id: key,
          location: {
            name: outbreak.country,
            country: outbreak.country,
            lat: outbreak.latitude,
            lng: outbreak.longitude,
          },
          severity: outbreak.risk_level,
          cases: outbreak.outbreak_count,
          totalCases: outbreak.outbreak_count,
          outbreakCount: 1,
        };
      } else {
        // Aggregate outbreak counts and cases
        acc[key].totalCases += outbreak.outbreak_count;
        acc[key].outbreakCount += 1;
        acc[key].cases = acc[key].totalCases;
        
        // Keep the highest risk level
        if (outbreak.risk_level === 'high') {
          acc[key].severity = 'high';
          acc[key].risk_level = 'high';
        } else if (outbreak.risk_level === 'moderate' && acc[key].severity !== 'high') {
          acc[key].severity = 'moderate';
          acc[key].risk_level = 'moderate';
        }
      }
      
      return acc;
    }, {} as Record<string, any>);
    
    // Convert to array and sort by total cases (descending)
    return Object.values(grouped).sort((a: any, b: any) => {
      // First sort by severity
      const severityOrder = { high: 0, moderate: 1, low: 2 };
      const severityDiff = (severityOrder[a.severity as keyof typeof severityOrder] || 3) - 
                          (severityOrder[b.severity as keyof typeof severityOrder] || 3);
      if (severityDiff !== 0) return severityDiff;
      
      // Then by total cases
      return (b.totalCases || 0) - (a.totalCases || 0);
    });
  }, [apiOutbreaks]);
  
  // Use prop outbreaks if provided (for backwards compatibility), otherwise use transformed API data
  const outbreaks = propOutbreaks || transformedOutbreaks || [];
  
  // Get unique diseases for filter
  const uniqueDiseases = useMemo(() => {
    if (!outbreaks || outbreaks.length === 0) return [];
    const diseases = outbreaks.map(o => o.disease);
    return [...new Set(diseases)].sort();
  }, [outbreaks]);
  
  // Group outbreaks by disease for collapsed view
  const groupedOutbreaks = useMemo(() => {
    if (!outbreaks || outbreaks.length === 0) return [];
    
    const grouped = outbreaks.reduce((acc, outbreak) => {
      const disease = outbreak.disease;
      if (!acc[disease]) {
        acc[disease] = {
          disease,
          locations: [],
          totalCases: 0,
          highestSeverity: outbreak.severity || 'low',
          countries: new Set<string>(),
        };
      }
      acc[disease].locations.push(outbreak);
      acc[disease].totalCases += outbreak.totalCases || outbreak.cases || outbreak.outbreak_count || 0;
      acc[disease].countries.add(outbreak.country);
      
      // Keep highest severity
      if (outbreak.severity === 'high' || (outbreak.severity === 'moderate' && acc[disease].highestSeverity === 'low')) {
        acc[disease].highestSeverity = outbreak.severity;
      }
      
      return acc;
    }, {} as Record<string, any>);
    
    // Sort by total cases
    return Object.values(grouped).sort((a: any, b: any) => b.totalCases - a.totalCases);
  }, [outbreaks]);
  
  // Filter outbreaks based on search and selected disease
  const filteredOutbreaks = useMemo(() => {
    if (!outbreaks || outbreaks.length === 0) return [];
    
    let filtered = outbreaks;
    
    // Filter by selected disease
    if (selectedDisease) {
      filtered = filtered.filter(o => o.disease === selectedDisease);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(o => 
        o.disease.toLowerCase().includes(query) ||
        o.country.toLowerCase().includes(query) ||
        (o.location?.name || '').toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [outbreaks, selectedDisease, searchQuery]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

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

  const handleMarkerPress = (outbreak: MapOutbreak) => {
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
      {/* Loading State */}
      {loading && outbreaks.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>
            Loading global outbreak data...
          </Text>
        </View>
      )}

      {/* Error State */}
      {error && outbreaks.length === 0 && (
        <View style={styles.errorContainer}>
          <AlertTriangle size={48} color="#ef4444" />
          <Text style={styles.errorText}>Connection Issue</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          {error.includes('waking up') && (
            <Text style={styles.errorHint}>
              💡 The API sleeps after 15 minutes of inactivity.{'\n'}
              First request takes 30-60 seconds.
            </Text>
          )}
          {error.includes('internet') && (
            <Text style={styles.errorHint}>
              💡 Check your WiFi/mobile data connection
            </Text>
          )}
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Interactive World Map */}
      {outbreaks.length > 0 && (
        <>
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
          {filteredOutbreaks.map((outbreak) => {
            // Skip if location data is not available
            if (!outbreak.location?.lat || !outbreak.location?.lng) {
              return null;
            }
            
            const { x, y } = projectCoordinates(outbreak.location.lat, outbreak.location.lng);
            const color = getSeverityColor(outbreak.severity || 'low');
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
        <View style={styles.listHeader}>
          <View>
            <Text style={styles.listTitle}>Global Outbreak Locations</Text>
            <Text style={styles.listCount}>
              {viewMode === 'grouped' 
                ? `${groupedOutbreaks.length} diseases • ${filteredOutbreaks.length} locations`
                : `${filteredOutbreaks.length} ${filteredOutbreaks.length === 1 ? 'location' : 'locations'}`
              }
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.viewModeButton}
            onPress={() => setViewMode(viewMode === 'grouped' ? 'expanded' : 'grouped')}
          >
            <Text style={styles.viewModeButtonText}>
              {viewMode === 'grouped' ? 'Show All' : 'Group'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={18} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search diseases or countries..."
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <X size={18} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Disease Filter Pills */}
        {!searchQuery && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.diseaseFilterScroll}
            contentContainerStyle={styles.diseaseFilterContainer}
          >
            <TouchableOpacity
              style={[styles.diseaseFilterPill, !selectedDisease && styles.diseaseFilterPillActive]}
              onPress={() => setSelectedDisease(null)}
            >
              <Text style={[styles.diseaseFilterText, !selectedDisease && styles.diseaseFilterTextActive]}>
                All ({outbreaks.length})
              </Text>
            </TouchableOpacity>
            {uniqueDiseases.slice(0, 10).map(disease => {
              const count = outbreaks.filter(o => o.disease === disease).length;
              return (
                <TouchableOpacity
                  key={disease}
                  style={[
                    styles.diseaseFilterPill,
                    selectedDisease === disease && styles.diseaseFilterPillActive
                  ]}
                  onPress={() => setSelectedDisease(selectedDisease === disease ? null : disease)}
                >
                  <Text style={[
                    styles.diseaseFilterText,
                    selectedDisease === disease && styles.diseaseFilterTextActive
                  ]}>
                    {disease.length > 20 ? disease.substring(0, 20) + '...' : disease} ({count})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
        
        <ScrollView 
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh}
              tintColor="#3b82f6"
            />
          }
        >
          {viewMode === 'grouped' ? (
            // Grouped view - one card per disease
            groupedOutbreaks.length === 0 ? (
              <View style={styles.emptyState}>
                <MapPin size={48} color="#64748b" />
                <Text style={styles.emptyStateText}>No outbreaks found</Text>
              </View>
            ) : (
              groupedOutbreaks.map((group: any) => {
                const isExpanded = expandedDiseases.has(group.disease);
                return (
                  <View key={group.disease}>
                    <TouchableOpacity 
                      style={styles.groupedListItem}
                      onPress={() => {
                        const newExpanded = new Set(expandedDiseases);
                        if (isExpanded) {
                          newExpanded.delete(group.disease);
                        } else {
                          newExpanded.add(group.disease);
                        }
                        setExpandedDiseases(newExpanded);
                      }}
                    >
                      <View style={[styles.severityIndicator, { backgroundColor: getSeverityColor(group.highestSeverity) }]} />
                      <View style={styles.listItemTextContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                          <MapPin size={14} color="#60a5fa" style={{ marginRight: 4 }} />
                          <Text style={styles.listItemTitle}>{group.disease}</Text>
                        </View>
                        <Text style={styles.listItemSubtitle}>
                          {group.countries.size} {group.countries.size === 1 ? 'country' : 'countries'} • {group.locations.length} {group.locations.length === 1 ? 'location' : 'locations'}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                          <Text style={styles.listItemCasesLabel}>Total Cases: </Text>
                          <Text style={styles.listItemCases}>{group.totalCases.toLocaleString()}</Text>
                        </View>
                      </View>
                      <View style={{ alignItems: 'flex-end', gap: 8 }}>
                        <Badge variant={group.highestSeverity === 'high' ? 'destructive' : group.highestSeverity === 'moderate' ? 'default' : 'secondary'}>
                          {group.highestSeverity?.toUpperCase()}
                        </Badge>
                        <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
                      </View>
                    </TouchableOpacity>
                    
                    {/* Expanded locations */}
                    {isExpanded && group.locations.map((outbreak: any) => (
                      <TouchableOpacity 
                        key={outbreak.id} 
                        style={styles.nestedListItem}
                        onPress={() => handleMarkerPress(outbreak)}
                      >
                        <View style={styles.nestedIndicator} />
                        <View style={styles.listItemTextContainer}>
                          <Text style={styles.nestedCountryText}>{outbreak.country}</Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                            <Text style={styles.listItemCasesLabel}>Cases: </Text>
                            <Text style={[styles.listItemCases, { fontSize: 14 }]}>
                              {(outbreak.totalCases || outbreak.cases || outbreak.outbreak_count || 0).toLocaleString()}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                );
              })
            )
          ) : (
            // Expanded view - show all locations
            filteredOutbreaks.length === 0 ? (
              <View style={styles.emptyState}>
                <MapPin size={48} color="#64748b" />
                <Text style={styles.emptyStateText}>No outbreaks found</Text>
                <Text style={styles.emptyStateSubtext}>
                  {searchQuery || selectedDisease 
                    ? 'Try adjusting your search or filter'
                    : 'No outbreak data available'}
                </Text>
              </View>
            ) : (
              filteredOutbreaks.map(outbreak => (
            <TouchableOpacity key={outbreak.id} style={styles.listItem} onPress={() => handleMarkerPress(outbreak)}>
              <View style={[styles.severityIndicator, { backgroundColor: getSeverityColor(outbreak.severity || 'low') }]} />
              <View style={styles.listItemTextContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <MapPin size={14} color="#60a5fa" style={{ marginRight: 4 }} />
                  <Text style={styles.listItemTitle}>{outbreak.disease}</Text>
                </View>
                <Text style={styles.listItemSubtitle}>
                  {outbreak.location?.name || outbreak.country}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.listItemCasesLabel}>Cases: </Text>
                    <Text style={styles.listItemCases}>
                      {(outbreak.totalCases || outbreak.cases || outbreak.outbreak_count || 0).toLocaleString()}
                    </Text>
                  </View>
                  {outbreak.outbreakCount > 1 && (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.listItemCasesLabel}>Records: </Text>
                      <Text style={[styles.listItemCases, { color: '#a78bfa' }]}>
                        {outbreak.outbreakCount}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <Badge variant={outbreak.severity === 'high' ? 'destructive' : outbreak.severity === 'moderate' ? 'default' : 'secondary'}>
                {outbreak.severity?.toUpperCase()}
              </Badge>
            </TouchableOpacity>
              ))
            )
          )}
        </ScrollView>
      </View>
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
    backgroundColor: '#1e293b',
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
    backgroundColor: '#1e293b',
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
    ...Platform.select({
      web: {
        boxShadow: '0 2px 3px rgba(0, 0, 0, 0.8)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 5,
      },
    }),
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
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  listCount: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  viewModeButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewModeButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 14,
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  diseaseFilterScroll: {
    marginBottom: 12,
  },
  diseaseFilterContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  diseaseFilterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#334155',
    borderWidth: 1,
    borderColor: '#475569',
  },
  diseaseFilterPillActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  diseaseFilterText: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '600',
  },
  diseaseFilterTextActive: {
    color: 'white',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#94a3b8',
  },
  emptyStateSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  groupedListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  nestedListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 12,
    paddingLeft: 24,
    borderRadius: 6,
    marginBottom: 4,
    marginLeft: 12,
    marginRight: 0,
  },
  nestedIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#60a5fa',
    marginRight: 12,
  },
  nestedCountryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  expandIcon: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: 'bold',
  },
});
