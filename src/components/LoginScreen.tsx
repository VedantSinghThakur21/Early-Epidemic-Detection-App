import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Brain, Mail, Lock, AlertCircle, Monitor, Info } from "lucide-react";

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    // Demo authentication - any email/password works
    setError("");
    onLogin();
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 justify-center items-center p-6 overflow-y-auto scrollbar-hide">
      <div className="w-full max-w-sm space-y-4 py-6">
        {/* Logo and Title */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25 mx-auto">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Sentinel AI
            </h1>
            <p className="text-sm text-blue-200/70 mt-1">Advanced Epidemic Intelligence System</p>
          </div>
        </div>

        {/* Important Info Banner */}
        <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/30 backdrop-blur-xl">
          <CardContent className="p-3">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-500/30">
                <Monitor className="h-4 w-4 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-semibold text-blue-200 mb-1">React Web Application</h3>
                <p className="text-[11px] text-blue-300/80 leading-relaxed">
                  Mobile-optimized web app (393×852px) for browser viewing. See <span className="text-blue-400 font-medium">Profile → Help & Support</span> for setup tutorials and video guides.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Login Card */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-lg text-center text-slate-200">Sign In to Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 text-sm">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="health.official@gov.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-900/50 border-slate-600/50 text-slate-200 placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300 text-sm">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-slate-900/50 border-slate-600/50 text-slate-200 placeholder:text-slate-500"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                Forgot password?
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials Info */}
        <Card className="bg-slate-800/30 border-slate-700/30 backdrop-blur-sm">
          <CardContent className="p-3 text-center text-xs text-slate-400">
            <p className="mb-1 text-slate-300 font-medium">Demo Access</p>
            <p>Enter any email and password to access the dashboard</p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 space-y-1">
          <p>Secured by Government Health Network</p>
          <p className="text-slate-600">Project Phase 1 Evaluation Build</p>
        </div>
      </div>
    </div>
  );
}