import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { 
  ArrowLeft, 
  Bell, 
  Globe, 
  Moon, 
  Smartphone,
  Download,
  Trash2,
  RefreshCw,
  Database
} from "lucide-react";

interface SettingsScreenProps {
  onBack: () => void;
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSync(new Date());
    }, 2000);
  };

  const handleExportData = () => {
    // Create a mock export
    const exportData = {
      exportDate: new Date().toISOString(),
      user: "Dr. Kavita Desai",
      totalAlerts: 127,
      countries: 8,
      dataRange: "Last 30 days"
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sentinel-data-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClearCache = () => {
    if (confirm('Are you sure you want to clear all cached data? This cannot be undone.')) {
      // Simulate cache clearing
      alert('Cache cleared successfully!');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900/90 via-cyan-900/90 to-slate-900/90 text-white p-4 pt-12 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/15 border border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Settings</h1>
            <p className="text-xs text-blue-200/80">Customize your experience</p>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        
        {/* Notifications */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-slate-200">
              <Bell className="h-4 w-4 text-blue-400" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm text-slate-200">Push Notifications</Label>
                <p className="text-xs text-slate-400">
                  {pushNotifications ? '✓ Enabled' : '✗ Disabled'}
                </p>
              </div>
              <Switch 
                checked={pushNotifications} 
                onCheckedChange={setPushNotifications}
              />
            </div>
            
            <Separator className="bg-slate-700/50" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm text-slate-200">Email Alerts</Label>
                <p className="text-xs text-slate-400">
                  {emailAlerts ? '✓ Enabled' : '✗ Disabled'}
                </p>
              </div>
              <Switch 
                checked={emailAlerts} 
                onCheckedChange={setEmailAlerts}
              />
            </div>
            
            <Separator className="bg-slate-700/50" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm text-slate-200">Critical Alerts Only</Label>
                <p className="text-xs text-slate-400">
                  {criticalOnly ? '⚠ High-severity only' : '📢 All alerts'}
                </p>
              </div>
              <Switch 
                checked={criticalOnly} 
                onCheckedChange={setCriticalOnly}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-slate-200">
              <Moon className="h-4 w-4 text-blue-400" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm text-slate-200">Dark Mode</Label>
                <p className="text-xs text-slate-400">
                  {darkMode ? 'Currently using dark theme' : 'Currently using light theme'}
                </p>
              </div>
              <Switch 
                checked={darkMode} 
                onCheckedChange={setDarkMode}
              />
            </div>
            {!darkMode && (
              <div className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2">
                Light mode is experimental
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data & Sync */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-slate-200">
              <Database className="h-4 w-4 text-blue-400" />
              Data & Sync
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm text-slate-200">Auto Sync</Label>
                <p className="text-xs text-slate-400">
                  {autoSync ? '🔄 Auto syncing every 5 min' : '⏸ Manual sync only'}
                </p>
              </div>
              <Switch 
                checked={autoSync} 
                onCheckedChange={setAutoSync}
              />
            </div>
            
            <Separator className="bg-slate-700/50" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm text-slate-200">Offline Mode</Label>
                <p className="text-xs text-slate-400">
                  {offlineMode ? '📴 Offline - using cached data' : '🌐 Online'}
                </p>
              </div>
              <Switch 
                checked={offlineMode} 
                onCheckedChange={setOfflineMode}
              />
            </div>
            
            {offlineMode && (
              <div className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2">
                ⚠ Some features may be limited in offline mode
              </div>
            )}
            
            <Separator className="bg-slate-700/50" />
            
            <Button
              variant="outline"
              onClick={handleSync}
              disabled={syncing}
              className="w-full bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-blue-500/50 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync Now'}
            </Button>
            {!syncing && (
              <p className="text-xs text-slate-500 text-center mt-2">
                Last synced: {lastSync.toLocaleTimeString()}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Language & Region */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-slate-200">
              <Globe className="h-4 w-4 text-blue-400" />
              Language & Region
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-slate-200">Language</Label>
              <span className="text-sm text-slate-400">English (US)</span>
            </div>
            
            <Separator className="bg-slate-700/50" />
            
            <div className="flex items-center justify-between">
              <Label className="text-sm text-slate-200">Time Zone</Label>
              <span className="text-sm text-slate-400">IST (GMT+5:30)</span>
            </div>
          </CardContent>
        </Card>

        {/* Storage */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-slate-200">
              <Smartphone className="h-4 w-4 text-blue-400" />
              Storage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">Data cached</span>
              <span className="text-slate-400">245 MB</span>
            </div>
            
            <Separator className="bg-slate-700/50" />
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">Documents</span>
              <span className="text-slate-400">12 MB</span>
            </div>
            
            <Separator className="bg-slate-700/50" />
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportData}
                className="bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-blue-500/50"
              >
                <Download className="h-4 w-4 mr-1" />
                Export Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearCache}
                className="bg-slate-800/50 border-slate-600/50 text-red-400 hover:bg-red-600/20 hover:border-red-500/50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear Cache
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl">
          <CardContent className="p-4 text-center space-y-1">
            <p className="text-xs text-slate-400">Sentinel AI Dashboard</p>
            <p className="text-xs text-slate-500">Version 2.4.1 (Build 2401)</p>
            <p className="text-xs text-slate-600">© 2025 Health Intelligence Network</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
