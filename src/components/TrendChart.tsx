import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, BarChart3, Activity } from "lucide-react";

interface TrendData {
  week: string;
  dengue: number;
  malaria: number;
  cholera: number;
  influenza: number;
}

interface TrendChartProps {
  data: TrendData[];
}

export default function TrendChart({ data }: TrendChartProps) {
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  const diseases = [
    { key: "dengue", name: "Dengue Fever", color: "#f87171", region: "Asia" },
    { key: "malaria", name: "Malaria", color: "#fbbf24", region: "Africa" },
    { key: "cholera", name: "Cholera", color: "#60a5fa", region: "Asia" },
    { key: "yellowFever", name: "Yellow Fever", color: "#f59e0b", region: "S. America" },
    { key: "measles", name: "Measles", color: "#a78bfa", region: "Europe" },
    { key: "influenza", name: "Influenza A", color: "#34d399", region: "N. America" }
  ];

  const getTotalCases = () => {
    return data.reduce((total, week) => {
      return total + week.dengue + week.malaria + week.cholera + week.influenza;
    }, 0);
  };

  const getTrendDirection = (diseaseKey: string) => {
    const current = data[data.length - 1][diseaseKey as keyof TrendData] as number;
    const previous = data[data.length - 2][diseaseKey as keyof TrendData] as number;
    return current > previous ? "up" : current < previous ? "down" : "stable";
  };

  const renderChart = () => {
    if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />
            <XAxis 
              dataKey="week" 
              tick={{ fontSize: 10, fill: '#cbd5e1' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: '#cbd5e1' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "12px",
                fontSize: "12px",
                color: "#f1f5f9",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(16px)"
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: "10px", color: '#cbd5e1' }}
            />
            {diseases.map((disease) => (
              <Line
                key={disease.key}
                type="monotone"
                dataKey={disease.key}
                stroke={disease.color}
                strokeWidth={3}
                dot={{ fill: disease.color, strokeWidth: 0, r: 4, filter: `drop-shadow(0 0 6px ${disease.color}60)` }}
                activeDot={{ r: 6, stroke: disease.color, strokeWidth: 2, fill: disease.color, filter: `drop-shadow(0 0 8px ${disease.color}80)` }}
                name={disease.name}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />
          <XAxis 
            dataKey="week" 
            tick={{ fontSize: 10, fill: '#cbd5e1' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 10, fill: '#cbd5e1' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "12px",
              fontSize: "12px",
              color: "#f1f5f9",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(16px)"
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: "10px", color: '#cbd5e1' }}
          />
          {diseases.map((disease) => (
            <Bar
              key={disease.key}
              dataKey={disease.key}
              fill={disease.color}
              name={disease.name}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="space-y-4 h-full flex flex-col overflow-hidden">
      {/* Enhanced Controls */}
      <div className="flex gap-2">
        <Button
          variant={chartType === "line" ? "default" : "outline"}
          size="sm"
          onClick={() => setChartType("line")}
          className={`flex-1 transition-all duration-300 hover:scale-105 ${
            chartType === "line" 
              ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25" 
              : "bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-emerald-500/50 backdrop-blur-sm"
          }`}
        >
          <TrendingUp className="h-4 w-4 mr-1" />
          Line Chart
        </Button>
        <Button
          variant={chartType === "bar" ? "default" : "outline"}
          size="sm"
          onClick={() => setChartType("bar")}
          className={`flex-1 transition-all duration-300 hover:scale-105 ${
            chartType === "bar" 
              ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25" 
              : "bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-cyan-500/50 backdrop-blur-sm"
          }`}
        >
          <BarChart3 className="h-4 w-4 mr-1" />
          Bar Chart
        </Button>
      </div>

      {/* Enhanced Chart */}
      <div className="flex-1 min-h-0 overflow-auto scrollbar-hide">
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl shadow-2xl h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 text-slate-200">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Epidemic Trends Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-cyan-600/5 rounded-lg"></div>
          <div className="relative z-10">
            {renderChart()}
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Enhanced Disease Summary */}
      <div className="flex-shrink-0">
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl shadow-xl">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-3">
            {diseases.map((disease, index) => {
              const trend = getTrendDirection(disease.key);
              const currentValue = data[data.length - 1][disease.key as keyof TrendData] as number;
              
              return (
                <div 
                  key={disease.key} 
                  className="text-center p-2 bg-slate-800/40 rounded-xl backdrop-blur-sm border border-slate-700/50 hover:bg-slate-700/40 transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom-3 fade-in duration-500"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <div 
                      className="w-2 h-2 rounded-full shadow-lg" 
                      style={{ 
                        backgroundColor: disease.color,
                        boxShadow: `0 0 10px ${disease.color}40`
                      }}
                    ></div>
                    <span className="text-[10px] text-slate-300 font-medium truncate">{disease.name.split(' ')[0]}</span>
                  </div>
                  <div className="text-base font-bold text-slate-100 mb-0.5">{currentValue}</div>
                  <div className="text-[9px] text-slate-500 mb-1">{disease.region}</div>
                  <div className={`text-[10px] font-medium flex items-center justify-center gap-0.5 ${
                    trend === "up" ? "text-red-400" :
                    trend === "down" ? "text-emerald-400" :
                    "text-slate-400"
                  }`}>
                    <span className="text-xs">
                      {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}