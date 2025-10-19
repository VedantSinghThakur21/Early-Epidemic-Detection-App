# Sentinel AI - Project Overview

## 📋 Project Information

**Project Name:** Sentinel AI - Epidemic Alerts Dashboard  
**Purpose:** Project Phase 1 Evaluation  
**Type:** React Web Application (Mobile-Optimized)  
**Target Viewport:** 393×852px (Mobile Simulation)  
**Development Environment:** Figma Make (React Web Apps Only)

---

## 🎯 Project Goals

### Primary Objectives
1. **Demonstrate UI/UX Skills** - Showcase professional interface design for evaluation
2. **Mobile-First Design** - Optimized for mobile viewport with premium aesthetics
3. **Complete Navigation Flow** - Multiple screens with proper routing and back navigation
4. **Interactive Components** - Demonstrate proficiency with React state management
5. **Data Visualization** - Charts, maps, and real-time data presentation
6. **Professional Theme** - Clinical blue color scheme suitable for health officials

### Evaluation Criteria Met
✅ Multiple screen types (9 unique screens)  
✅ Complete navigation flow (bottom nav + back navigation)  
✅ Variety of UI components (25+ component types)  
✅ Full interactivity (state management, event handlers)  
✅ Professional design (glassmorphism, animations, gradients)  
✅ Data visualization (Recharts for trends, react-simple-maps for geography)  
✅ Authentication flow (login/logout)  
✅ Responsive mobile design

---

## 📱 Application Overview

### Core Functionality
Sentinel AI is an advanced epidemic intelligence system that monitors disease outbreaks globally. It provides real-time alerts, interactive maps, trend analysis, and profile management for health officials and government agencies.

### Key Features

#### 1. Authentication System
- Secure login screen with form validation
- Demo mode (any credentials work for evaluation)
- Logout functionality
- Session management

#### 2. Alert Monitoring (Main Screen)
- Real-time epidemic alerts
- Severity-based color coding (high, moderate, low)
- Tap to view detailed information
- Quick stats dashboard
- Pull-to-refresh functionality

#### 3. Interactive Map View
- Global outbreak visualization using react-simple-maps
- Geographic markers for 8 countries across 6 continents
- Tooltip on hover with outbreak details
- Zoom and pan capabilities
- Responsive markers with severity colors

#### 4. Trend Analysis
- Multi-line chart using Recharts
- 6-week historical data
- 6 disease types tracked
- Interactive legend
- Responsive design

#### 5. Profile Management
- User information display
- Activity statistics
- Navigation to sub-screens
- App metadata and version info

#### 6. Sub-Screens
- **Notifications** - Alert history and updates
- **Settings** - App preferences and configurations
- **Privacy & Security** - Data protection settings
- **Help & Support** - Tutorials, FAQs, contact info

---

## 🏗️ Technical Architecture

### Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.x | UI framework |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.0 | Styling (utility-first) |
| **Vite** | 5.x | Build tool & dev server |
| **Recharts** | Latest | Data visualization |
| **react-simple-maps** | Latest | Geographic visualization |
| **Lucide React** | Latest | Icon library (500+ icons) |
| **Shadcn UI** | Latest | Component library (25+ components) |

### Component Structure

```
App.tsx (Main Entry Point)
├── LoginScreen
├── Dashboard (4 tabs)
│   ├── AlertsList
│   │   └── AlertDetailScreen
│   ├── MapView
│   ├── TrendChart
│   └── ProfileScreen
│       ├── NotificationsScreen
│       ├── SettingsScreen
│       ├── PrivacySecurityScreen
│       └── HelpSupportScreen
├── BottomNavigation
└── QuickStartGuide
```

### State Management
- **React useState** for local component state
- **Props drilling** for parent-child communication
- **Callback functions** for child-to-parent events
- **Controlled components** for forms

### Routing Strategy
- Screen-based routing using conditional rendering
- State variable `currentScreen` determines active screen
- `activeTab` manages bottom navigation
- Back navigation via callback functions

---

## 🎨 Design System

### Color Palette

