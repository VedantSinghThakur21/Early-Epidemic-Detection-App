# Sentinel AI - Epidemic Alerts Dashboard

<div align="center">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
</div>

## 📱 Overview

**Sentinel AI** is an advanced epidemic intelligence system designed for real-time monitoring of disease outbreaks across the globe. Built as a mobile-first React web application (393×852px), it demonstrates professional UI/UX design for health officials and government agencies.

### 🌟 Key Features

- **🔐 Authentication System** - Secure login/logout functionality
- **🚨 Real-time Alerts** - Monitor epidemic alerts across 8 countries and 6 continents
- **🗺️ Interactive Map** - Global visualization using react-simple-maps
- **📊 Trend Analysis** - Multi-disease tracking with Recharts
- **👤 Profile Management** - User settings, notifications, privacy controls
- **🎨 Premium Dark Theme** - Glassmorphism effects with smooth animations
- **📱 Mobile-Optimized** - Designed for 393×852px viewport (mobile simulation)

### 🦠 Monitored Diseases

- Dengue Fever
- Malaria
- Cholera
- Yellow Fever
- Measles
- Typhoid
- Influenza A
- Zika Virus

### 🌍 Global Coverage

Monitoring outbreaks across:
- **Asia** (India, Bangladesh, Singapore)
- **Africa** (Kenya)
- **North America** (USA)
- **South America** (Brazil)
- **Europe** (France)
- **Oceania** (Australia)

---

## 🚀 Getting Started

### Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Git (for cloning the repository)

### Installation

1. **Clone the repository** (or download the ZIP file)

```bash
git clone https://github.com/yourrepo/sentinel-ai.git
cd sentinel-ai
```

2. **Install dependencies**

```bash
npm install
```

This will install all required packages including:
- React & React DOM
- TypeScript
- Tailwind CSS v4.0
- Recharts (for charts)
- react-simple-maps (for map visualization)
- Lucide React (for icons)
- Shadcn UI components
- And more...

3. **Start the development server**

```bash
npm run dev
```

4. **Open your browser**

Navigate to the URL shown in the terminal (typically `http://localhost:5173`)

5. **View the app in mobile mode**

- Open browser DevTools (F12 or Cmd+Option+I)
- Click the device toolbar icon (Cmd+Shift+M)
- Set dimensions to **393 × 852** or select a mobile device preset
- Refresh the page

---

## 🎥 Video Tutorial

A comprehensive video tutorial is available within the app:

1. **Launch the application**
2. **Login with any credentials** (demo mode - any email/password works)
3. **Navigate to Profile tab** (bottom right)
4. **Tap "Help & Support"**
5. **Select "Tutorials" tab**
6. **Watch "Getting Started with Sentinel AI"**

The tutorial covers:
- Project setup and installation
- Running the development server
- Navigating the dashboard
- Understanding alerts and maps
- Using all features

---

## 📖 Usage Guide

### Login

- **Email**: Enter any email address (e.g., `admin@sentinel.ai`)
- **Password**: Enter any password
- The app uses demo authentication for evaluation purposes

### Dashboard Navigation

The app features 4 main sections accessible via bottom navigation:

1. **🚨 Alerts** - View real-time epidemic alerts sorted by severity
2. **🗺️ Map** - Interactive global map showing outbreak locations
3. **📊 Trends** - Multi-line chart tracking disease trends over 6 weeks
4. **👤 Profile** - User settings and account management

### Key Interactions

- **Tap an alert** to view detailed information
- **"View on Map" button** navigates to the map with highlighted location
- **Pull to refresh** updates data (refresh button in header)
- **Bell icon** shows notification count and opens notifications screen
- **Profile sections** include Notifications, Settings, Privacy, and Help

---

## 🏗️ Project Structure

```
sentinel-ai/
├── components/
│   ├── ui/                    # Shadcn UI components
│   ├── AlertsList.tsx         # Alerts list component
│   ├── MapView.tsx            # Global map visualization
│   ├── TrendChart.tsx         # Multi-disease trend chart
│   ├── AlertDetailScreen.tsx  # Detailed alert view
│   ├── ProfileScreen.tsx      # User profile
│   ├── LoginScreen.tsx        # Authentication
│   ├── NotificationsScreen.tsx
│   ├── SettingsScreen.tsx
│   ├── PrivacySecurityScreen.tsx
│   ├── HelpSupportScreen.tsx  # Tutorials & support
│   └── BottomNavigation.tsx   # Tab navigation
├── styles/
│   └── globals.css            # Tailwind v4 configuration
├── App.tsx                    # Main application component
├── main.tsx                   # Entry point
└── README.md                  # This file
```

---

## 🎨 Design System

### Color Scheme

The app uses a professional clinical blue palette:

