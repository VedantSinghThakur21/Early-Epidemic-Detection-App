# 🚀 Sentinel AI - Quick Setup Guide

## ⚡ Fast Track (5 Minutes)

### Step 1: Prerequisites Check
✅ Node.js installed? Check with:
```bash
node --version  # Should be v18 or higher
```

❌ Don't have Node.js? [Download it here](https://nodejs.org/)

### Step 2: Install Dependencies
```bash
npm install
```
⏱️ This takes about 2-3 minutes

### Step 3: Run the App
```bash
npm run dev
```

### Step 4: Open in Browser
1. Open the URL shown (usually `http://localhost:5173`)
2. Press **F12** (or **Cmd+Option+I** on Mac) to open DevTools
3. Click the **device toolbar icon** (or press **Cmd+Shift+M**)
4. Set dimensions to **393 × 852** pixels
5. Refresh the page

### Step 5: Login
- Email: `admin@sentinel.ai` (or any email)
- Password: `demo123` (or any password)

🎉 **Done!** You're now viewing the Sentinel AI dashboard!

---

## 📹 Video Tutorial

For a detailed walkthrough with video:
1. Login to the app
2. Go to **Profile** tab (bottom right)
3. Tap **"Help & Support"**
4. Select **"Tutorials"** tab
5. Click **"View Quick Start Guide"** button
6. Watch **"Getting Started with Sentinel AI"** (8:45)

---

## 🐛 Troubleshooting

### Issue: Port 5173 already in use
```bash
# Kill existing process
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

### Issue: npm install fails
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: Blank screen
- Check browser console (F12) for errors
- Try incognito/private mode
- Clear browser cache
- Ensure Node.js is v18+

### Issue: Map not showing
- Check internet connection (map requires internet)
- Check browser console for CORS errors
- Refresh the page

---

## 📱 Viewing Tips

### Best Viewing Experience
- **Browser**: Chrome, Firefox, Safari, or Edge (latest version)
- **Viewport**: 393×852px (iPhone 14 Pro size)
- **DevTools**: Keep device toolbar enabled
- **Zoom**: 100% browser zoom for accurate sizing

### How to Set Mobile View
**Chrome/Edge:**
1. Press `F12`
2. Press `Ctrl+Shift+M` (Windows) or `Cmd+Shift+M` (Mac)
3. Select "iPhone 14 Pro" or enter custom `393 × 852`

**Firefox:**
1. Press `F12`
2. Press `Ctrl+Shift+M` (Windows) or `Cmd+Option+M` (Mac)
3. Select "iPhone 14 Pro" or enter custom dimensions

**Safari:**
1. Enable Developer menu: Preferences → Advanced → Show Develop menu
2. Develop → Enter Responsive Design Mode
3. Set to 393×852

---

## 🎯 What to Explore

### After Login
1. **📊 Dashboard** - View stats: total cases, countries, critical alerts
2. **🚨 Alerts Tab** - Tap any alert to see detailed information
3. **🗺️ Map Tab** - Explore interactive global outbreak map
4. **📈 Trends Tab** - Analyze 6-week disease trends
5. **👤 Profile Tab** - Access settings and help

### Key Features to Try
- ✨ Tap the **bell icon** (top right) for notifications
- 🔄 Use the **refresh button** to update data
- 📍 In alert details, tap **"View on Map"**
- 🎓 Access **Help & Support** for tutorials
- ⚙️ Explore **Settings** for app preferences

---

## 💻 Technical Details

### Tech Stack
- **React 18** + TypeScript
- **Tailwind CSS v4.0**
- **Vite** (build tool)
- **Recharts** (charts)
- **react-simple-maps** (maps)
- **Shadcn UI** (components)
- **Lucide React** (icons)

### Project Structure
```
sentinel-ai/
├── components/        # React components
│   ├── ui/           # Shadcn UI components
│   ├── LoginScreen.tsx
│   ├── AlertsList.tsx
│   ├── MapView.tsx
│   └── ... 15 more screens
├── styles/           # Tailwind configuration
├── App.tsx           # Main app component
└── README.md         # Full documentation
```

### Mock Data
- 8 outbreak locations (8 countries, 6 continents)
- 5 critical alerts with varying severity
- 6 weeks of trend data for 6 diseases
- Real-time simulation (no actual API calls)

---

## 🎓 For Evaluation

### Features Implemented ✅
- [x] Authentication (login/logout)
- [x] 4 main screens + 5 sub-screens
- [x] Bottom navigation
- [x] Alert system with detail views
- [x] Interactive world map
- [x] Multi-line trend charts
- [x] Profile management
- [x] Notifications system
- [x] Settings & preferences
- [x] Help & tutorials
- [x] Glassmorphism UI
- [x] Smooth animations
- [x] Mobile-first design

### UI/UX Highlights
- 🎨 Professional dark theme with clinical blue
- ✨ Glassmorphism effects throughout
- 🎭 Smooth transitions and animations
- 📱 Mobile-optimized (393×852px)
- 🎯 Intuitive navigation flow
- 🔔 Notification badges
- 🚨 Severity-based color coding
- 📊 Data visualization (charts + maps)

---

## ℹ️ Important Notes

### This is a Web App, Not React Native
- Built with **React** (web), not React Native
- Runs in **browser**, not as native mobile app
- **Mobile-optimized** for demonstration purposes
- **393×852px viewport** simulates mobile screen

### Demo/Evaluation Mode
- **No real backend** - uses mock data
- **Any credentials work** - demo authentication
- **Static data** - simulates real-time updates
- **No API calls** - all data is local
- **For evaluation only** - not production-ready

### Data Privacy
- No real user data collected
- No backend or database
- No external API calls (except map tiles)
- Not suitable for real health data

---

## 📞 Need Help?

### In-App Support
- **Profile → Help & Support** for comprehensive help
- **Tutorials tab** for video guides
- **FAQs tab** for common questions
- **Contact tab** for support info

### Documentation
- See **README.md** for full documentation
- Check **SETUP_GUIDE.md** (this file) for setup
- Browse code comments for implementation details

---

## 🎬 Quick Commands Cheat Sheet

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Clear cache and reinstall
npm cache clean --force && rm -rf node_modules && npm install
```

---

<div align="center">
  <p><strong>Happy Monitoring! 🦠🔬</strong></p>
  <p>Sentinel AI - Protecting Global Health, One Alert at a Time</p>
</div>
