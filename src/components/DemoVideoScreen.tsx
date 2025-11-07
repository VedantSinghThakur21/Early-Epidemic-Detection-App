import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';

interface DemoVideoScreenProps {
  onBack: () => void;
}

export default function DemoVideoScreen({ onBack }: DemoVideoScreenProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<Video>(null);
  const { width, height } = Dimensions.get('window');
  const videoWidth = isFullscreen ? width : Math.min(width - 32, 800);
  const videoHeight = isFullscreen ? height : (videoWidth * 9) / 16; // 16:9 aspect ratio

  // Set audio mode when component mounts
  useEffect(() => {
    const setupAudio = async () => {
      try {
        const { Audio } = await import('expo-av');
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
      } catch (error) {
        console.log('Audio setup error:', error);
      }
    };
    setupAudio();
  }, []);

  const handlePlayPause = async () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = async () => {
    if (!videoRef.current) return;
    await videoRef.current.setIsMutedAsync(!isMuted);
    setIsMuted(!isMuted);
  };

  const handleFullscreenToggle = async () => {
    if (!videoRef.current) return;
    try {
      if (isFullscreen) {
        await videoRef.current.dismissFullscreenPlayer();
      } else {
        await videoRef.current.presentFullscreenPlayer();
      }
      setIsFullscreen(!isFullscreen);
    } catch (error) {
      console.log('Fullscreen toggle error:', error);
      // Fallback: just toggle state for custom fullscreen
      setIsFullscreen(!isFullscreen);
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis / 1000);
      setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);
      setIsPlaying(status.isPlaying);
      setIsMuted(status.isMuted);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>App Demo Video</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.videoContainer}>
          {Platform.OS === 'web' ? (
            // Web: Use iframe for YouTube embed
            <iframe
              width={videoWidth}
              height={videoHeight}
              src="https://www.youtube.com/embed/luvM07nltrc?autoplay=0&rel=0"
              title="App Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                borderRadius: 12,
                maxWidth: '100%',
              }}
            />
          ) : (
            // Mobile: Use expo-av Video component with local demo video
            <View style={[styles.mobileVideoContainer, { width: videoWidth, height: videoHeight }]}>
              <Video
                ref={videoRef}
                source={require('../../assets/demo-video.mp4')}
                style={styles.video}
                useNativeControls={false}
                resizeMode={ResizeMode.CONTAIN}
                isLooping
                shouldPlay={false}
                isMuted={false}
                volume={1.0}
                onPlaybackStatusUpdate={onPlaybackStatusUpdate}
              />
              
              {/* Custom controls overlay */}
              <View style={styles.controlsOverlay}>
                <TouchableOpacity 
                  style={styles.playButton}
                  onPress={handlePlayPause}
                >
                  {isPlaying ? (
                    <Pause size={40} color="white" />
                  ) : (
                    <Play size={40} color="white" />
                  )}
                </TouchableOpacity>
                
                <View style={styles.bottomControls}>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { width: `${duration > 0 ? (position / duration) * 100 : 0}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.timeText}>
                      {formatTime(position)} / {formatTime(duration)}
                    </Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.muteButton}
                    onPress={handleMuteToggle}
                  >
                    {isMuted ? (
                      <VolumeX size={20} color="white" />
                    ) : (
                      <Volume2 size={20} color="white" />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.fullscreenButton}
                    onPress={handleFullscreenToggle}
                  >
                    {isFullscreen ? (
                      <Minimize size={20} color="white" />
                    ) : (
                      <Maximize size={20} color="white" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>📱 Sentinel AI Demo</Text>
          <Text style={styles.infoText}>
            Watch a complete walkthrough of the Sentinel AI epidemic monitoring system, featuring:
          </Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>• Real-time outbreak tracking</Text>
            <Text style={styles.featureItem}>• Interactive global map visualization</Text>
            <Text style={styles.featureItem}>• AI-powered alerts and predictions</Text>
            <Text style={styles.featureItem}>• Trend analysis and statistics</Text>
          </View>
          <View style={styles.noticeContainer}>
            <Text style={styles.noticeText}>
              💡 Watch the complete demo video above to learn how to use all features of Sentinel AI.
            </Text>
          </View>
        </View>

        <View style={styles.instructionCard}>
          <Text style={styles.instructionTitle}>🎯 Quick Tutorial</Text>
          <View style={styles.stepsList}>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>Tap the <Text style={{fontWeight: 'bold', color: '#60a5fa'}}>Alerts</Text> tab to view real-time epidemic alerts</Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>Navigate to <Text style={{fontWeight: 'bold', color: '#60a5fa'}}>Map</Text> for interactive global outbreak visualization</Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>Check <Text style={{fontWeight: 'bold', color: '#60a5fa'}}>Trends</Text> for AI-powered disease pattern analysis</Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <Text style={styles.stepText}>Visit <Text style={{fontWeight: 'bold', color: '#60a5fa'}}>Profile</Text> to customize settings and notifications</Text>
            </View>
          </View>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
    backgroundColor: '#334155',
    borderRadius: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    alignItems: 'center',
  },
  videoContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  mobileVideoContainer: {
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#3b82f6',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  playButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 50,
    padding: 20,
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  bottomControls: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 12,
  },
  progressContainer: {
    flex: 1,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#334155',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  timeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '500',
  },
  muteButton: {
    padding: 4,
  },
  fullscreenButton: {
    padding: 4,
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    maxWidth: 600,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#cbd5e1',
    marginBottom: 16,
    lineHeight: 20,
  },
  featureList: {
    gap: 8,
  },
  featureItem: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  noticeContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#334155',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  noticeText: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  instructionCard: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    maxWidth: 600,
    borderWidth: 1,
    borderColor: '#334155',
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  stepsList: {
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
});
