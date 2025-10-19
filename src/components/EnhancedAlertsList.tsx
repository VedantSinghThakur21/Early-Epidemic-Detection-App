import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { 
  Search, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Languages,
  Eye,
  Brain,
  Shield
} from "lucide-react";

interface EnhancedAlert {
  id: number;
  title: string;
  description: string;
  severity: string;
  time: string;
  location: string;
  sourceCredibility: string;
  validationStatus: string;
  ragSummary: string;
  confidence: number;
  language: string;
  originalLanguages: string[];
}

interface EnhancedAlertsListProps {
  alerts: EnhancedAlert[];
  viewMode: string;
  selectedLanguage: string;
}

export default function EnhancedAlertsList({ alerts, viewMode, selectedLanguage }: EnhancedAlertsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || alert.validationStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getValidationIcon = (status: string) => {
    switch (status) {
      case "expert-confirmed":
      case "validated":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "ai-flagged":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case "pending-verification":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "routine-monitoring":
        return <Eye className="h-4 w-4 text-blue-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSourceBadge = (tier: string) => {
    const variants = {
      tier1: { variant: "default" as const, label: "T1", color: "bg-green-500" },
      tier2: { variant: "secondary" as const, label: "T2", color: "bg-blue-500" },
      tier3: { variant: "outline" as const, label: "T3", color: "bg-orange-500" }
    };
    return variants[tier as keyof typeof variants] || variants.tier3;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "border-l-red-500";
      case "moderate": return "border-l-orange-500";
      case "low": return "border-l-blue-500";
      default: return "border-l-gray-500";
    }
  };

  return (
    <div className="space-y-3 h-full flex flex-col">
      {/* Search and Filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search AI-powered alerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-8 text-xs"
          />
        </div>
        
        <div className="flex gap-1">
          {[
            { value: "all", label: "All" },
            { value: "expert-confirmed", label: "Validated" },
            { value: "ai-flagged", label: "AI Flagged" },
            { value: "pending-verification", label: "Pending" }
          ].map((status) => (
            <Button
              key={status.value}
              variant={filterStatus === status.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus(status.value)}
              className="flex-1 h-7 text-xs"
            >
              {status.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No alerts match your criteria</p>
            <p className="text-xs text-gray-400">AI continuously monitoring for new patterns</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <Card key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
              <CardContent className="p-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2">
                      {getValidationIcon(alert.validationStatus)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{alert.title}</p>
                          <Badge 
                            variant={getSourceBadge(alert.sourceCredibility).variant}
                            className="text-xs px-1 py-0"
                          >
                            {getSourceBadge(alert.sourceCredibility).label}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">{alert.description}</p>
                      </div>
                    </div>
                    <div className="text-right ml-2">
                      <div className="text-xs font-medium text-blue-600">{alert.confidence}%</div>
                      <div className="text-xs text-gray-500">confidence</div>
                    </div>
                  </div>
                  
                  {/* AI Confidence Indicator */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">AI Confidence</span>
                      <span className="font-medium">{alert.confidence}%</span>
                    </div>
                    <Progress value={alert.confidence} className="h-1" />
                  </div>
                  
                  {(viewMode === "validation" || viewMode === "expert") && (
                    <div className="bg-blue-50 border border-blue-200 p-2 rounded text-xs">
                      <div className="flex items-center gap-1 font-medium text-blue-700 mb-1">
                        <Brain className="h-3 w-3" />
                        RAG Knowledge Context:
                      </div>
                      <p className="text-blue-600">{alert.ragSummary}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{alert.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Languages className="h-3 w-3" />
                        <span>{alert.originalLanguages.slice(0, 2).join(", ")}</span>
                      </div>
                    </div>
                    <span>{alert.time}</span>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="flex-1 h-7 text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      Review
                    </Button>
                    {viewMode === "expert" && (
                      <>
                        <Button variant="outline" size="sm" className="flex-1 h-7 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Validate
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 h-7 text-xs">
                          <XCircle className="h-3 w-3 mr-1" />
                          Dismiss
                        </Button>
                      </>
                    )}
                    {viewMode === "validation" && (
                      <Button variant="outline" size="sm" className="flex-1 h-7 text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Sources
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Footer */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-3">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-sm font-semibold text-blue-700">{filteredAlerts.length}</p>
              <p className="text-xs text-blue-600">Total</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-green-700">
                {filteredAlerts.filter(a => a.validationStatus === "expert-confirmed").length}
              </p>
              <p className="text-xs text-green-600">Validated</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-orange-700">
                {filteredAlerts.filter(a => a.validationStatus === "ai-flagged").length}
              </p>
              <p className="text-xs text-orange-600">AI Flagged</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-purple-700">
                {Math.round(filteredAlerts.reduce((sum, alert) => sum + alert.confidence, 0) / filteredAlerts.length) || 0}%
              </p>
              <p className="text-xs text-purple-600">Avg Conf</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}