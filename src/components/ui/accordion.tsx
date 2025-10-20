
import React, { useState, createContext, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager, ViewProps, TouchableOpacityProps } from 'react-native';
import { ChevronDown } from 'lucide-react-native';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// Context to manage the state of the accordion
const AccordionContext = createContext<{ activeItem: string | null; setActiveItem: (value: string | null) => void }>({ activeItem: null, setActiveItem: () => {} });

const Accordion: React.FC<ViewProps & {type: 'single', collapsible: boolean}> = ({ children, style, ...props }) => {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  return (
    <AccordionContext.Provider value={{ activeItem, setActiveItem }}>
      <View style={[styles.accordion, style]} {...props}>
        {children}
      </View>
    </AccordionContext.Provider>
  );
};

const AccordionItem: React.FC<ViewProps & { value: string }> = ({ children, value, style }) => {
  return <View style={[styles.item, style]}>{React.Children.map(children, child => React.isValidElement(child) ? React.cloneElement(child, { itemValue: value } as any) : child)}</View>;
};

const AccordionTrigger: React.FC<TouchableOpacityProps & { itemValue?: string }> = ({ children, itemValue, ...props }) => {
  const { activeItem, setActiveItem } = useContext(AccordionContext);
  const isOpen = activeItem === itemValue;

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveItem(isOpen ? null : itemValue || null);
  };

  return (
    <TouchableOpacity style={styles.trigger} onPress={handlePress} {...props}>
      <View style={{flex: 1}}>{children}</View>
      <ChevronDown size={16} color="#94a3b8" style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }} />
    </TouchableOpacity>
  );
};

const AccordionContent: React.FC<ViewProps & { itemValue?: string }> = ({ children, itemValue, style }) => {
  const { activeItem } = useContext(AccordionContext);

  if (activeItem !== itemValue) {
    return null;
  }

  return <View style={[styles.content, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  accordion: {
    borderTopWidth: 1,
    borderColor: '#334155',
  },
  item: {
    borderBottomWidth: 1,
    borderColor: '#334155',
  },
  trigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
});

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
