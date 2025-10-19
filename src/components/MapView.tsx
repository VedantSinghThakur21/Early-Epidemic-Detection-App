import React, { useState } from "react";
import { Badge } from "./ui/badge";
import { MapPin, TrendingUp, Calendar, Globe2 } from "lucide-react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";

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

// GeoJSON URL for world map
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function MapView({ outbreaks }: MapViewProps) {
  const [selectedOutbreak, setSelectedOutbreak] = useState<number | null>(null);
  const [tooltipData, setTooltipData] = useState<typeof outbreaks[0] | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return {
          fill: "#ef4444",
          glow: "rgba(239, 68, 68, 0.4)",
          gradient: "from-red-500 to-pink-600",
          shadow: "shadow-red-500/50"
        };
      case "moderate":
        return {
          fill: "#f97316",
          glow: "rgba(249, 115, 22, 0.4)",
          gradient: "from-orange-500 to-amber-600",
          shadow: "shadow-orange-500/50"
        };
      case "low":
        return {
          fill: "#10b981",
          glow: "rgba(16, 185, 129, 0.4)",
          gradient: "from-emerald-500 to-teal-600",
          shadow: "shadow-emerald-500/50"
        };
      default:
        return {
          fill: "#6b7280",
          glow: "rgba(107, 114, 128, 0.4)",
          gradient: "from-gray-500 to-gray-600",
          shadow: "shadow-gray-500/50"
        };
    }
  };

  const getSeverityLabel = (severity: string) => {
    return severity.charAt(0).toUpperCase() + severity.slice(1);
  };

  return (
    <div className="space-y-4 h-full flex flex-col overflow-hidden">
      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-900 rounded-2xl h-64 overflow-hidden border border-blue-500/20 backdrop-blur-xl shadow-2xl flex-shrink-0">
        {/* Deep Ocean Background with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/60 via-slate-900 to-cyan-950/40"></div>
        
        {/* Animated ambient glow effect */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-20 w-40 h-40 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-20 w-32 h-32 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* World Map */}
        <div className="absolute inset-0">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 100,
              center: [20, 20]
            }}
            className="w-full h-full"
          >
            <ZoomableGroup center={[20, 20]} zoom={1}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="rgba(16, 185, 129, 0.15)"
                      stroke="rgba(16, 185, 129, 0.3)"
                      strokeWidth={0.5}
                      style={{
                        default: {
                          fill: "rgba(16, 185, 129, 0.15)",
                          stroke: "rgba(16, 185, 129, 0.3)",
                          strokeWidth: 0.5,
                          outline: "none"
                        },
                        hover: {
                          fill: "rgba(16, 185, 129, 0.25)",
                          stroke: "rgba(16, 185, 129, 0.4)",
                          strokeWidth: 0.5,
                          outline: "none"
                        },
                        pressed: {
                          fill: "rgba(16, 185, 129, 0.15)",
                          stroke: "rgba(16, 185, 129, 0.3)",
                          strokeWidth: 0.5,
                          outline: "none"
                        }
                      }}
                    />
                  ))
                }
              </Geographies>
              
              {/* Outbreak Markers */}
              {outbreaks.map((outbreak) => {
                const colors = getSeverityColor(outbreak.severity);
                const isSelected = selectedOutbreak === outbreak.id;
                
                return (
                  <Marker
                    key={outbreak.id}
                    coordinates={[outbreak.location.lng, outbreak.location.lat]}
                  >
                    {/* Pulse rings */}
                    <g className="cursor-pointer" onClick={() => setSelectedOutbreak(isSelected ? null : outbreak.id)}>
                      <circle
                        r={12}
                        fill={colors.glow}
                        opacity={0.2}
                        className="animate-ping"
                      />
                      <circle
                        r={8}
                        fill={colors.glow}
                        opacity={0.3}
                        className="animate-pulse"
                      />
                      <circle
                        r={5}
                        fill={colors.fill}
                        stroke="white"
                        strokeWidth={1.5}
                        opacity={0.9}
                        className={isSelected ? "animate-pulse" : ""}
                        style={{
                          filter: `drop-shadow(0 0 6px ${colors.glow})`
                        }}
                      />
                      {isSelected && (
                        <circle
                          r={7}
                          fill="none"
                          stroke="white"
                          strokeWidth={2}
                          opacity={0.6}
                        />
                      )}
                    </g>
                  </Marker>
                );
              })}
            </ZoomableGroup>
          </ComposableMap>
        </div>

        {/* Tooltip for selected outbreak */}
        {selectedOutbreak && (() => {
          const outbreak = outbreaks.find(o => o.id === selectedOutbreak);
          if (!outbreak) return null;
          const colors = getSeverityColor(outbreak.severity);
          
          return (
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
              style={{ marginTop: '-80px' }}
            >
              <div className="bg-gradient-to-br from-slate-900/98 via-slate-800/98 to-slate-900/98 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-blue-500/30 min-w-[240px]"
                style={{
                  boxShadow: `0 0 30px ${colors.glow}`
                }}
              >
                {/* Tooltip arrow */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-br from-slate-900 to-slate-800 rotate-45 border-r border-b border-blue-500/30"></div>
                
                <div className="relative space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-base text-white mb-1">{outbreak.disease}</h4>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <MapPin className="h-3 w-3" />
                        <p className="text-xs">{outbreak.location.name}</p>
                      </div>
                    </div>
                    <Badge 
                      className={`text-xs bg-gradient-to-r ${colors.gradient} text-white shadow-lg border-0 px-2 py-1`}
                    >
                      {getSeverityLabel(outbreak.severity)}
                    </Badge>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700/50">
                      <div className="flex items-center gap-1.5 mb-1">
                        <TrendingUp className="h-3 w-3 text-blue-400" />
                        <span className="text-[10px] text-slate-400">Cases</span>
                      </div>
                      <p className="font-bold text-base text-white">{outbreak.cases.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700/50">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Globe2 className="h-3 w-3 text-cyan-400" />
                        <span className="text-[10px] text-slate-400">Region</span>
                      </div>
                      <p className="font-bold text-xs text-white truncate">{outbreak.location.region || 'Global'}</p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] pt-1">
                    <Calendar className="h-3 w-3" />
                    <span>Detected: {new Date(outbreak.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  
                  {/* Close hint */}
                  <div className="text-center text-[10px] text-slate-500 pt-1 border-t border-slate-700/50">
                    Tap marker again to close
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Enhanced Legend */}
        <div className="absolute bottom-3 left-3 bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-xl p-3 space-y-2.5 border border-blue-500/30 shadow-xl z-10">
          <div className="flex items-center gap-2">
            <div className="relative w-3 h-3">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-600 rounded-full shadow-lg shadow-red-500/60 animate-pulse"></div>
            </div>
            <span className="text-xs text-slate-200 font-medium">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-3 h-3">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full shadow-lg shadow-orange-500/60 animate-pulse"></div>
            </div>
            <span className="text-xs text-slate-200 font-medium">Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-3 h-3">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-lg shadow-emerald-500/60 animate-pulse"></div>
            </div>
            <span className="text-xs text-slate-200 font-medium">Low Risk</span>
          </div>
        </div>

        {/* Real-time indicator */}
        <div className="absolute top-3 right-3 flex items-center gap-2 bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-full px-3 py-1.5 border border-emerald-500/30 shadow-lg z-10">
          <div className="relative w-2 h-2">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/60"></div>
          </div>
          <span className="text-xs text-slate-200 font-medium">Live</span>
        </div>

        {/* Corner decoration */}
        <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-blue-500/20 rounded-tl-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-blue-500/20 rounded-br-2xl pointer-events-none"></div>
      </div>

      {/* Enhanced Outbreak List */}
      <div className="flex-1 space-y-3 overflow-y-auto scrollbar-hide min-h-0">
        <div className="flex items-center justify-between sticky top-0 bg-gradient-to-b from-slate-900 to-transparent pb-2 z-10">
          <h4 className="font-semibold text-base flex items-center gap-2 text-slate-100">
            <Globe2 className="h-4 w-4 text-blue-400" />
            Global Outbreak Status
          </h4>
          <div className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded-lg border border-slate-700/50">
            {outbreaks.length} active • {new Set(outbreaks.map(o => o.location.country)).size} countries
          </div>
        </div>
        {outbreaks.map((outbreak, index) => {
          const colors = getSeverityColor(outbreak.severity);
          const isSelected = selectedOutbreak === outbreak.id;
          
          return (
            <div 
              key={outbreak.id} 
              className={`flex items-center justify-between p-3 bg-gradient-to-r from-slate-800/60 to-slate-800/30 rounded-xl backdrop-blur-sm border ${isSelected ? 'border-blue-500/50 shadow-lg shadow-blue-500/20' : 'border-slate-700/50'} hover:bg-slate-700/60 transition-all duration-300 hover:scale-[1.01] cursor-pointer animate-in slide-in-from-right-3 fade-in duration-500`}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => setSelectedOutbreak(isSelected ? null : outbreak.id)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative flex-shrink-0">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${colors.gradient} shadow-lg ${colors.shadow} animate-pulse`}></div>
                  {isSelected && (
                    <div className={`absolute inset-0 w-4 h-4 rounded-full bg-gradient-to-r ${colors.gradient} animate-ping`}></div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-slate-100">{outbreak.disease}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="truncate">{outbreak.location.name}</span>
                    {outbreak.location.region && (
                      <span className="text-[10px] bg-gradient-to-r from-blue-900/50 to-cyan-900/50 px-2 py-0.5 rounded-full text-slate-300 whitespace-nowrap border border-blue-500/20">
                        {outbreak.location.region}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right ml-2 flex-shrink-0">
                <p className="font-bold text-sm text-slate-100">{outbreak.cases.toLocaleString()}</p>
                <p className="text-xs text-slate-500">cases</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
