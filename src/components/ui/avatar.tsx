
import React, { useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, ViewProps, TextProps, ImageProps } from 'react-native';

const AvatarContext = React.createContext<{ imageStatus: string; setImageStatus: (status: string) => void; } | null>(null);

const Avatar: React.FC<ViewProps> = ({ children, style }) => {
  const [imageStatus, setImageStatus] = useState('loading');

  return (
    <AvatarContext.Provider value={{ imageStatus, setImageStatus }}>
      <View style={[styles.avatar, style]}>{children}</View>
    </AvatarContext.Provider>
  );
};

const AvatarImage: React.FC<ImageProps> = ({ ...props }) => {
  const context = useContext(AvatarContext);

  if (!context) {
    throw new Error('AvatarImage must be used within an Avatar component');
  }

  return (
    <Image
      {...props}
      style={[styles.image, props.style]}
      onLoad={() => context.setImageStatus('loaded')}
      onError={() => context.setImageStatus('error')}
    />
  );
};

const AvatarFallback: React.FC<ViewProps> = ({ children, style }) => {
  const context = useContext(AvatarContext);

  if (!context) {
    throw new Error('AvatarFallback must be used within an Avatar component');
  }

  if (context.imageStatus === 'loaded') {
    return null;
  }

  return <View style={[styles.fallback, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#334155',
  },
});

export { Avatar, AvatarImage, AvatarFallback };
