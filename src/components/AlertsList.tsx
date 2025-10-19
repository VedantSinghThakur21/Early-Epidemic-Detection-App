import React, { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Filter, Clock, MapPin, AlertTriangle } from "lucide-react";

interface AlertItem {
  id: number;
  title: string;
  description: string;
  severity: string;
  time: string;
  location: string;
}

interface AlertsListProps {
  alerts: AlertItem[];
  onAlertClick?: (alertId: number) => void;
}

export default function AlertsList({ alerts, onAlertClick }: AlertsListProps) {
  const [filterSeverity, setFilterSeverity] = useState("all");

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = filterSeverity === "all" || alert.severity === filterSeverity;
    return matchesSeverity;
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case "moderate":
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case "low":
        return <Clock className="h-4 w-4 text-emerald-400" />;
      default:
        return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  const getBadgeVariant = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "moderate":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Enhanced Filter */}
      <div className="flex gap-2">
        <Button
          variant={filterSeverity === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterSeverity("all")}
          className={`flex-1 transition-all duration-300 hover:scale-105 ${
            filterSeverity === "all" 
              ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25" 
              : "bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-blue-500/50 backdrop-blur-sm"
          }`}
        >
          All
        </Button>
        <Button
          variant={filterSeverity === "high" ? "destructive" : "outline"}
          size="sm"
          onClick={() => setFilterSeverity("high")}
          className={`flex-1 transition-all duration-300 hover:scale-105 ${
            filterSeverity === "high" 
              ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-500/25" 
              : "bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-red-500/50 backdrop-blur-sm"
          }`}
        >
          Critical
        </Button>
        <Button
          variant={filterSeverity === "moderate" ? "secondary" : "outline"}
          size="sm"
          onClick={() => setFilterSeverity("moderate")}
          className={`flex-1 transition-all duration-300 hover:scale-105 ${
            filterSeverity === "moderate" 
              ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25" 
              : "bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-amber-500/50 backdrop-blur-sm"
          }`}
        >
          Moderate
        </Button>
      </div>

      {/* Alerts List */}
      <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-slate-700/50">
              <Filter className="h-8 w-8 text-slate-500" />
            </div>
            <p className="font-medium">No alerts match your criteria</p>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your filter settings</p>
          </div>
        ) : (
          filteredAlerts.map((alert, index) => {
            const severityConfig = {
              high: {
                borderColor: "border-l-red-500",
                bgColor: "bg-gradient-to-r from-red-900/20 via-slate-800/50 to-slate-800/30",
                iconBg: "bg-red-500/20",
                iconColor: "text-red-400",
                glowColor: "shadow-red-500/10"
              },
              moderate: {
                borderColor: "border-l-amber-500",
                bgColor: "bg-gradient-to-r from-amber-900/20 via-slate-800/50 to-slate-800/30",
                iconBg: "bg-amber-500/20",
                iconColor: "text-amber-400",
                glowColor: "shadow-amber-500/10"
              },
              low: {
                borderColor: "border-l-emerald-500",
                bgColor: "bg-gradient-to-r from-emerald-900/20 via-slate-800/50 to-slate-800/30",
                iconBg: "bg-emerald-500/20",
                iconColor: "text-emerald-400",
                glowColor: "shadow-emerald-500/10"
              }
            };

            const config = severityConfig[alert.severity as keyof typeof severityConfig] || severityConfig.low;

            return (
              <Alert 
                key={alert.id} 
                className={`border-l-4 ${config.borderColor} ${config.bgColor} border border-slate-700/50 backdrop-blur-sm hover:bg-slate-700/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${config.glowColor} animate-in slide-in-from-left-3 fade-in duration-500`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <AlertDescription>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 ${config.iconBg} rounded-lg flex items-center justify-center backdrop-blur-sm`}>
                          {getSeverityIcon(alert.severity)}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-slate-100">{alert.title}</p>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{alert.description}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={getBadgeVariant(alert.severity)}
                        className={`text-xs ml-2 ${
                          alert.severity === 'high' ? 'bg-gradient-to-r from-red-600 to-red-700 text-white border-red-500/50' :
                          alert.severity === 'moderate' ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-500/50' :
                          'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-emerald-500/50'
                        } shadow-lg backdrop-blur-sm`}
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-400 flex-1 min-w-0">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{alert.location}</span>
                        {(alert as any).region && (
                          <span className="text-[10px] bg-slate-700/50 px-1.5 py-0.5 rounded text-slate-400 whitespace-nowrap">
                            {(alert as any).region}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 ml-2 flex-shrink-0">
                        <Clock className="h-3 w-3" />
                        <span className="whitespace-nowrap">{alert.time}</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onAlertClick?.(alert.id)}
                      className="w-full bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-600 hover:text-white hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 backdrop-blur-sm"
                    >
                      Investigate Alert
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            );
          })
        )}
      </div>
    </div>
  );
}