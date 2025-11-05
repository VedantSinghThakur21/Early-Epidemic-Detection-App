
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { User, Bell, Settings, Shield, HelpCircle, LogOut, ChevronRight, Mail, MapPin, Briefcase } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

export default function ProfileScreen({ onNavigate, onLogout }: ProfileScreenProps) {
  const { user, logout } = useAuth();
  
  const menuItems = [
    { icon: Bell, label: 'Notifications', badge: '3', screen: 'notifications' },
    { icon: Settings, label: 'Settings', screen: 'settings' },
    { icon: Shield, label: 'Privacy & Security', screen: 'privacy' },
    { icon: HelpCircle, label: 'Help & Support', screen: 'help' },
  ];

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.profileInfoContainer}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarFallback}>
              {user ? getInitials(user.name) : 'NA'}
            </Text>
          </View>
          <View>
            <Text style={styles.profileName}>{user?.name || 'Guest User'}</Text>
            <Text style={styles.profileRole}>{user?.role || 'No Role'}</Text>
          </View>
        </View>
        <View style={styles.separator} />
        <View style={styles.contactInfoContainer}>
          <View style={styles.contactRow}>
            <Mail size={16} color="#94a3b8" />
            <Text style={styles.contactText}>{user?.email || 'No email'}</Text>
          </View>
          <View style={styles.contactRow}>
            <Briefcase size={16} color="#94a3b8" />
            <Text style={styles.contactText}>{user?.organization || 'No organization'}</Text>
          </View>
          <View style={styles.contactRow}>
            <MapPin size={16} color="#94a3b8" />
            <Text style={styles.contactText}>{user?.location || 'No location'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={() => onNavigate(item.screen)}>
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIconContainer}>
                <item.icon size={20} color="#60a5fa" />
              </View>
              <Text style={styles.menuItemText}>{item.label}</Text>
            </View>
            <View style={styles.menuItemRight}>
              {item.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
              <ChevronRight size={16} color="#64748b" />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={16} color="#f87171" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 16,
    paddingTop: 40,
    backgroundColor: '#1a202c',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileCard: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 16,
    margin: 16,
  },
  profileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarFallback: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  profileRole: {
    color: '#94a3b8',
  },
  separator: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 16,
  },
  contactInfoContainer: {},
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    color: '#94a3b8',
    marginLeft: 8,
  },
  menuContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    color: 'white',
    fontSize: 16,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    marginRight: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  logoutButtonText: {
    color: '#f87171',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