#### Primary Colors
- **Blue Gradients:** `from-blue-600 to-cyan-600` - Primary actions, headers
- **Dark Background:** `slate-900, slate-800` - Main background layers
- **Glassmorphism:** `backdrop-blur-xl` + opacity - Card effects

#### Severity Colors
- **High (Critical):** Red (`red-500`, `red-400`)
- **Moderate:** Yellow/Orange (`yellow-500`, `orange-400`)
- **Low:** Green (`emerald-400`, `teal-400`)

#### Accent Colors
- **Cyan:** Secondary actions, highlights
- **Emerald:** Success states, positive indicators
- **Purple/Pink:** Special features, featured content

### Typography
- **Font Family:** System font stack (default)
- **Sizes:** Controlled via CSS variables
- **Weights:** 400 (normal), 500 (medium), 600 (semibold)
- **No Explicit Classes:** Avoiding `text-2xl`, `font-bold`, etc. per guidelines

### Component Design Patterns

#### Glass Cards
```tsx
className="bg-slate-800/50 border-slate-700/50 backdrop-blur-xl"
```

#### Gradient Buttons
```tsx
className="bg-gradient-to-r from-blue-600 to-cyan-600"
```

#### Hover Effects
```tsx
className="hover:scale-105 transition-all duration-300"
```

#### Icon Containers
```tsx
className="w-10 h-10 bg-blue-500/20 rounded-xl border border-blue-500/30"
```

---

## 📊 Data Structure

### Mock Outbreak Data
```typescript
{
  id: number;
  disease: string;
  location: {
    lat: number;
    lng: number;
    name: string;
    country: string;
    region: string;
  };
  severity: "high" | "moderate" | "low";
  cases: number;
  date: string;
}
```

### Mock Alert Data
```typescript
{
  id: number;
  title: string;
  description: string;
  severity: "high" | "moderate" | "low";
  time: string;
  location: string;
  country: string;
  region: string;
}
```

### Trend Data
```typescript
{
  week: string;
  dengue: number;
  malaria: number;
  cholera: number;
  influenza: number;
  yellowFever: number;
  measles: number;
}
```

---

## 🌍 Geographic Coverage

### Countries Monitored
1. **India** - Mumbai (Dengue Fever)
2. **Kenya** - Nairobi (Malaria)
3. **Bangladesh** - Dhaka (Cholera)
4. **USA** - New York (Influenza A)
5. **Brazil** - São Paulo (Yellow Fever)
6. **Singapore** - Singapore (Typhoid)
7. **France** - Paris (Measles)
8. **Australia** - Sydney (Zika Virus)

### Continental Coverage
- **Asia** (3 countries)
- **Africa** (1 country)
- **North America** (1 country)
- **South America** (1 country)
- **Europe** (1 country)
- **Oceania** (1 country)

---

## 🔐 Security & Privacy

### Authentication
- **Type:** Demo authentication (for evaluation)
- **Login:** Any email/password combination works
- **Session:** Maintained via React state
- **Logout:** Clears state and returns to login

### Data Handling
- **No Backend:** All data is local/mock
- **No Database:** No persistent storage
- **No API Calls:** Except map tile loading
- **No PII:** No real user data collected

### Important Notes
⚠️ **Not Production-Ready** - This is a demonstration app  
⚠️ **No Real Data** - Uses mock outbreak information  
⚠️ **Demo Only** - Not suitable for actual health monitoring  

---

## 📱 Screen Specifications

### Login Screen
- **Purpose:** Authentication entry point
- **Components:** Email input, password input, login button
- **Features:** Form validation, demo credentials info, app info banner
- **Dimensions:** Full viewport (393×852px)

### Dashboard - Alerts Tab
- **Purpose:** Primary alert monitoring
- **Components:** Stats cards, alert list, refresh button
- **Features:** Severity badges, tap-to-view details, notification bell
- **Scroll:** Vertical scrolling for alert list

### Dashboard - Map Tab
- **Purpose:** Geographic outbreak visualization
- **Components:** World map, markers, tooltips
- **Features:** Interactive map, zoom/pan, severity-coded markers
- **Library:** react-simple-maps

