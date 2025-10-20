
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ArrowLeft, Bell, AlertTriangle, Info, CheckCircle2, X } from 'lucide-react-native';

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
  icon: React.ElementType;
  color: string;
}

export default function NotificationsScreen({ onBack, onViewAlert }: NotificationsScreenProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      alertId: 1,
      type: 'alert',
      title: 'Critical Alert: Dengue Surge',
      message: 'High-severity dengue outbreak detected in Mumbai region. Immediate attention required.',
      time: '5 mins ago',
      read: false,
      icon: AlertTriangle,
      color: '#f87171',
    },
    {
      id: 2,
      alertId: 2,
      type: 'alert',
      title: 'Malaria Cases Increasing',
      message: 'AI model detected unusual pattern in Nairobi area. Review recommended.',
      time: '1 hour ago',
      read: false,
      icon: AlertTriangle,
      color: '#fbbf24',
    },
    {
      id: 3,
      type: 'system',
      title: 'Data Sync Complete',
      message: 'Successfully synced with 12 health data sources. All systems operational.',
      time: '2 hours ago',
      read: false,
      icon: CheckCircle2,
      color: '#34d399',
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={20} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>{notifications.filter(n => !n.read).length} unread</Text>
        </View>
        <Button variant="ghost" size="sm" onPress={handleMarkAllRead}>
          <Text style={styles.markAllReadText}>Mark all read</Text>
        </Button>
      </View>

      <ScrollView style={styles.listContainer}>
        {notifications.length > 0 ? (
          notifications.map(notification => {
            const Icon = notification.icon;
            return (
              <Card key={notification.id} style={[styles.notificationCard, !notification.read && { borderLeftColor: notification.color, borderLeftWidth: 4 }]}>
                <CardContent style={styles.cardContent}>
                  <View style={[styles.iconContainer, { backgroundColor: `${notification.color}20` }]}>
                    <Icon size={20} color={notification.color} />
                  </View>
                  <View style={styles.notificationTextContainer}>
                    <Text style={[styles.notificationTitle, !notification.read && styles.unreadText]}>{notification.title}</Text>
                    <Text style={styles.notificationMessage}>{notification.message}</Text>
                    <View style={styles.notificationFooter}>
                      <Text style={styles.notificationTime}>{notification.time}</Text>
                      <View style={styles.notificationActions}>
                        {notification.type === 'alert' && (
                          <Button variant="outline" size="sm" onPress={() => handleViewAlert(notification.alertId)}>
                            View Alert
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onPress={() => handleDismiss(notification.id)}>
                          <X size={16} color="#94a3b8" />
                        </Button>
                      </View>
                    </View>
                  </View>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Bell size={40} color="#64748b" />
            <Text style={styles.emptyText}>No notifications</Text>
            <Text style={styles.emptySubtext}>You're all caught up!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    backgroundColor: '#1a202c',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  backButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
  },
  markAllReadText: {
    color: '#60a5fa',
    fontSize: 12,
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  notificationCard: {
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#94a3b8',
  },
  unreadText: {
    color: 'white',
  },
  notificationMessage: {
    color: '#94a3b8',
    marginVertical: 4,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#64748b',
  },
  notificationActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#94a3b8',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
  },
});
