
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
// Now using React Native versions of these components
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { 
  MapPin, 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Bell,
  RefreshCw,
  Globe,
  Shield,
  Brain
} from "lucide-react-native";

// Import components
import MapView from "./components/MapView";
import AlertsList from "./components/AlertsList";
import TrendChart from "./components/TrendChart";
import AlertDetailScreen from "./components/AlertDetailScreen";
import ProfileScreen from "./components/ProfileScreen";
import BottomNavigation, { NavTab } from "./components/BottomNavigation";
import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";
import NotificationsScreen from "./components/NotificationsScreen";
import SettingsScreen from "./components/SettingsScreen";
import PrivacySecurityScreen from "./components/PrivacySecurityScreen";
import HelpSupportScreen from "./components/HelpSupportScreen";
import QuickStartGuide from "./components/QuickStartGuide";

// Import API hooks
import { useDashboardStats, useMapData, useAlerts } from "./hooks/useEpiWatch";
import epiwatchService from "./services/epiwatchService";

// Import Auth
import { AuthProvider, useAuth } from "./contexts/AuthContext";


// Mock data - Global Multi-Country Dataset
const MOCK_OUTBREAKS = [
  {
    id: 1,
    disease: "Dengue Fever",
    location: { lat: 19.0760, lng: 72.8777, name: "Mumbai, India", country: "India", region: "Asia" },
    severity: "high",
    cases: 2847,
    date: "2025-01-18"
  },
  {
    id: 2,
    disease: "Malaria",
    location: { lat: -1.2921, lng: 36.8219, name: "Nairobi, Kenya", country: "Kenya", region: "Africa" },
    severity: "high", 
    cases: 1523,
    date: "2025-01-17"
  },
  {
    id: 3,
    disease: "Cholera",
    location: { lat: 23.8103, lng: 90.4125, name: "Dhaka, Bangladesh", country: "Bangladesh", region: "Asia" },
    severity: "moderate",
    cases: 856,
    date: "2025-01-16"
  },
  {
    id: 4,
    disease: "Influenza A",
    location: { lat: 40.7128, lng: -74.0060, name: "New York, USA", country: "USA", region: "North America" },
    severity: "low",
    cases: 1247,
    date: "2025-01-15"
  },
  {
    id: 5,
    disease: "Yellow Fever",
    location: { lat: -23.5505, lng: -46.6333, name: "São Paulo, Brazil", country: "Brazil", region: "South America" },
    severity: "moderate",
    cases: 673,
    date: "2025-01-14"
  },
  {
    id: 6,
    disease: "Typhoid",
    location: { lat: 1.3521, lng: 103.8198, name: "Singapore", country: "Singapore", region: "Asia" },
    severity: "low",
    cases: 234,
    date: "2025-01-13"
  },
  {
    id: 7,
    disease: "Measles",
    location: { lat: 48.8566, lng: 2.3522, name: "Paris, France", country: "France", region: "Europe" },
    severity: "moderate",
    cases: 512,
    date: "2025-01-12"
  },
  {
    id: 8,
    disease: "Zika Virus",
    location: { lat: -33.8688, lng: 151.2093, name: "Sydney, Australia", country: "Australia", region: "Oceania" },
    severity: "low",
    cases: 189,
    date: "2025-01-11"
  }
];

const MOCK_ALERTS = [
  {
    id: 1,
    title: "Dengue Fever Surge Detected",
    description: "Unusual spike in dengue cases reported across Mumbai region. Health authorities alerted.",
    severity: "high",
    time: "47 minutes ago",
    location: "Mumbai, India",
    country: "India",
    region: "Asia"
  },
  {
    id: 2,
    title: "Malaria Cases Increasing",
    description: "Rising malaria cases detected in Nairobi area with vector activity above normal levels.",
    severity: "high",
    time: "1.2 hours ago", 
    location: "Nairobi, Kenya",
    country: "Kenya",
    region: "Africa"
  },
  {
    id: 3,
    title: "Cholera Warning Signal",
    description: "Early indicators suggest potential cholera outbreak risk in Dhaka region.",
    severity: "moderate",
    time: "3 hours ago",
    location: "Dhaka, Bangladesh",
    country: "Bangladesh",
    region: "Asia"
  },
  {
    id: 4,
    title: "Yellow Fever Alert",
    description: "Yellow fever cases rising in São Paulo. Vector control measures initiated.",
    severity: "moderate",
    time: "8 hours ago",
    location: "São Paulo, Brazil",
    country: "Brazil",
    region: "South America"
  },
  {
    id: 5,
    title: "Measles Outbreak in Europe",
    description: "Multiple measles cases reported in Paris metropolitan area.",
    severity: "moderate",
    time: "12 hours ago",
    location: "Paris, France",
    country: "France",
    region: "Europe"
  }
];