### Dashboard - Trends Tab
- **Purpose:** Historical trend analysis
- **Components:** Multi-line chart, legend, time axis
- **Features:** 6-week data, 6 disease types, hover tooltips
- **Library:** Recharts

### Dashboard - Profile Tab
- **Purpose:** User profile and settings access
- **Components:** Avatar, stats, menu items, app info
- **Features:** Navigation to sub-screens, logout button
- **Scroll:** Vertical scrolling

### Alert Detail Screen
- **Purpose:** Detailed alert information
- **Components:** Alert header, description, location map, action buttons
- **Features:** Back navigation, "View on Map" button
- **Navigation:** Slides in from right (via screen change)

### Notifications Screen
- **Purpose:** Alert history and updates
- **Components:** Notification list, filter options
- **Features:** Read/unread states, tap to view alert
- **Access:** Via bell icon or Profile menu

### Settings Screen
- **Purpose:** App preferences
- **Components:** Toggle switches, select dropdowns
- **Features:** Language, notifications, data sync settings
- **Access:** Via Profile menu

### Privacy & Security Screen
- **Purpose:** Data protection settings
- **Components:** Privacy toggles, security options
- **Features:** Data sharing controls, security preferences
- **Access:** Via Profile menu

### Help & Support Screen
- **Purpose:** User assistance and tutorials
- **Components:** Tabs (Tutorials, FAQs, Contact)
- **Features:** Video tutorials, setup guides, quick start
- **Special:** Featured "How to Run the App" tutorial with placeholder video player
- **Access:** Via Profile menu

### Quick Start Guide (Overlay)
- **Purpose:** First-time user onboarding
- **Components:** Feature highlights, tips, CTA buttons
- **Features:** Dismissible overlay, appears on first login
- **Trigger:** Automatic on login, manual via Help screen

---

## 🎥 Tutorial System

### Video Tutorial Placeholder
Located in Help & Support → Tutorials tab:

1. **Featured: Getting Started with Sentinel AI (8:45)**
   - Complete setup guide
   - Installation instructions
   - Running the development server
   - Viewing in mobile mode

2. **Understanding the Dashboard (6:30)**
   - Navigation overview
   - Alert system walkthrough
   - Stats interpretation

3. **Alert System Deep Dive (10:15)**
   - Severity levels explained
   - Alert actions and responses
   - Detail view features

4. **Map View Tutorial (5:20)**
   - Interactive map controls
   - Understanding markers
   - Geographic data interpretation

5. **Trend Analysis Guide (7:50)**
   - Chart reading
   - Pattern recognition
   - Data export (future feature)

### Setup Instructions
- **Quick Setup** (code blocks with syntax highlighting)
- **Installation steps** (npm install, npm run dev)
- **Browser DevTools guide** (mobile viewport setup)

---

## 🚀 Setup & Development

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- Modern web browser
- Internet connection (for map tiles)

### Installation
```bash
# Clone repository
git clone <repository-url>
cd sentinel-ai

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:5173
```

### Development Workflow
1. **Edit components** in `/components` directory
2. **Hot reload** automatically refreshes browser
3. **View in mobile mode** (F12 → Device Toolbar → 393×852)
4. **Check console** for errors and warnings

### Build for Production
```bash
npm run build
npm run preview
```

---

## 📈 Performance Considerations

### Optimization Techniques
- **Code splitting:** Components loaded as needed
- **Lazy loading:** Images and heavy components deferred
- **Memoization:** React.memo for expensive renders (where needed)
- **Efficient state:** Minimal re-renders via proper state structure

### Bundle Size
- **React + React-DOM:** ~140 KB (gzipped)
- **Recharts:** ~80 KB (gzipped)
- **react-simple-maps:** ~30 KB (gzipped)
- **Total (estimated):** ~300-400 KB (gzipped)

### Loading Strategy
- **Initial load:** Login screen (minimal)
- **After auth:** Dashboard components loaded
- **Lazy load:** Charts and maps on tab switch
- **Images:** Use ImageWithFallback for graceful degradation

---

