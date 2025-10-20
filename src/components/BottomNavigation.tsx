
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Shield, Globe, TrendingUp, User } from 'lucide-react-native';

export type NavTab = 'alerts' | 'map' | 'trends' | 'profile';

interface BottomNavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'alerts' as NavTab, label: 'Alerts', icon: Shield },
    { id: 'map' as NavTab, label: 'Map', icon: Globe },
    { id: 'trends' as NavTab, label: 'Trends', icon: TrendingUp },
    { id: 'profile' as NavTab, label: 'Profile', icon: User },
  ];

  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <TouchableOpacity key={tab.id} style={styles.tab} onPress={() => onTabChange(tab.id)}>
            {isActive && <View style={styles.activeIndicator} />}
            <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
              <Icon size={24} color={isActive ? 'white' : '#94a3b8'} />
            </View>
            <Text style={[styles.label, isActive && styles.activeLabel]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 80,
    backgroundColor: '#1a202c',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 50,
    height: 2,
    backgroundColor: '#3b82f6',
    borderRadius: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  activeIconContainer: {
    backgroundColor: '#2563eb',
  },
  label: {
    fontSize: 12,
    color: '#94a3b8',
  },
  activeLabel: {
    color: 'white',
    fontWeight: '600',
  },
});