const MOCK_TREND_DATA = [
  { week: "Week 1", dengue: 120, malaria: 85, cholera: 43, influenza: 67, yellowFever: 32, measles: 28 },
  { week: "Week 2", dengue: 145, malaria: 92, cholera: 38, influenza: 71, yellowFever: 45, measles: 35 },
  { week: "Week 3", dengue: 178, malaria: 108, cholera: 52, influenza: 84, yellowFever: 56, measles: 48 },
  { week: "Week 4", dengue: 234, malaria: 127, cholera: 61, influenza: 92, yellowFever: 67, measles: 62 },
  { week: "Week 5", dengue: 198, malaria: 115, cholera: 45, influenza: 88, yellowFever: 54, measles: 51 },
  { week: "Week 6", dengue: 287, malaria: 134, cholera: 67, influenza: 103, yellowFever: 73, measles: 68 }
];

type ScreenType = 
  | "dashboard" 
  | "alertDetail" 
  | "notifications" 
  | "settings" 
  | "privacy" 
  | "help"
  | "quickStart"
  | "register";

function MainApp() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  // Fetch real-time data from API
  const { data: dashboardStats, loading: statsLoading, refetch: refetchStats } = useDashboardStats();
  const { data: mapOutbreaks, loading: mapLoading, refetch: refetchMap } = useMapData();
  const { data: apiAlerts, loading: alertsLoading, refetch: refetchAlerts } = useAlerts({ limit: 20 });
  
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("dashboard");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>("alerts");
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  
  // Wake up API on mount
  useEffect(() => {
    const wakeUpApi = async () => {
      console.log('[App] Waking up EpiWatch API...');
      await epiwatchService.wakeUpApi();
      console.log('[App] API is ready!');
    };
    
    if (isAuthenticated) {
      wakeUpApi();
    }
  }, [isAuthenticated]);
  
  // Calculate stats from real API data
  const totalCases = dashboardStats?.total_outbreaks || 0;
  const highRiskOutbreaks = mapOutbreaks?.filter(outbreak => outbreak.severity === "high" || outbreak.severity === "critical").length || 0;
  const activeAlerts = apiAlerts?.filter(alert => alert.severity === "high" || alert.severity === "critical" || alert.severity === "medium").length || 0;
  const countriesMonitored = dashboardStats?.affected_countries || 0;
  const activeDiseases = dashboardStats?.active_diseases || 0;

  const handleLogout = () => {
    setCurrentScreen("dashboard");
    setActiveTab("alerts");
    setSelectedAlert(null);
    setShowQuickStart(false);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setLastUpdated(new Date());
    
    // Refetch all data
    Promise.all([
      refetchStats(),
      refetchMap(),
      refetchAlerts()
    ]).finally(() => {
      setIsRefreshing(false);
    });
  };

  const handleAlertClick = (alertId: string | number) => {
    const alert = apiAlerts?.find(a => String(a.id) === String(alertId));
    if (alert) {
      setSelectedAlert(alert);
      setCurrentScreen("alertDetail");
    }
  };

  const handleBackFromDetail = () => {
    setSelectedAlert(null);
    setCurrentScreen("dashboard");
  };

  const handleViewOnMap = () => {
    setSelectedAlert(null);
    setCurrentScreen("dashboard");
    setActiveTab("map");
  };

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    setCurrentScreen("dashboard");
    setSelectedAlert(null);
  };

  const handleProfileNavigate = (screen: string) => {
    const screenMap: Record<string, ScreenType> = {
      "notifications": "notifications",
      "settings": "settings",
      "privacy": "privacy",
      "help": "help"
    };
    setCurrentScreen(screenMap[screen] || "dashboard");
  };

  const handleBackToProfile = () => {
    setCurrentScreen("dashboard");
    setActiveTab("profile");
  };

  const handleShowQuickStart = () => {
    setShowQuickStart(true);
  };

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={[styles.loginContainer, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={{ color: 'white', marginTop: 16 }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    if (showRegister) {
      return (
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" />
          <View style={styles.loginContainer}>
            <RegisterScreen onBackToLogin={() => setShowRegister(false)} />
          </View>
        </SafeAreaView>
      );
    }
    
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loginContainer}>
          <LoginScreen onNavigateToRegister={() => setShowRegister(true)} />
        </View>
      </SafeAreaView>
    );
  }

  // Show profile sub-screens
  if (currentScreen === "notifications") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.mainContainer}>
          <View style={{flex: 1}}>
            <NotificationsScreen 
              onBack={handleBackToProfile}
              onViewAlert={(alertId) => {
                const alert = apiAlerts?.find(a => a.id === alertId);
                if (alert) {
                  setSelectedAlert(alert);
                  setCurrentScreen("alertDetail");
                  setActiveTab("alerts");
                }
              }}
            />
          </View>
          <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
        </View>
      </SafeAreaView>
    );
  }

  if (currentScreen === "settings") {
    return (
      <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.mainContainer}>
        <View style={{flex: 1}}>
          <SettingsScreen onBack={handleBackToProfile} />
        </View>
        <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      </View>
    </SafeAreaView>
    );
  }

  if (currentScreen === "privacy") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.mainContainer}>
          <View style={{flex: 1}}>
            <PrivacySecurityScreen onBack={handleBackToProfile} />
          </View>
          <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
        </View>
      </SafeAreaView>
    );
  }

  if (currentScreen === "help") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.mainContainer}>
          <View style={{flex: 1}}>
            <HelpSupportScreen 
              onBack={handleBackToProfile}
              onShowQuickStart={handleShowQuickStart}
            />
          </View>
          <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
          {showQuickStart && <QuickStartGuide onClose={() => setShowQuickStart(false)} />}
        </View>
      </SafeAreaView>
    );
  }

  if (currentScreen === "quickStart") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.mainContainer}>
          <View style={{flex: 1}}>
            <QuickStartGuide onClose={handleBackToProfile} />
          </View>
          <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
        </View>
      </SafeAreaView>
    );
  }

  // Show Alert Detail Screen
  if (currentScreen === "alertDetail" && selectedAlert) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.mainContainer}>
          <View style={{flex: 1}}>
            <AlertDetailScreen 
              alert={selectedAlert}
              onBack={handleBackFromDetail}
              onViewOnMap={handleViewOnMap}
            />
          </View>
          <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
        </View>
      </SafeAreaView>
    );
  }

  // Main Dashboard
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.mainContainer}>
        
        {/* Quick Start Guide Overlay */}
        {showQuickStart && <QuickStartGuide onClose={() => setShowQuickStart(false)} />}
        
        {/* Header */}
        <View style={styles.header}>
          <View style={{zIndex: 10}}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16}}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                <View style={styles.brainIconContainer}>
                  <Brain color="white" size={20} />
                </View>
                <View>
                  <Text style={styles.headerTitle}>Sentinel AI</Text>
                  <Text style={styles.headerSubtitle}>Global Epidemic Monitoring</Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                <TouchableOpacity 
                  style={styles.refreshButton}
                  onPress={handleRefresh}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? <ActivityIndicator size="small" color="#ffffff" /> : <RefreshCw size={16} color="white" />}
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => {
                    setCurrentScreen("notifications");
                    setActiveTab("profile");
                  }}
                  style={styles.notificationButton}
                >
                  <Bell size={16} color="white" />
                  {activeAlerts > 0 && (
                    <View style={styles.notificationBadge}>
                      <Text style={styles.notificationBadgeText}>{activeAlerts}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Enhanced Stats - Global Coverage */}
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16}}>
              <Card style={styles.statCard}>
                <CardContent style={styles.statCardContent}>
                  <Text style={styles.statValue}>{totalCases.toLocaleString()}</Text>
                  <Text style={styles.statLabel}>Outbreaks</Text>
                </CardContent>
              </Card>
              <Card style={styles.statCard}>
                <CardContent style={styles.statCardContent}>
                  <Text style={styles.statValueCyan}>{countriesMonitored}</Text>
                  <Text style={styles.statLabel}>Countries</Text>
                </CardContent>
              </Card>
              <Card style={styles.statCard}>
                <CardContent style={styles.statCardContent}>
                  <Text style={styles.statValueRed}>{highRiskOutbreaks}</Text>
                  <Text style={styles.statLabel}>Critical</Text>
                </CardContent>
              </Card>
              <Card style={styles.statCard}>
                <CardContent style={styles.statCardContent}>
                  <Text style={styles.statValueGreen}>{activeDiseases}</Text>
                  <Text style={styles.statLabel}>Diseases</Text>
                </CardContent>
              </Card>
            </View>
            
            <View style={styles.networkStatus}>
              <View style={styles.networkStatusIndicator}></View>
              <Text style={styles.networkStatusText}>
                Global Network • {mapOutbreaks?.length || 0} Outbreaks Tracked
                {statsLoading && ' • Loading...'}
              </Text>
            </View>
          </View>
        </View>

        {/* Main Content Area */}
        <ScrollView 
          style={{flex: 1}}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
          }
        >
          <View style={{padding: 16}}>
            {activeTab === "alerts" && (
              <AlertsList 
                onAlertClick={handleAlertClick}
              />
            )}

            {activeTab === "map" && (
              <MapView />
            )}

            {activeTab === "trends" && (
              <TrendChart />
            )}

            {activeTab === "profile" && (
              <ProfileScreen 
                onNavigate={handleProfileNavigate}
                onLogout={handleLogout}
              />
            )}
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  loginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#0f172a',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#1e293b',
  },
  header: {
    backgroundColor: '#1a202c',
    padding: 16,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  brainIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    flex: 1,
    marginHorizontal: 4,
  },
  statCardContent: {
    padding: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  statValueCyan: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#67e8f9',
  },
  statValueRed: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f87171',
  },
  statValueGreen: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4ade80',
  },
  statLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '500',
    lineHeight: 12,
  },
  networkStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 9999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  networkStatusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
  },

  networkStatusText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
  }
});

// Wrap MainApp with AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
