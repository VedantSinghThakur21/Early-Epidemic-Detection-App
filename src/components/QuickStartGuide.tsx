import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { 
  X,
  CheckCircle2,
  AlertTriangle,
  Map,
  TrendingUp,
  User,
  Video,
  BookOpen
} from "lucide-react";

interface QuickStartGuideProps {
  onClose: () => void;
}

export default function QuickStartGuide({ onClose }: QuickStartGuideProps) {
  const features = [
    {
      icon: AlertTriangle,
      title: "Alerts",
      description: "Monitor real-time epidemic alerts across 8 countries",
      color: "from-red-500 to-orange-500"
    },
    {
      icon: Map,
      title: "Global Map",
      description: "Interactive world map showing outbreak locations",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: TrendingUp,
      title: "Trends",
      description: "Track disease patterns with 6-week trend analysis",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: User,
      title: "Profile",
      description: "Manage settings, notifications, and preferences",
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-[360px] max-h-[90vh] overflow-y-auto scrollbar-hide">
        <Card className="bg-gradient-to-b from-slate-800 via-slate-800 to-slate-900 border-slate-700 shadow-2xl">
          <CardHeader className="relative pb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-3 right-3 text-slate-400 hover:text-white hover:bg-slate-700/50"
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="text-center space-y-3 pt-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25 mx-auto">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-100">Welcome to Sentinel AI</CardTitle>
                <p className="text-sm text-slate-400 mt-1">Your Epidemic Intelligence Dashboard</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Key Features */}
            <div className="space-y-2.5">
              <h3 className="text-sm font-semibold text-slate-300">Explore Features</h3>
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700/50 hover:border-slate-600/50 transition-colors"
                >
                  <div className={`w-10 h-10 bg-gradient-to-br ${feature.color} bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-slate-200">{feature.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Tips */}
            <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/30">
              <CardContent className="p-3 space-y-2">
                <h3 className="text-sm font-semibold text-blue-200 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Quick Tips
                </h3>
                <ul className="space-y-1.5 text-xs text-blue-300/90">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>Tap any alert to view detailed outbreak information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>Use the refresh button to update data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>Check Help & Support for video tutorials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>Navigate using the bottom tab bar</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Tutorial CTA */}
            <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30">
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-purple-500/30">
                    <Video className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-purple-200 mb-1">Video Tutorials Available</h4>
                    <p className="text-xs text-purple-300/80 leading-relaxed mb-2">
                      Learn how to set up and run the app with our comprehensive video guides.
                    </p>
                    <Button 
                      size="sm"
                      onClick={onClose}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs shadow-lg"
                    >
                      <Video className="h-3.5 w-3.5 mr-1.5" />
                      Watch Tutorials (Profile → Help)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* App Info */}
            <div className="text-center space-y-2 pt-2 pb-1">
              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                <p className="text-xs text-slate-400 leading-relaxed">
                  <span className="text-slate-300 font-medium">React Web App</span> optimized for mobile viewing (393×852px).
                  Monitoring <span className="text-blue-400 font-medium">8 countries</span> across <span className="text-cyan-400 font-medium">6 continents</span>.
                </p>
              </div>
              
              <Button 
                onClick={onClose}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25"
              >
                Get Started
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