- **Primary**: Blue gradients (from-blue-600 to-cyan-600)
- **Background**: Dark slate tones (slate-900, slate-800)
- **Accents**: Cyan, emerald, red (for severity levels)
- **Effects**: Glassmorphism with backdrop-blur

### Typography

- Default font: System font stack
- Font sizes: Controlled via CSS variables
- No explicit Tailwind size classes (text-2xl, etc.)
- Consistent use of font-medium and font-semibold

### Components

Built with [Shadcn UI](https://ui.shadcn.com/):
- Buttons, Cards, Inputs, Labels
- Tabs, Badges, Avatars
- Dialogs, Switches, Selects
- And more...

---

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Styling (utility-first) |
| **Vite** | Build tool & dev server |
| **Recharts** | Data visualization (charts) |
| **react-simple-maps** | Geographic visualization |
| **Lucide React** | Icon library |
| **Shadcn UI** | Component library |
| **Motion/React** | Animations (if needed) |

---

## 📊 Mock Data

The app uses mock data for demonstration:

- **8 outbreak locations** across 6 continents
- **5 critical alerts** with varying severity levels
- **6 weeks of trend data** for 6 diseases
- **Realistic timestamps** and case numbers

**Note**: In a production environment, this would connect to real health organization APIs (WHO, CDC, etc.)

---

## 🔒 Security & Privacy

This is a **demonstration application** for Project Phase 1 evaluation:

- Uses mock authentication (any credentials work)
- No real user data is collected
- No backend or database connections
- All data is static/mock data
- Not intended for production use with real health data

**Important**: Figma Make is not designed for collecting PII or securing sensitive data.

---

## 📱 Mobile Optimization

The app is specifically designed for mobile viewing:

- **Viewport**: 393×852px (iPhone 14 Pro dimensions)
- **Touch-optimized**: Large tap targets, swipe gestures
- **Smooth scrolling**: Custom scrollbar hiding
- **Bottom navigation**: Thumb-friendly tab bar
- **Responsive**: Adapts to different screen sizes

To view properly:
1. Open browser DevTools
2. Enable device toolbar
3. Set to 393×852 or mobile preset

---

## 🎓 For Evaluation

### Project Requirements Met

✅ **Multiple Screen Types**: 4 main screens + 5 sub-screens  
✅ **Navigation Flow**: Complete bottom nav + back navigation  
✅ **UI Components**: Cards, buttons, inputs, charts, maps, badges  
✅ **Interactivity**: Click handlers, state management, form validation  
✅ **Professional Design**: Glassmorphism, gradients, animations  
✅ **Mobile-First**: Optimized for mobile viewport  
✅ **Data Visualization**: Charts and maps integrated  
✅ **Authentication**: Login/logout flow implemented  

### Demonstrable Features

- Login authentication system
- Real-time alert monitoring
- Interactive map visualization
- Multi-disease trend tracking
- Profile management
- Notification system
- Settings and preferences
- Help & tutorial system

---

## 🚧 Known Limitations

- **No real backend**: Uses mock/static data
- **No API integration**: Would require CORS-enabled health APIs
- **Demo authentication**: Any credentials work
- **Static data**: No real-time updates (simulated only)
- **Web-only**: Built as React web app, not React Native
- **Browser-based**: Runs in browser, not native mobile app

---

## 📝 Development Scripts

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Lint code
npm run lint
```

---

## 🆘 Troubleshooting

### Port already in use

If port 5173 is already in use:

```bash
# Kill the process on port 5173 (macOS/Linux)
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

### Dependencies not installing

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Blank screen or errors

1. Check browser console (F12) for errors
2. Ensure you're using Node.js v18+
3. Clear browser cache
4. Try incognito/private window
5. Check that all dependencies installed correctly

### Map not displaying

- Map uses react-simple-maps which requires internet connection
- Check browser console for CORS errors
- Ensure TopoJSON is loading properly

---

## 📬 Support & Feedback

For questions or issues:

- **Within the app**: Navigate to Profile → Help & Support
- **Video tutorials**: Available in Help & Support → Tutorials tab
- **Email**: support@sentinel.ai (demo only)
- **Documentation**: Check the in-app documentation section

---

## 📄 License

This is a student project for Phase 1 evaluation. Not licensed for commercial use.

---

## 🙏 Acknowledgments

- **Shadcn UI** - Component library
- **Tailwind CSS** - Styling framework
- **Recharts** - Chart library
- **react-simple-maps** - Map visualization
- **Lucide** - Icon library
- **Vite** - Build tooling

---

## 📸 Screenshots

The app includes:
- Login screen with demo credentials
- Alert dashboard with severity badges
- Interactive world map with outbreak markers
- Multi-line trend charts
- Profile management screens
- Help & tutorial system

---

<div align="center">
  <p><strong>Built with ❤️ for Project Phase 1 Evaluation</strong></p>
  <p>Sentinel AI - Monitoring Global Health, One Alert at a Time</p>
</div>
