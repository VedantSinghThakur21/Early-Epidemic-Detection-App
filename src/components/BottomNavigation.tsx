import React from "react";
import { Shield, Globe, TrendingUp, User } from "lucide-react";

export type NavTab = "alerts" | "map" | "trends" | "profile";

interface BottomNavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: "alerts" as NavTab, label: "Alerts", icon: Shield },
    { id: "map" as NavTab, label: "Map", icon: Globe },
    { id: "trends" as NavTab, label: "Trends", icon: TrendingUp },
    { id: "profile" as NavTab, label: "Profile", icon: User },
  ];

  return (
    <div className="bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 border-t border-white/10 backdrop-blur-xl">
      <div className="grid grid-cols-4 h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 relative group ${
                isActive ? "text-white" : "text-slate-400 hover:text-slate-300"
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-lg shadow-blue-500/50"></div>
              )}
              
              {/* Icon with background */}
              <div className={`relative transition-all duration-300 ${
                isActive ? "scale-110" : "group-hover:scale-105"
              }`}>
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur-lg opacity-30 animate-pulse"></div>
                )}
                <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/25" 
                    : "bg-transparent group-hover:bg-slate-700/30"
                }`}>
                  <Icon className={`h-5 w-5 transition-all duration-300 ${
                    isActive ? "text-white" : "text-slate-400 group-hover:text-slate-300"
                  }`} />
                </div>
              </div>
              
              {/* Label */}
              <span className={`text-xs font-medium transition-all duration-300 ${
                isActive ? "text-white" : "text-slate-400 group-hover:text-slate-300"
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