## 🐛 Known Limitations

### Technical Constraints
1. **Web-Only:** Not a React Native app (browser-based only)
2. **Mock Data:** No real API integration
3. **Static Updates:** Simulated real-time (no WebSockets)
4. **No Backend:** All data is local/client-side
5. **Demo Auth:** Any credentials work (no real security)

### Environment Limitations
1. **Figma Make:** Only supports React web apps (not React Native)
2. **No Native Features:** No access to device APIs (camera, GPS, etc.)
3. **Browser-Dependent:** Requires modern browser with ES6+ support
4. **Internet Required:** For map tiles (react-simple-maps)

### Design Limitations
1. **Fixed Viewport:** Designed for 393×852px (not fully responsive)
2. **Mobile-First:** Desktop experience not optimized
3. **Single Language:** English only (no i18n)
4. **Mock Scenarios:** Limited to predefined outbreak data

---

## 🎓 Educational Value

### Learning Demonstrations

#### React Concepts
- ✅ Component composition
- ✅ Props and state management
- ✅ Event handling
- ✅ Conditional rendering
- ✅ List rendering with keys
- ✅ Form handling
- ✅ Controlled components

#### TypeScript
- ✅ Interface definitions
- ✅ Type annotations
- ✅ Union types
- ✅ Optional properties
- ✅ Generic components

#### Tailwind CSS
- ✅ Utility-first approach
- ✅ Responsive design
- ✅ Custom animations
- ✅ Gradient backgrounds
- ✅ Glassmorphism effects

#### UI/UX Principles
- ✅ Mobile-first design
- ✅ Touch-friendly targets
- ✅ Clear visual hierarchy
- ✅ Consistent color coding
- ✅ Intuitive navigation
- ✅ Accessibility considerations

---

## 📚 Documentation Files

### Available Documentation
1. **README.md** - Comprehensive project documentation (full guide)
2. **SETUP_GUIDE.md** - Quick setup instructions (5-minute start)
3. **PROJECT_OVERVIEW.md** - This file (architecture and design)
4. **Guidelines.md** - Development guidelines (auto-generated)

### In-App Help
- **Quick Start Guide** - Interactive overlay (first-time users)
- **Video Tutorials** - Placeholder videos with setup guides
- **FAQs** - Common questions and answers
- **Contact Info** - Support channels (demo)

---

## 🔮 Future Enhancements (Not Implemented)

### Potential Features
- Real API integration (WHO, CDC, etc.)
- Real-time WebSocket updates
- Advanced filtering and search
- Data export (CSV, PDF)
- Multi-language support (i18n)
- Dark/light theme toggle
- Offline mode with service workers
- Push notifications (web)
- User authentication (real)
- Database integration
- Admin dashboard
- Custom alert creation
- Email/SMS notifications
- Advanced analytics

---

## 📄 License

This is a student project for Project Phase 1 evaluation.  
Not licensed for commercial use or production deployment.

---

## 🙏 Acknowledgments

### Libraries & Tools
- **React Team** - React framework
- **Tailwind Labs** - Tailwind CSS
- **Shadcn** - UI component library
- **Recharts** - Chart library
- **react-simple-maps** - Map visualization
- **Lucide** - Icon library
- **Vite** - Build tooling

### Design Inspiration
- Modern health-tech applications
- Government dashboard systems
- Clinical monitoring interfaces

---

## 📞 Support

### For Evaluation
- Review code in `/components` directory
- Check design system in `/styles/globals.css`
- Test all navigation flows
- Verify mobile viewport (393×852px)
- Review README.md for complete documentation

### For Setup Issues
- See **SETUP_GUIDE.md** for quick start
- Check **Troubleshooting** section in README
- Access in-app **Help & Support**
- Review console for error messages

---

<div align="center">
  <h2>🦠 Sentinel AI 🔬</h2>
  <p><strong>Monitoring Global Health, One Alert at a Time</strong></p>
  <p>Built with ❤️ for Project Phase 1 Evaluation</p>
  <p>React Web Application • Mobile-Optimized • Production-Quality UI</p>
</div>
