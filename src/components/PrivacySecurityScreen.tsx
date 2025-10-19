import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { 
  ArrowLeft, 
  Shield, 
  Lock,
  Key,
  Fingerprint,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Clock
} from "lucide-react";

interface PrivacySecurityScreenProps {
  onBack: () => void;
}

export default function PrivacySecurityScreen({ onBack }: PrivacySecurityScreenProps) {
  const [biometricAuth, setBiometricAuth] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [autoLock, setAutoLock] = useState(true);
  const [dataEncryption, setDataEncryption] = useState(true);

  const securityLogs = [
    { action: "Login", location: "Mumbai, India", time: "2 hours ago", status: "success" },
    { action: "Data Export", location: "Mumbai, India", time: "1 day ago", status: "success" },
    { action: "Settings Changed", location: "Mumbai, India", time: "3 days ago", status: "success" },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
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
            <h1 className="text-lg font-semibold">Privacy & Security</h1>
            <p className="text-xs text-blue-200/80">Protect your account and data</p>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Secure
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        
        {/* Security Status */}
        <Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border-emerald-500/30 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
                <Shield className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-emerald-300 text-sm">Account Protected</h3>
                <p className="text-xs text-emerald-400/70">Your security settings are optimal</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Authentication */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-slate-200">
              <Lock className="h-4 w-4 text-blue-400" />
              Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm text-slate-200">Biometric Login</Label>
                <p className="text-xs text-slate-400">Use fingerprint/face ID</p>
              </div>
              <Switch 
                checked={biometricAuth} 
                onCheckedChange={setBiometricAuth}
              />
            </div>
            
            <Separator className="bg-slate-700/50" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm text-slate-200">Two-Factor Authentication</Label>
                <p className="text-xs text-slate-400">Extra security layer</p>
              </div>
              <Switch 
                checked={twoFactorAuth} 
                onCheckedChange={setTwoFactorAuth}
              />
            </div>
            
            <Separator className="bg-slate-700/50" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm text-slate-200">Auto-Lock</Label>
                <p className="text-xs text-slate-400">Lock after 5 min inactivity</p>
              </div>
              <Switch 
                checked={autoLock} 
                onCheckedChange={setAutoLock}
              />
            </div>
            
            <Separator className="bg-slate-700/50" />
            
            <Button
              variant="outline"
              className="w-full bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-blue-500/50"
            >
              <Key className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Data Privacy */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-slate-200">
              <Eye className="h-4 w-4 text-blue-400" />
              Data Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm text-slate-200">End-to-End Encryption</Label>
                <p className="text-xs text-slate-400">Encrypt all data transfers</p>
              </div>
              <Switch 
                checked={dataEncryption} 
                onCheckedChange={setDataEncryption}
                disabled
              />
            </div>
            
            <Separator className="bg-slate-700/50" />
            
            <div className="flex items-center justify-between">
              <Label className="text-sm text-slate-200">Data Sharing</Label>
              <span className="text-xs text-slate-400">Restricted</span>
            </div>
            
            <Separator className="bg-slate-700/50" />
            
            <Button
              variant="outline"
              className="w-full bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
            >
              View Privacy Policy
            </Button>
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-slate-200">
              <Fingerprint className="h-4 w-4 text-blue-400" />
              Active Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-slate-800/40 rounded-lg border border-slate-700/50">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200">Current Session</p>
                <p className="text-xs text-slate-400">Mumbai, India • iOS Mobile</p>
                <p className="text-xs text-slate-500 mt-1">Active now</p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-slate-800/50 border-slate-600/50 text-red-400 hover:bg-red-600/20 hover:border-red-500/50"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              End All Other Sessions
            </Button>
          </CardContent>
        </Card>

        {/* Security Log */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-slate-200">
              <Clock className="h-4 w-4 text-blue-400" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {securityLogs.map((log, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-slate-800/40 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm text-slate-200">{log.action}</p>
                  <p className="text-xs text-slate-500">{log.location} • {log.time}</p>
                </div>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Compliance */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl">
          <CardContent className="p-4 space-y-2">
            <p className="text-xs text-slate-400 text-center">
              This app complies with HIPAA, GDPR, and local health data regulations
            </p>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="outline" className="text-xs bg-slate-800/50 border-slate-600/50 text-slate-400">
                HIPAA Compliant
              </Badge>
              <Badge variant="outline" className="text-xs bg-slate-800/50 border-slate-600/50 text-slate-400">
                GDPR
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
