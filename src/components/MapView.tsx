import React, { useState, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl, TextInput, Platform } from 'react-native';
import { Badge } from './ui/badge';
import { MapPin, AlertTriangle, Search, X, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react-native';
import { useMapData } from '../hooks/useEpiWatch';
import { MapOutbreak } from '../types/epiwatch.types';

// Conditional import for React Native Maps (only works in native builds, not web)
let MapView: any = null;
let Marker: any = null;
let Callout: any = null;
let PROVIDER_DEFAULT: any = null;

interface MapViewProps {
  outbreaks?: MapOutbreak[]; // Made optional for backwards compatibility
}

export default function OutbreakMapView({ outbreaks: propOutbreaks }: MapViewProps) {
  // State declarations
  const [selectedOutbreak, setSelectedOutbreak] = useState<MapOutbreak | null>(null);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null);
  const [expandedDiseases, setExpandedDiseases] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grouped' | 'expanded'>('grouped');
  
  // Map ref for programmatic control
  const mapRef = useRef<any>(null);
  
  // Always use static fallback map with interactive markers
  // This works reliably across all platforms without API keys
  const isNativeMapsAvailable = false;
  
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
    
    // Animate to marker location if coordinates exist
    if (mapRef.current && outbreak.location?.lat && outbreak.location?.lng) {
      mapRef.current.animateToRegion({
        latitude: outbreak.location.lat,
        longitude: outbreak.location.lng,
        latitudeDelta: 10,
        longitudeDelta: 10,
      }, 1000);
    }
  };

  // Zoom controls
  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.animateCamera({ zoom: 1 }, { duration: 500 });
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.animateCamera({ zoom: -1 }, { duration: 500 });
    }
  };

  // Fit all markers in view
  const fitAllMarkers = () => {
    if (mapRef.current && filteredOutbreaks.length > 0) {
      const coordinates = filteredOutbreaks
        .filter(o => o.location?.lat && o.location?.lng)
        .map(o => ({
          latitude: o.location!.lat,
          longitude: o.location!.lng,
        }));
      
      if (coordinates.length > 0) {
        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    }
  };

  // Equirectangular projection for 2:1 world map image (no distortion assumptions)
  const projectToEquirectangular = (lat: number, lng: number) => {
    const x = (lng + 180) / 360; // 0..1 across width
    const y = (90 - lat) / 180; // 0..1 down height
    return { x: x * 100, y: y * 100 };
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
        
        {/* Interactive Map with React Native Maps (Native) or Static Map (Web) */}
        {isNativeMapsAvailable ? (
          // Native Maps for iOS/Android
        <MapView
          ref={mapRef}
          provider={PROVIDER_DEFAULT}
          style={styles.map}
          initialRegion={{
            latitude: 20,
            longitude: 20,
            latitudeDelta: 80,
            longitudeDelta: 80,
          }}
          mapType="standard"
          showsUserLocation={false}
          showsMyLocationButton={false}
          showsCompass={true}
          showsScale={true}
          zoomEnabled={true}
          scrollEnabled={true}
          pitchEnabled={false}
          rotateEnabled={false}
          loadingEnabled={true}
          onMapReady={fitAllMarkers}
        >
          {filteredOutbreaks.map((outbreak) => {
            // Skip if location data is not available
            if (!outbreak.location?.lat || !outbreak.location?.lng) {
              return null;
            }
            
            const color = getSeverityColor(outbreak.severity || 'low');
            const isSelected = selectedOutbreak?.id === outbreak.id;
            
            return (
              <Marker
                key={outbreak.id}
                coordinate={{
                  latitude: outbreak.location.lat,
                  longitude: outbreak.location.lng,
                }}
                pinColor={color}
                onPress={() => handleMarkerPress(outbreak)}
                title={outbreak.disease}
                description={`${outbreak.country} • ${(outbreak.totalCases || outbreak.cases || 0).toLocaleString()} cases`}
              >
                {/* Custom marker with pulsing effect */}
                <View style={styles.customMarkerContainer}>
                  {/* Pulsing outer ring for selected marker */}
                  {isSelected && (
                    <View 
                      style={[
                        styles.markerPulse, 
                        { borderColor: color }
                      ]} 
                    />
                  )}
                  {/* Marker dot */}
                  <View 
                    style={[
                      styles.markerDot, 
                      { 
                        backgroundColor: color,
                        width: isSelected ? 24 : 18,
                        height: isSelected ? 24 : 18,
                        borderRadius: isSelected ? 12 : 9,
                      }
                    ]} 
                  />
                </View>
                
                {/* Callout with outbreak details */}
                <Callout tooltip onPress={() => handleMarkerPress(outbreak)}>
                  <View style={styles.calloutContainer}>
                    <View style={styles.calloutHeader}>
                      <Text style={styles.calloutTitle}>{outbreak.disease}</Text>
                      <Badge 
                        variant={
                          outbreak.severity === 'high' 
                            ? 'destructive' 
                            : outbreak.severity === 'moderate' 
                              ? 'default' 
                              : 'secondary'
                        }
                      >
                        {outbreak.severity?.toUpperCase()}
                      </Badge>
                    </View>
                    <View style={styles.calloutDivider} />
                    <View style={styles.calloutBody}>
                      <View style={styles.calloutRow}>
                        <MapPin size={14} color="#60a5fa" />
                        <Text style={styles.calloutLocation}>
                          {outbreak.country}
                        </Text>
                      </View>
                      <View style={styles.calloutRow}>
                        <Text style={styles.calloutLabel}>Cases:</Text>
                        <Text style={styles.calloutValue}>
                          {(outbreak.totalCases || outbreak.cases || outbreak.outbreak_count || 0).toLocaleString()}
                        </Text>
                      </View>
                      {outbreak.outbreakCount > 1 && (
                        <View style={styles.calloutRow}>
                          <Text style={styles.calloutLabel}>Reports:</Text>
                          <Text style={styles.calloutValue}>{outbreak.outbreakCount}</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.calloutFooter}>
                      <Text style={styles.calloutHint}>Tap for more details</Text>
                    </View>
                  </View>
                </Callout>
              </Marker>
            );
          })}
        </MapView>
        ) : (
          // Fallback Web/Expo Go Map - Interactive Clickable Overlay
          <View style={styles.webMapContainer}>
            {/* World map background (2:1 equirectangular) - no API key needed */}
            <View style={styles.webMapAspectBox}>
              <Image
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/1024px-World_map_-_low_resolution.svg.png' }}
                style={styles.webMapImage}
                resizeMode="cover"
              />
              {/* Clickable markers overlay */}
              <View style={styles.markersOverlay}>
                {filteredOutbreaks.map((outbreak, index) => {
                  if (!outbreak.location?.lat || !outbreak.location?.lng) return null;
                  // Equirectangular projection to align with 2:1 image
                  const { x, y } = projectToEquirectangular(outbreak.location.lat, outbreak.location.lng);
                  const color = getSeverityColor(outbreak.severity || 'low');
                  const isSelected = selectedOutbreak?.id === outbreak.id;
                  return (
                    <TouchableOpacity
                      key={outbreak.id}
                      style={[
                        styles.webMarker,
                        {
                          left: `${x}%`,
                          top: `${y}%`,
                          backgroundColor: color,
                          transform: [
                            { translateX: -8 },
                            { translateY: -8 },
                            { scale: isSelected ? 1.5 : 1 },
                          ],
                          zIndex: isSelected ? 100 : index,
                        }
                      ]}
                      onPress={() => handleMarkerPress(outbreak)}
                    >
                      {isSelected && (
                        <View style={[styles.webMarkerPulse, { borderColor: color }]} />)
                      }
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            
            {/* Selected outbreak info card */}
            {selectedOutbreak && (
              <View style={styles.webInfoCard}>
                <TouchableOpacity 
                  style={styles.webInfoClose}
                  onPress={() => setSelectedOutbreak(null)}
                >
                  <X size={16} color="white" />
                </TouchableOpacity>
                <View style={styles.webInfoHeader}>
                  <Text style={styles.webInfoTitle}>{selectedOutbreak.disease}</Text>
                  <Badge 
                    variant={
                      selectedOutbreak.severity === 'high' 
                        ? 'destructive' 
                        : selectedOutbreak.severity === 'moderate' 
                          ? 'default' 
                          : 'secondary'
                    }
                  >
                    {selectedOutbreak.severity?.toUpperCase()}
                  </Badge>
                </View>
                <View style={styles.webInfoBody}>
                  <View style={styles.webInfoRow}>
                    <MapPin size={14} color="#60a5fa" />
                    <Text style={styles.webInfoLocation}>{selectedOutbreak.country}</Text>
                  </View>
                  <View style={styles.webInfoRow}>
                    <Text style={styles.webInfoLabel}>Cases:</Text>
                    <Text style={styles.webInfoValue}>
                      {((selectedOutbreak as any).totalCases || selectedOutbreak.cases || selectedOutbreak.outbreak_count || 0).toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            )}
            
          </View>
        )}

        {/* Zoom Controls (Native only) */}
        {isNativeMapsAvailable && (
        <View style={styles.zoomControls}>
          <TouchableOpacity 
            style={styles.zoomButton} 
            onPress={handleZoomIn}
            activeOpacity={0.7}
          >
            <ZoomIn size={20} color="white" />
          </TouchableOpacity>
          <View style={styles.zoomDivider} />
          <TouchableOpacity 
            style={styles.zoomButton} 
            onPress={handleZoomOut}
            activeOpacity={0.7}
          >
            <ZoomOut size={20} color="white" />
          </TouchableOpacity>
        </View>
        )}

        {/* Fit All Markers Button (Native only) */}
        {isNativeMapsAvailable && (
        <TouchableOpacity 
          style={styles.fitMarkersButton}
          onPress={fitAllMarkers}
          activeOpacity={0.7}
        >
          <MapPin size={16} color="white" />
          <Text style={styles.fitMarkersText}>Fit All</Text>
        </TouchableOpacity>
        )}

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
  // Callout styles
  calloutContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    minWidth: 220,
    maxWidth: 280,
    borderWidth: 2,
    borderColor: '#3b82f6',
    ...Platform.select({
      web: {
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
      },
    }),
  },
  calloutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    marginRight: 8,
  },
  calloutDivider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 8,
  },
  calloutBody: {
    gap: 8,
  },
  calloutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  calloutLocation: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  calloutLabel: {
    fontSize: 13,
    color: '#94a3b8',
  },
  calloutValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#60a5fa',
  },
  calloutFooter: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  calloutHint: {
    fontSize: 11,
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  // Zoom controls
  zoomControls: {
    position: 'absolute',
    top: 60,
    right: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#475569',
    zIndex: 10,
  },
  zoomButton: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomDivider: {
    height: 1,
    backgroundColor: '#475569',
  },
  fitMarkersButton: {
    position: 'absolute',
    top: 60,
    left: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    zIndex: 10,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  fitMarkersText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  // Web/Fallback map styles
  webMapContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  webMapImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  markersOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  webMapAspectBox: {
    width: '100%',
    aspectRatio: 2, // 2:1 world image
    overflow: 'hidden',
    borderRadius: 12,
  },
  webMarker: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
        cursor: 'pointer',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
        elevation: 5,
      },
    }),
  },
  webMarkerPulse: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    top: -8,
    left: -8,
    opacity: 0.5,
  },
  webInfoCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#3b82f6',
    ...Platform.select({
      web: {
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
      },
    }),
  },
  webInfoClose: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 6,
  },
  webInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  webInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    marginRight: 12,
  },
  webInfoBody: {
    gap: 10,
  },
  webInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  webInfoLocation: {
    fontSize: 15,
    color: '#94a3b8',
    fontWeight: '500',
  },
  webInfoLabel: {
    fontSize: 14,
    color: '#94a3b8',
  },
  webInfoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#60a5fa',
  },
  webMapBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#475569',
  },
  webMapBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  webMapBadgeHint: {
    color: '#94a3b8',
    fontSize: 10,
    fontStyle: 'italic',
  },
  // Simple world map visualization
  webMapTilesContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0a1929',
  },
  webMapBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0f1624',
    position: 'relative',
  },
  worldMapGrid: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  // Stylized continents with visible borders
  continentAfrica: {
    position: 'absolute',
    width: '15%',
    height: '30%',
    backgroundColor: '#1e3a5f',
    borderWidth: 1,
    borderColor: '#3b82f6',
    left: '48%',
    top: '42%',
    borderRadius: 20,
    opacity: 0.8,
  },
  continentAsia: {
    position: 'absolute',
    width: '30%',
    height: '35%',
    backgroundColor: '#1e3a5f',
    borderWidth: 1,
    borderColor: '#3b82f6',
    left: '55%',
    top: '25%',
    borderRadius: 30,
    opacity: 0.8,
  },
  continentEurope: {
    position: 'absolute',
    width: '12%',
    height: '18%',
    backgroundColor: '#1e3a5f',
    borderWidth: 1,
    borderColor: '#3b82f6',
    left: '48%',
    top: '28%',
    borderRadius: 15,
    opacity: 0.8,
  },
  continentAmericas: {
    position: 'absolute',
    width: '18%',
    height: '45%',
    backgroundColor: '#1e3a5f',
    borderWidth: 1,
    borderColor: '#3b82f6',
    left: '18%',
    top: '30%',
    borderRadius: 25,
    opacity: 0.8,
  },
});
