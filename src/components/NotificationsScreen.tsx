import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ArrowLeft, Bell, AlertTriangle, Info, CheckCircle2, X } from "lucide-react";

interface NotificationsScreenProps {
  onBack: () => void;
  onViewAlert?: (alertId: number) => void;
}

interface Notification {
  id: number;
  alertId?: number;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: typeof AlertTriangle;
  color: string;
  bgColor: string;
  borderColor: string;
}

export default function NotificationsScreen({ onBack, onViewAlert }: NotificationsScreenProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "alert",
      title: "Critical Alert: Dengue Surge",
      message: "High-severity dengue outbreak detected in Mumbai region. Immediate attention required.",
      time: "5 mins ago",
      read: false,
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20"
    },
    {
      id: 2,
      type: "alert",
      title: "Malaria Cases Increasing",
      message: "AI model detected unusual pattern in Nairobi area. Review recommended.",
      time: "1 hour ago",
      read: false,
      icon: AlertTriangle,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20"
    },
    {
      id: 3,
      type: "system",
      title: "Data Sync Complete",
      message: "Successfully synced with 12 health data sources. All systems operational.",
      time: "2 hours ago",
      read: false,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20"
    },
    {
      id: 4,
      type: "info",
      title: "Weekly Report Available",
      message: "Your epidemic surveillance report for Week 15 is now ready for download.",
      time: "5 hours ago",
      read: true,
      icon: Info,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20"
    },
    {
      id: 5,
      type: "system",
      title: "Model Training Complete",
      message: "Neural network has been updated with latest epidemic data patterns.",
      time: "1 day ago",
      read: true,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20"
    },
  ]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDismiss = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleViewAlert = (alertId?: number) => {
    if (alertId && onViewAlert) {
      onViewAlert(alertId);
    }
  };

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
          <div className="flex-1 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">Notifications</h1>
              <p className="text-xs text-blue-200/80">{notifications.filter(n => !n.read).length} unread</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              className="text-xs text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              Mark all as read
            </Button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
        {notifications.map((notification, index) => {
          const Icon = notification.icon;
          return (
            <Card 
              key={notification.id}
              className={`bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-xl hover:scale-[1.02] transition-all duration-300 ${
                !notification.read ? "border-l-4 " + notification.borderColor : ""
              } animate-in slide-in-from-right-3 fade-in duration-500`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${notification.bgColor} border ${notification.borderColor}`}>
                    <Icon className={`h-5 w-5 ${notification.color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`text-sm font-semibold ${!notification.read ? "text-white" : "text-slate-300"}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    
                    <p className="text-xs text-slate-400 leading-relaxed mb-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{notification.time}</span>
                      <div className="flex items-center gap-2">
                        {notification.type === "alert" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewAlert(notification.alertId)}
                            className="h-7 text-xs bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-500/50"
                          >
                            View Alert
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDismiss(notification.id)}
                          className="h-7 w-7 p-0 text-slate-500 hover:text-slate-300 hover:bg-slate-700/50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Empty State if no notifications */}
        {notifications.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bell className="h-8 w-8 text-slate-500" />
            </div>
            <p className="text-slate-400 font-medium">No notifications</p>
            <p className="text-xs text-slate-500 mt-1">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
