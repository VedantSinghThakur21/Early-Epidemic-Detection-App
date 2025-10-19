import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  ArrowLeft, 
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  Book,
  ExternalLink,
  ChevronRight,
  Play,
  Clock,
  Video,
  Download,
  FileText,
  Sparkles
} from "lucide-react";

interface HelpSupportScreenProps {
  onBack: () => void;
  onShowQuickStart?: () => void;
}

export default function HelpSupportScreen({ onBack, onShowQuickStart }: HelpSupportScreenProps) {
  const faqs = [
    {
      question: "How does the AI detection system work?",
      category: "AI & Detection"
    },
    {
      question: "What data sources does Sentinel use?",
      category: "Data"
    },
    {
      question: "How to export alert reports?",
      category: "Reports"
    },
    {
      question: "How to customize alert notifications?",
      category: "Settings"
    }
  ];

  const tutorials = [
    {
      id: 1,
      title: "Getting Started with Sentinel AI",
      description: "Complete guide to setting up and running the application",
      duration: "8:45",
      thumbnail: "primary",
      featured: true
    },
    {
      id: 2,
      title: "Understanding the Dashboard",
      description: "Navigate alerts, maps, and trends with confidence",
      duration: "6:30",
      thumbnail: "secondary"
    },
    {
      id: 3,
      title: "Alert System Deep Dive",
      description: "Learn how to interpret and respond to epidemic alerts",
      duration: "10:15",
      thumbnail: "tertiary"
    },
    {
      id: 4,
      title: "Map View Tutorial",
      description: "Explore global outbreak data on the interactive map",
      duration: "5:20",
      thumbnail: "quaternary"
    },
    {
      id: 5,
      title: "Trend Analysis Guide",
      description: "Master data visualization and pattern recognition",
      duration: "7:50",
      thumbnail: "quinary"
    }
  ];

  const getThumbnailGradient = (type: string) => {
    switch (type) {
      case "primary":
        return "from-blue-600 to-cyan-600";
      case "secondary":
        return "from-purple-600 to-pink-600";
      case "tertiary":
        return "from-emerald-600 to-teal-600";
      case "quaternary":
        return "from-orange-600 to-red-600";
      case "quinary":
        return "from-indigo-600 to-blue-600";
      default:
        return "from-slate-600 to-slate-700";
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
            <h1 className="text-lg font-semibold">Help & Support</h1>
            <p className="text-xs text-blue-200/80">Tutorials, FAQs & Support</p>
          </div>
        </div>
      </div>

      {/* Content with Tabs */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <Tabs defaultValue="tutorials" className="h-full">
          <div className="sticky top-0 z-10 bg-gradient-to-b from-slate-900 to-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 px-4 pt-4">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700/50">
              <TabsTrigger value="tutorials" className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Video className="h-3.5 w-3.5 mr-1.5" />
                Tutorials
              </TabsTrigger>
              <TabsTrigger value="faqs" className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <HelpCircle className="h-3.5 w-3.5 mr-1.5" />
                FAQs
              </TabsTrigger>
              <TabsTrigger value="contact" className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                Contact
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tutorials Tab */}
          <TabsContent value="tutorials" className="p-4 space-y-4 mt-0">
            
            {/* Quick Start Guide Button */}
            {onShowQuickStart && (
              <Button
                onClick={onShowQuickStart}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                View Quick Start Guide
              </Button>
            )}
            
            {/* Featured Tutorial - How to Run the App */}
            <Card className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-blue-500/50 backdrop-blur-xl overflow-hidden">
              <div className="relative">
                {/* Video Placeholder */}
                <div className="aspect-video bg-gradient-to-br from-blue-600 to-cyan-600 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-white/40 hover:scale-110 transition-transform cursor-pointer">
                        <Play className="h-8 w-8 text-white ml-1" />
                      </div>
                      <div className="absolute top-3 left-3">
                        <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1.5 rounded-full border border-white/20">
                          <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
                          <span className="text-xs font-medium text-white">Featured</span>
                        </div>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20">
                        <span className="text-xs font-medium text-white flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          8:45
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Decorative Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30 flex-shrink-0">
                    <Video className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-100 mb-1">Getting Started with Sentinel AI</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">
                      Complete step-by-step guide to installing dependencies, setting up the environment, and running the Sentinel AI dashboard application on your local machine.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25">
                        <Play className="h-3.5 w-3.5 mr-1.5" />
                        Watch Tutorial
                      </Button>
                      <Button size="sm" variant="outline" className="bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50">
                        <Download className="h-3.5 w-3.5 mr-1.5" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline" className="bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50">
                        <FileText className="h-3.5 w-3.5 mr-1.5" />
                        Transcript
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Other Tutorial Videos */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Book className="h-4 w-4 text-blue-400" />
                All Tutorials
              </h3>
              
              {tutorials.slice(1).map((tutorial) => (
                <Card key={tutorial.id} className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl hover:border-blue-500/50 transition-all cursor-pointer group">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      {/* Thumbnail */}
                      <div className={`w-20 h-14 bg-gradient-to-br ${getThumbnailGradient(tutorial.thumbnail)} rounded-lg flex items-center justify-center relative overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform`}>
                        <Play className="h-6 w-6 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] text-white">
                          {tutorial.duration}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-slate-200 mb-0.5 group-hover:text-blue-400 transition-colors">
                          {tutorial.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {tutorial.description}
                        </p>
                      </div>
                      
                      <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Installation Instructions */}
            <Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border-emerald-500/30 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-emerald-300">
                  <FileText className="h-4 w-4" />
                  Quick Setup Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-3 font-mono text-xs">
                  <div className="text-slate-400 mb-2"># Clone the repository</div>
                  <div className="text-emerald-400">git clone https://github.com/yourrepo/sentinel-ai.git</div>
                  
                  <div className="text-slate-400 mt-3 mb-2"># Install dependencies</div>
                  <div className="text-emerald-400">npm install</div>
                  
                  <div className="text-slate-400 mt-3 mb-2"># Run the application</div>
                  <div className="text-emerald-400">npm run dev</div>
                </div>
                <p className="text-xs text-emerald-300/70 px-1">
                  Access the app at <span className="text-emerald-400 font-mono">http://localhost:5173</span>
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQs Tab */}
          <TabsContent value="faqs" className="p-4 space-y-4 mt-0">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-slate-200">
                  <HelpCircle className="h-4 w-4 text-blue-400" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {faqs.map((faq, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center justify-between p-3 bg-slate-800/40 rounded-lg hover:bg-slate-700/40 transition-colors text-left"
                  >
                    <div className="flex-1">
                      <p className="text-sm text-slate-200">{faq.question}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{faq.category}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-500" />
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Documentation */}
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-slate-200">
                  <Book className="h-4 w-4 text-blue-400" />
                  Documentation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-between bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-blue-500/50"
                >
                  <span className="flex items-center gap-2">
                    <Book className="h-4 w-4" />
                    User Guide
                  </span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-between bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-blue-500/50"
                >
                  <span className="flex items-center gap-2">
                    <Book className="h-4 w-4" />
                    API Documentation
                  </span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-between bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-blue-500/50"
                >
                  <span className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Video Library
                  </span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border-emerald-500/30 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-emerald-300">All Systems Operational</p>
                    <p className="text-xs text-emerald-400/70">Last checked: Just now</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-emerald-400 hover:text-emerald-300"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="p-4 space-y-4 mt-0">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-gradient-to-br from-blue-600/20 to-blue-500/10 border-blue-500/30 backdrop-blur-xl hover:scale-105 transition-all cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-2 border border-blue-500/30">
                    <MessageCircle className="h-6 w-6 text-blue-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-200">Live Chat</p>
                  <p className="text-xs text-slate-400 mt-0.5">Available 24/7</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-cyan-600/20 to-cyan-500/10 border-cyan-500/30 backdrop-blur-xl hover:scale-105 transition-all cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-2 border border-cyan-500/30">
                    <Mail className="h-6 w-6 text-cyan-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-200">Email Us</p>
                  <p className="text-xs text-slate-400 mt-0.5">Response in 2h</p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-slate-200">
                  <Phone className="h-4 w-4 text-blue-400" />
                  Contact Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-lg">
                  <div>
                    <p className="text-sm text-slate-200">Emergency Hotline</p>
                    <p className="text-xs text-slate-400">24/7 Critical Support</p>
                  </div>
                  <p className="text-sm font-medium text-blue-400">1800-XXX-XXXX</p>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-lg">
                  <div>
                    <p className="text-sm text-slate-200">Support Email</p>
                    <p className="text-xs text-slate-400">General inquiries</p>
                  </div>
                  <p className="text-sm font-medium text-cyan-400">support@sentinel.ai</p>
                </div>
              </CardContent>
            </Card>

            {/* Feedback */}
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl">
              <CardContent className="p-4 text-center space-y-3">
                <p className="text-sm text-slate-300">Have suggestions for improvement?</p>
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Feedback
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}