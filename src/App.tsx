import React, { useState } from "react";
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
} from "lucide-react";

// Import components
import MapView from "./components/MapView";
import AlertsList from "./components/AlertsList";
import TrendChart from "./components/TrendChart";
import AlertDetailScreen from "./components/AlertDetailScreen";
import ProfileScreen from "./components/ProfileScreen";
import BottomNavigation, { NavTab } from "./components/BottomNavigation";
import LoginScreen from "./components/LoginScreen";
import NotificationsScreen from "./components/NotificationsScreen";
import SettingsScreen from "./components/SettingsScreen";
import PrivacySecurityScreen from "./components/PrivacySecurityScreen";
import HelpSupportScreen from "./components/HelpSupportScreen";
import QuickStartGuide from "./components/QuickStartGuide";

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
  | "login" 
  | "dashboard" 
  | "alertDetail" 
  | "notifications" 
  | "settings" 
  | "privacy" 
  | "help"
  | "quickStart";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("login");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>("alerts");
  const [selectedAlert, setSelectedAlert] = useState<typeof MOCK_ALERTS[0] | null>(null);
  const [showQuickStart, setShowQuickStart] = useState(false);
  
  const totalCases = MOCK_OUTBREAKS.reduce((sum, outbreak) => sum + outbreak.cases, 0);
  const highRiskOutbreaks = MOCK_OUTBREAKS.filter(outbreak => outbreak.severity === "high").length;
  const activeAlerts = MOCK_ALERTS.filter(alert => alert.severity === "high" || alert.severity === "moderate").length;
  const countriesMonitored = new Set(MOCK_OUTBREAKS.map(o => o.location.country)).size;
  const regionsActive = new Set(MOCK_OUTBREAKS.map(o => o.location.region)).size;

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentScreen("dashboard");
    // Show quick start guide on first login
    setShowQuickStart(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentScreen("login");
    setActiveTab("alerts");
    setSelectedAlert(null);
    setShowQuickStart(false);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setLastUpdated(new Date());
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleAlertClick = (alertId: number) => {
    const alert = MOCK_ALERTS.find(a => a.id === alertId);
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

  // Show login screen if not authenticated
  if (!isAuthenticated || currentScreen === "login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-[393px] h-[852px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden rounded-[32px] shadow-2xl border border-slate-700/50 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-600/10 pointer-events-none"></div>
          <div className="h-full relative z-10">
            <LoginScreen onLogin={handleLogin} />
          </div>
        </div>
      </div>
    );
  }

  // Show profile sub-screens
  if (currentScreen === "notifications") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-[393px] h-[852px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden rounded-[32px] shadow-2xl border border-slate-700/50 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-600/10 pointer-events-none"></div>
          <div className="h-full flex flex-col relative z-10">
            <div className="flex-1 overflow-hidden">
              <NotificationsScreen 
                onBack={handleBackToProfile}
                onViewAlert={(alertId) => {
                  const alert = MOCK_ALERTS.find(a => a.id === alertId);
                  if (alert) {
                    setSelectedAlert(alert);
                    setCurrentScreen("alertDetail");
                    setActiveTab("alerts");
                  }
                }}
              />
            </div>
            <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === "settings") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-[393px] h-[852px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden rounded-[32px] shadow-2xl border border-slate-700/50 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-600/10 pointer-events-none"></div>
          <div className="h-full flex flex-col relative z-10">
            <div className="flex-1 overflow-hidden">
              <SettingsScreen onBack={handleBackToProfile} />
            </div>
            <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === "privacy") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-[393px] h-[852px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden rounded-[32px] shadow-2xl border border-slate-700/50 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-600/10 pointer-events-none"></div>
          <div className="h-full flex flex-col relative z-10">
            <div className="flex-1 overflow-hidden">
              <PrivacySecurityScreen onBack={handleBackToProfile} />
            </div>
            <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === "help") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-[393px] h-[852px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden rounded-[32px] shadow-2xl border border-slate-700/50 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-600/10 pointer-events-none"></div>
          <div className="h-full flex flex-col relative z-10">
            <div className="flex-1 overflow-hidden">
              <HelpSupportScreen 
                onBack={handleBackToProfile}
                onShowQuickStart={handleShowQuickStart}
              />
            </div>
            <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
          {showQuickStart && <QuickStartGuide onClose={() => setShowQuickStart(false)} />}
        </div>
      </div>
    );
  }

  if (currentScreen === "quickStart") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-[393px] h-[852px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden rounded-[32px] shadow-2xl border border-slate-700/50 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-600/10 pointer-events-none"></div>
          <div className="h-full flex flex-col relative z-10">
            <div className="flex-1 overflow-hidden">
              <QuickStartGuide onBack={handleBackToProfile} />
            </div>
            <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
        </div>
      </div>
    );
  }

  // Show Alert Detail Screen
  if (currentScreen === "alertDetail" && selectedAlert) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-[393px] h-[852px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden rounded-[32px] shadow-2xl border border-slate-700/50 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-600/10 pointer-events-none"></div>
          <div className="h-full flex flex-col relative z-10">
            <div className="flex-1 overflow-hidden">
              <AlertDetailScreen 
                alert={selectedAlert}
                onBack={handleBackFromDetail}
                onViewOnMap={handleViewOnMap}
              />
            </div>
            <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-[393px] h-[852px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden rounded-[32px] shadow-2xl border border-slate-700/50 backdrop-blur-xl">
        
        {/* Quick Start Guide Overlay */}
        {showQuickStart && <QuickStartGuide onClose={() => setShowQuickStart(false)} />}
        
        {/* Dynamic Light Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-600/10 pointer-events-none"></div>
        
        {/* Header */}
        <div className="relative bg-gradient-to-br from-blue-900/90 via-cyan-900/90 to-slate-900/90 text-white p-4 pt-12 backdrop-blur-xl border-b border-white/10">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-8 w-32 h-32 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-4 right-8 w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-2xl animate-pulse delay-1000"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 backdrop-blur-sm border border-white/20">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="font-semibold text-lg bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">Sentinel AI</h1>
                  <p className="text-xs text-blue-200/80 font-medium">Global Epidemic Monitoring</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/15 border border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
                <button 
                  onClick={() => {
                    setCurrentScreen("notifications");
                    setActiveTab("profile");
                  }}
                  className="relative"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all">
                    <Bell className="h-4 w-4" />
                    {activeAlerts > 0 && (
                      <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-lg animate-pulse">
                        {activeAlerts}
                      </div>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Enhanced Stats - Global Coverage */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <Card className="bg-white/5 border-white/20 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                <CardContent className="p-2 text-center">
                  <div className="text-white text-lg font-bold bg-gradient-to-br from-white to-blue-200 bg-clip-text text-transparent">{totalCases.toLocaleString()}</div>
                  <div className="text-blue-200/70 text-[10px] font-medium leading-tight">Cases</div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/20 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20">
                <CardContent className="p-2 text-center">
                  <div className="text-cyan-300 text-lg font-bold">{countriesMonitored}</div>
                  <div className="text-blue-200/70 text-[10px] font-medium leading-tight">Countries</div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/20 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20">
                <CardContent className="p-2 text-center">
                  <div className="text-red-300 text-lg font-bold">{highRiskOutbreaks}</div>
                  <div className="text-blue-200/70 text-[10px] font-medium leading-tight">Critical</div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/20 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20">
                <CardContent className="p-2 text-center">
                  <div className="text-emerald-300 text-lg font-bold">{regionsActive}</div>
                  <div className="text-blue-200/70 text-[10px] font-medium leading-tight">Regions</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-xs text-blue-200/70 text-center flex items-center justify-center gap-2 bg-white/5 rounded-full py-2 px-3 backdrop-blur-sm border border-white/10">
              <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
              <span className="font-medium">Global Network • {MOCK_OUTBREAKS.length} Outbreaks Tracked</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 relative" style={{ height: 'calc(100% - 240px - 64px)' }}>
          <div className="h-full p-4 overflow-hidden">
            {activeTab === "alerts" && (
              <div className="h-full">
                <AlertsList 
                  alerts={MOCK_ALERTS} 
                  onAlertClick={handleAlertClick}
                />
              </div>
            )}

            {activeTab === "map" && (
              <div className="h-full">
                <MapView outbreaks={MOCK_OUTBREAKS} />
              </div>
            )}

            {activeTab === "trends" && (
              <div className="h-full">
                <TrendChart data={MOCK_TREND_DATA} />
              </div>
            )}

            {activeTab === "profile" && (
              <div className="h-full overflow-hidden">
                <ProfileScreen 
                  onNavigate={handleProfileNavigate}
                  onLogout={handleLogout}
                />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  );
}