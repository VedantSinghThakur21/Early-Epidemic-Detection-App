# Demo Video Setup Guide

## Overview
The app now has a built-in video player that displays a demo video when users click the purple video button (📹) in the top right corner of the dashboard.

## Current Setup
- The video opens in a **separate screen** (not an overlay)
- Uses `expo-av` for video playback on mobile
- Uses embedded YouTube iframe for web
- Currently shows a sample video from Google Cloud Storage

## How to Add Your Own Demo Video

### Option 1: Use a Local Video File (Recommended for App)

1. **Add your video to the assets folder:**
   ```
   Shopping App/
   ├── assets/
   │   ├── demo-video.mp4  <- Place your video here
   │   └── ...
   ```

2. **Update the video source in `DemoVideoScreen.tsx`:**
   
   Find this line (around line 85):
   ```typescript
   source={{ uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
   ```
   
   Replace it with:
   ```typescript
   source={require('../../assets/demo-video.mp4')}
   ```

### Option 2: Use a Remote Video URL

Keep the current setup but change the URL:
```typescript
source={{ uri: 'YOUR_VIDEO_URL_HERE.mp4' }}
```

**Note:** Make sure the URL is:
- A direct link to an MP4 file
- Publicly accessible
- HTTPS (not HTTP)

### Option 3: Keep YouTube Video (Web Only)

The YouTube embed already works for web. The iframe is around line 75-84 in `DemoVideoScreen.tsx`:

```typescript
src="https://www.youtube.com/embed/luvM07nltrc?autoplay=0&rel=0"
```

Change `luvM07nltrc` to your YouTube video ID.

## Video Controls

The app includes custom video controls:
- ▶️ Play/Pause button (center)
- 🔊 Mute/Unmute button (bottom right)
- Progress bar (bottom)
- Time display (current / total)

## Recommended Video Specifications

- **Format:** MP4 (H.264 codec)
- **Resolution:** 1920x1080 (1080p) or 1280x720 (720p)
- **Aspect Ratio:** 16:9
- **File Size:** Under 50MB for better loading
- **Duration:** 2-5 minutes (optimal for demos)

## Testing

1. Click the purple video button (📹) in the top right
2. Verify the video loads and plays
3. Test play/pause controls
4. Test mute/unmute
5. Check progress bar updates

## Navigation

- Video opens in a **full screen** with proper navigation
- Back arrow (←) returns to dashboard
- Bottom navigation remains visible
- No more UI overlap issues!

## Notes

- The sample video is just for demonstration
- Replace it with your actual app demo video
- For production, consider using a CDN for better performance
- Make sure video file is optimized for mobile playback
