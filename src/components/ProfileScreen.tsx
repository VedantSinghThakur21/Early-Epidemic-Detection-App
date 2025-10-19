import React from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  User,
  Bell,
  Settings,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Mail,
  MapPin,
  Briefcase,
  Award,
  Activity
} from "lucide-react";

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

export default function ProfileScreen({ onNavigate, onLogout }: ProfileScreenProps) {
  const menuItems = [
    { icon: Bell, label: "Notifications", badge: "3", color: "text-blue-400" },
    { icon: Settings, label: "Settings", color: "text-slate-400" },
    { icon: Shield, label: "Privacy & Security", color: "text-emerald-400" },
    { icon: HelpCircle, label: "Help & Support", color: "text-cyan-400" },
  ];

  const stats = [
    { label: "Alerts Reviewed", value: "127", icon: Activity, color: "from-blue-600 to-cyan-600" },
    { label: "Reports Filed", value: "23", icon: Award, color: "from-cyan-600 to-blue-600" },
    { label: "Active Cases", value: "8", icon: Shield, color: "from-emerald-600 to-teal-600" },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900/90 via-cyan-900/90 to-slate-900/90 text-white p-4 pt-12 pb-8 backdrop-blur-xl border-b border-white/10">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-8 w-32 h-32 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-lg font-semibold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Profile
          </h1>

          {/* Profile Card */}
          <Card className="bg-white/5 border-white/20 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <Avatar className="w-16 h-16 border-2 border-white/20 shadow-xl">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white text-xl">
                      DK
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full border-2 border-slate-900 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-white">Dr. Kavita Desai</h2>
                  <p className="text-sm text-violet-200/80">Health Official</p>
                  <Badge className="mt-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs border-none">
                    Verified Account
                  </Badge>
                </div>
              </div>

              <Separator className="my-3 bg-white/10" />

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-blue-200/80">
                  <Mail className="h-4 w-4" />
                  <span>k.desai@health.gov.in</span>
                </div>
                <div className="flex items-center gap-2 text-blue-200/80">
                  <Briefcase className="h-4 w-4" />
                  <span>Mumbai Health Department</span>
                </div>
                <div className="flex items-center gap-2 text-blue-200/80">
                  <MapPin className="h-4 w-4" />
                  <span>Mumbai, Maharashtra</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={index}
                className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl hover:scale-105 transition-all duration-300"
              >
                <CardContent className="p-3 text-center">
                  <div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-slate-400 leading-tight">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Menu Items */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl overflow-hidden">
          <CardContent className="p-0">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const screenMap: Record<string, string> = {
                "Notifications": "notifications",
                "Settings": "settings",
                "Privacy & Security": "privacy",
                "Help & Support": "help"
              };
              return (
                <React.Fragment key={index}>
                  <button 
                    onClick={() => onNavigate(screenMap[item.label])}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-800/50 rounded-xl flex items-center justify-center group-hover:bg-slate-700/50 transition-all duration-300">
                        <Icon className={`h-5 w-5 ${item.color}`} />
                      </div>
                      <span className="text-sm text-slate-200 font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <Badge className="bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs border-none">
                          {item.badge}
                        </Badge>
                      )}
                      <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-slate-400 transition-colors" />
                    </div>
                  </button>
                  {index < menuItems.length - 1 && <Separator className="bg-slate-700/50" />}
                </React.Fragment>
              );
            })}
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">App Version</span>
              <span className="text-slate-200 font-medium">v1.0.0</span>
            </div>
            <Separator className="bg-slate-700/50" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Platform</span>
              <span className="text-blue-400 font-medium">React Web App</span>
            </div>
            <Separator className="bg-slate-700/50" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Last Sync</span>
              <span className="text-slate-200 font-medium">{new Date().toLocaleTimeString()}</span>
            </div>
            <Separator className="bg-slate-700/50" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Database Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-emerald-400 font-medium">Online</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button 
          onClick={onLogout}
          variant="outline"
          className="w-full bg-slate-800/50 border-slate-600/50 text-red-400 hover:bg-red-600/20 hover:border-red-500/50 transition-all duration-300"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>

        {/* Footer Info */}
        <div className="text-center py-4 space-y-1">
          <p className="text-xs text-slate-500">Sentinel AI - Epidemic Intelligence System</p>
          <p className="text-xs text-slate-600">React Web App • Project Phase 1</p>
          <p className="text-xs text-slate-700">Mobile-Optimized (393×852px)</p>
        </div>
      </div>
    </div>
  );
}