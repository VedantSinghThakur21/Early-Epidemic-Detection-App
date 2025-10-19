import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
  ArrowLeft,
  MapPin,
  Clock,
  AlertTriangle,
  Activity,
  Share2,
  CheckCircle2,
  TrendingUp,
  Database,
  Users,
  Info
} from "lucide-react";

interface AlertDetailScreenProps {
  alert: {
    id: number;
    title: string;
    description: string;
    severity: string;
    time: string;
    location: string;
  };
  onBack: () => void;
  onViewOnMap: () => void;
}

export default function AlertDetailScreen({ alert, onBack, onViewOnMap }: AlertDetailScreenProps) {
  // Simulated detailed data
  const aiConfidence = 87;
  const sourcesValidated = 12;
  const totalSources = 15;
  const affectedPopulation = 245000;
  const growthRate = 34;

  const getSeverityConfig = (severity: string) => {
    const configs = {
      high: {
        color: "text-red-400",
        bgColor: "bg-red-500/20",
        borderColor: "border-red-500",
        gradient: "from-red-600 to-red-700"
      },
      moderate: {
        color: "text-amber-400",
        bgColor: "bg-amber-500/20",
        borderColor: "border-amber-500",
        gradient: "from-amber-600 to-amber-700"
      },
      low: {
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/20",
        borderColor: "border-emerald-500",
        gradient: "from-emerald-600 to-emerald-700"
      }
    };
    return configs[severity as keyof typeof configs] || configs.low;
  };

  const config = getSeverityConfig(alert.severity);

  const affectedAreas = [
    { district: "Mumbai Central", cases: 847, growth: "+12%" },
    { district: "Dharavi", cases: 623, growth: "+18%" },
    { district: "Andheri", cases: 521, growth: "+8%" },
    { district: "Bandra", cases: 456, growth: "+15%" },
  ];

  const timeline = [
    { status: "Detected", time: "47 mins ago", completed: true },
    { status: "Analyzed by AI", time: "42 mins ago", completed: true },
    { status: "Data Validated", time: "38 mins ago", completed: true },
    { status: "Authority Notified", time: "12 mins ago", completed: true },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header with Back Navigation */}
      <div className="bg-gradient-to-br from-blue-900/90 via-cyan-900/90 to-slate-900/90 text-white p-4 pt-12 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/15 border border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Alert Details</h1>
            <p className="text-xs text-blue-200/80">Incident ID: #AL-{alert.id.toString().padStart(4, '0')}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/15 border border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Alert Title Card */}
        <Card className={`bg-white/5 border-l-4 ${config.borderColor} border-white/20 backdrop-blur-xl mb-3`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <h2 className="font-semibold text-white mb-1">{alert.title}</h2>
                <p className="text-sm text-blue-200/80 leading-relaxed">{alert.description}</p>
              </div>
              <Badge className={`bg-gradient-to-r ${config.gradient} text-white border-none shadow-lg`}>
                {alert.severity}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-xs text-blue-200/70">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{alert.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{alert.time}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        
        {/* AI Confidence & Validation Progress */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl">
            <CardContent className="p-4 text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    className="text-slate-700"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 36}`}
                    strokeDashoffset={`${2 * Math.PI * 36 * (1 - aiConfidence / 100)}`}
                    className="text-blue-500 transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">{aiConfidence}%</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 font-medium">AI Confidence</p>
              <p className="text-xs text-slate-500">Neural analysis</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-300 font-medium">Data Sources</span>
                  <span className="text-xs text-blue-400 font-bold">{sourcesValidated}/{totalSources}</span>
                </div>
                <Progress value={(sourcesValidated / totalSources) * 100} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Validation</span>
                  <span className="text-emerald-400 font-medium">✓ Complete</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Cross-referenced</span>
                  <span className="text-emerald-400 font-medium">✓ Verified</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-slate-200">
              <Activity className="h-4 w-4 text-blue-400" />
              Impact Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-slate-800/40 rounded-lg">
              <Users className="h-4 w-4 mx-auto mb-1 text-cyan-400" />
              <p className="text-lg font-bold text-white">{(affectedPopulation / 1000).toFixed(0)}K</p>
              <p className="text-xs text-slate-400">Population</p>
            </div>
            <div className="text-center p-3 bg-slate-800/40 rounded-lg">
              <TrendingUp className="h-4 w-4 mx-auto mb-1 text-red-400" />
              <p className="text-lg font-bold text-white">+{growthRate}%</p>
              <p className="text-xs text-slate-400">Growth Rate</p>
            </div>
            <div className="text-center p-3 bg-slate-800/40 rounded-lg">
              <Database className="h-4 w-4 mx-auto mb-1 text-emerald-400" />
              <p className="text-lg font-bold text-white">{sourcesValidated}</p>
              <p className="text-xs text-slate-400">Data Points</p>
            </div>
          </CardContent>
        </Card>

        {/* Alert Timeline */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-slate-200">
              <Clock className="h-4 w-4 text-blue-400" />
              Alert Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {timeline.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    item.completed ? 'bg-emerald-500/20 border-2 border-emerald-500' : 'bg-slate-700/50 border-2 border-slate-600'
                  }`}>
                    {item.completed && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className={`w-0.5 h-8 ${item.completed ? 'bg-emerald-500/50' : 'bg-slate-700'}`}></div>
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <p className={`text-sm font-medium ${item.completed ? 'text-slate-200' : 'text-slate-400'}`}>
                    {item.status}
                  </p>
                  <p className="text-xs text-slate-500">{item.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Affected Areas Table */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-slate-200">
              <MapPin className="h-4 w-4 text-blue-400" />
              Affected Regions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {affectedAreas.map((area, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-slate-800/40 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-200">{area.district}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{area.cases}</p>
                    <p className={`text-xs ${area.growth.startsWith('+') ? 'text-red-400' : 'text-emerald-400'}`}>
                      {area.growth}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Expandable Sections */}
        <Accordion type="single" collapsible className="space-y-3">
          <AccordionItem value="sources" className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl rounded-xl overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:no-underline text-slate-200 text-sm">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-400" />
                Source Data Analysis
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
                  <span>WHO Reports</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">Verified</Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
                  <span>Local Health Departments</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">Verified</Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
                  <span>News Outlets (8 sources)</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">Verified</Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Social Media Indicators</span>
                  <Badge className="bg-amber-500/20 text-amber-400 text-xs">Pending</Badge>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="patterns" className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl rounded-xl overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:no-underline text-slate-200 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                Historical Patterns
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-xs text-slate-300 space-y-2">
              <p>Similar outbreaks in this region occurred in 2023 (monsoon season) with peak cases in Week 3.</p>
              <p className="text-amber-400">• 34% faster growth rate compared to historical average</p>
              <p className="text-emerald-400">• Response time improved by 45% with AI early detection</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="actions" className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl rounded-xl overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:no-underline text-slate-200 text-sm">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-400" />
                Recommended Actions
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-xs text-slate-300 space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5" />
                <p>Deploy rapid response teams to Dharavi and Andheri districts</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5" />
                <p>Increase vector control operations in affected areas</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5" />
                <p>Issue public health advisory through local channels</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Action Buttons */}
        <div className="space-y-2 pb-4">
          <Button 
            onClick={onViewOnMap}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:scale-105"
          >
            <MapPin className="h-4 w-4 mr-2" />
            View on Map
          </Button>
          <Button 
            variant="outline"
            className="w-full bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-600 hover:text-white hover:border-blue-500/50 transition-all duration-300"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share with Team
          </Button>
        </div>
      </div>
    </div>
  );
}
