import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { 
  Database, 
  Languages, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  ExternalLink,
  TrendingUp,
  Globe
} from "lucide-react";

interface Outbreak {
  id: number;
  disease: string;
  location: { lat: number; lng: number; name: string };
  severity: string;
  cases: number;
  date: string;
  tier1Sources: number;
  tier2Sources: number;
  tier3Sources: number;
  validationStatus: string;
  anomalyScore: number;
  languages: string[];
}

interface SourceValidationViewProps {
  outbreaks: Outbreak[];
}

export default function SourceValidationView({ outbreaks }: SourceValidationViewProps) {
  const getValidationStatusIcon = (status: string) => {
    switch (status) {
      case "validated":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "reviewing":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <Database className="h-4 w-4 text-gray-500" />;
    }
  };

  const getValidationBadgeVariant = (status: string) => {
    switch (status) {
      case "validated": return "default";
      case "pending": return "secondary";
      case "reviewing": return "outline";
      default: return "outline";
    }
  };

  const getAnomalyScoreColor = (score: number) => {
    if (score >= 90) return "text-red-600";
    if (score >= 70) return "text-orange-600";
    if (score >= 50) return "text-yellow-600";
    return "text-green-600";
  };

  const totalSources = outbreaks.reduce((sum, outbreak) => 
    sum + outbreak.tier1Sources + outbreak.tier2Sources + outbreak.tier3Sources, 0
  );

  const validatedOutbreaks = outbreaks.filter(o => o.validationStatus === "validated").length;
  const avgAnomalyScore = Math.round(
    outbreaks.reduce((sum, outbreak) => sum + outbreak.anomalyScore, 0) / outbreaks.length
  );

  return (
    <div className="space-y-4 h-full">
      {/* Summary Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Multi-Tiered Source Validation
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-4 gap-3 text-center">
          <div>
            <p className="text-lg font-semibold text-purple-700">{totalSources}</p>
            <p className="text-xs text-purple-600">Total Sources</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-green-700">{validatedOutbreaks}</p>
            <p className="text-xs text-green-600">Validated</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-orange-700">{avgAnomalyScore}%</p>
            <p className="text-xs text-orange-600">Avg Anomaly</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-blue-700">{outbreaks.length}</p>
            <p className="text-xs text-blue-600">Active</p>
          </div>
        </CardContent>
      </Card>

      {/* Source Tier Legend */}
      <Card>
        <CardContent className="p-3">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-2">
              <div className="font-medium text-green-700 text-sm">Tier 1</div>
              <div className="text-xs text-green-600">Official Health Orgs</div>
              <div className="text-xs text-gray-500 mt-1">WHO, CDC, NCDC</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
              <div className="font-medium text-blue-700 text-sm">Tier 2</div>
              <div className="text-xs text-blue-600">Verified Media</div>
              <div className="text-xs text-gray-500 mt-1">News, Reuters, AP</div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
              <div className="font-medium text-orange-700 text-sm">Tier 3</div>
              <div className="text-xs text-orange-600">Social Signals</div>
              <div className="text-xs text-gray-500 mt-1">Twitter, Reddit, Trends</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Outbreak Source Analysis */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {outbreaks.map((outbreak) => (
          <Card key={outbreak.id} className="border-l-4 border-l-purple-500">
            <CardContent className="p-3">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      {outbreak.disease}
                      {getValidationStatusIcon(outbreak.validationStatus)}
                    </h4>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {outbreak.location.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={getValidationBadgeVariant(outbreak.validationStatus)}
                      className="text-xs mb-1"
                    >
                      {outbreak.validationStatus}
                    </Badge>
                    <div className="text-xs text-gray-500">{outbreak.cases.toLocaleString()} cases</div>
                  </div>
                </div>
                
                {/* Source Distribution */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center bg-green-50 rounded p-2">
                    <div className="text-sm font-medium text-green-600">{outbreak.tier1Sources}</div>
                    <div className="text-xs text-gray-500">T1 Sources</div>
                  </div>
                  <div className="text-center bg-blue-50 rounded p-2">
                    <div className="text-sm font-medium text-blue-600">{outbreak.tier2Sources}</div>
                    <div className="text-xs text-gray-500">T2 Sources</div>
                  </div>
                  <div className="text-center bg-orange-50 rounded p-2">
                    <div className="text-sm font-medium text-orange-600">{outbreak.tier3Sources}</div>
                    <div className="text-xs text-gray-500">T3 Sources</div>
                  </div>
                </div>
                
                {/* Anomaly Score */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">AI Anomaly Detection Score</span>
                    <span className={`font-medium ${getAnomalyScoreColor(outbreak.anomalyScore)}`}>
                      {outbreak.anomalyScore}%
                    </span>
                  </div>
                  <Progress value={outbreak.anomalyScore} className="h-2" />
                  <div className="text-xs text-gray-500">
                    {outbreak.anomalyScore >= 90 ? "High anomaly detected" : 
                     outbreak.anomalyScore >= 70 ? "Moderate anomaly pattern" :
                     "Normal baseline variation"}
                  </div>
                </div>
                
                {/* Language and Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Languages className="h-3 w-3" />
                      <span>{outbreak.languages.join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <TrendingUp className="h-3 w-3" />
                      <span>{outbreak.date}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="h-6 text-xs">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Sources
                    </Button>
                    <Button variant="outline" size="sm" className="h-6 text-xs">
                      <Database className="h-3 w-3 mr-1" />
                      Raw Data
                    </Button>
                  </div>
                </div>

                {/* Cross-Validation Status */}
                {outbreak.tier1Sources > 0 && outbreak.tier2Sources > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded p-2">
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-green-700 font-medium">Cross-validated across tiers</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      Alert confirmed by {outbreak.tier1Sources} official source(s) and {outbreak.tier2Sources} media report(s)
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}