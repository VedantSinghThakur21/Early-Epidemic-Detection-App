
import React, { useState, createContext, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewProps, TouchableOpacityProps } from 'react-native';

// Context to manage the active tab
const TabsContext = createContext<{ activeTab: string; setActiveTab: (value: string) => void; }>({ activeTab: '', setActiveTab: () => {} });

// The main Tabs component that holds the state
const Tabs: React.FC<ViewProps & { defaultValue: string }> = ({ defaultValue, children, style }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <View style={style}>{children}</View>
    </TabsContext.Provider>
  );
};

// A container for the tab triggers
const TabsList: React.FC<ViewProps> = ({ children, style }) => {
  return <View style={[styles.tabsList, style]}>{children}</View>;
};

// A touchable trigger for each tab
const TabsTrigger: React.FC<TouchableOpacityProps & { value: string }> = ({ value, children, style }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <TouchableOpacity
      style={[styles.trigger, isActive && styles.activeTrigger, style]}
      onPress={() => setActiveTab(value)}
    >
      {typeof children === 'string' ? <Text style={[styles.triggerText, isActive && styles.activeTriggerText]}>{children}</Text> : children}
    </TouchableOpacity>
  );
};

// A container for the content of each tab
const TabsContent: React.FC<ViewProps & { value: string }> = ({ value, children, style }) => {
  const { activeTab } = useContext(TabsContext);

  if (activeTab !== value) {
    return null;
  }

  return <View style={style}>{children}</View>;
};

const styles = StyleSheet.create({
  tabsList: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 4,
  },
  trigger: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTrigger: {
    backgroundColor: '#3b82f6',
  },
  triggerText: {
    color: '#94a3b8',
  },
  activeTriggerText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export { Tabs, TabsList, TabsTrigger, TabsContent };
