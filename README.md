# 🌍 EpiWatch - Early Epidemic Detection System

> A real-time global health monitoring application built with React Native and Expo, powered by Firebase Authentication and EpiWatch API.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB)
![Expo](https://img.shields.io/badge/Expo-54.0-000020)
![Firebase](https://img.shields.io/badge/Firebase-REST%20API-FFCA28)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Authentication](#authentication)
- [Contributing](#contributing)

---

## 🎯 Overview

**EpiWatch** is a comprehensive epidemic detection and monitoring system designed for health officials and researchers to track disease outbreaks globally. The application provides real-time alerts, interactive maps, trend analysis, and data visualization to help prevent and respond to health emergencies.

### Key Capabilities:
- 🔴 Real-time disease outbreak alerts
- 🗺️ Interactive global outbreak map with city-level data
- 📊 Historical trend analysis (2010-2025)
- 🔔 Push notifications for critical alerts
- 👤 User authentication with Firebase
- 📱 Cross-platform (iOS, Android, Web)

---

## ✨ Features

### 1. **Dashboard**
- Live statistics: Total cases, affected countries, critical alerts
- Top diseases monitoring (Dengue, Malaria, Cholera, etc.)
- Quick-access cards for key metrics
- Real-time data synchronization

### 2. **Alert System**
- Severity-based color coding (Critical, High, Moderate, Low)
- Detailed alert information with case counts
- Location-based filtering
- Alert history and tracking

### 3. **Interactive Map**
- Global outbreak visualization
- City-level pinpoint markers
- Grouped disease clustering (e.g., COVID-19 instances)
- Risk level indicators
- Tap to view detailed information

### 4. **Trend Analysis**
- Yearly/quarterly disease trends (2010-2025)
- Multi-disease comparison charts
- Historical data visualization
- Expandable time ranges

### 5. **User Authentication**
- Secure Firebase Authentication
- Email/password registration
- User profile management
- Organization and location tracking
- Persistent sessions with AsyncStorage

### 6. **Additional Features**
- Notifications center
- Settings customization
- Privacy & security controls
- Help & support documentation
- Quick start guide for new users

---

## 🛠️ Tech Stack

### Frontend
- **React Native** 0.81.4 - Mobile framework
- **Expo** 54.0.13 - Development platform
- **TypeScript** 5.8.3 - Type safety
- **React Native Web** 0.21.2 - Web compatibility

### UI Components
- **Lucide React Native** - Icon library
- **React Native Charts** - Data visualization
- **Expo Linear Gradient** - Visual effects
- **Custom UI Components** - Tailwind-inspired design system

### State Management & Data
- **React Context API** - Global state (Authentication)
- **Custom Hooks** - Data fetching and caching
- **Axios** - HTTP client with interceptors

### Backend Services
- **Firebase Authentication** (REST API) - User management
- **Cloud Firestore** (REST API) - User profiles database
- **EpiWatch API** - Disease outbreak data
  - Base URL: `https://epiwatch-wmad-refined-2.onrender.com`

### Storage
- **AsyncStorage** - Offline token and user data persistence

### Maps
- **React Native Maps** 1.26.17 - Interactive mapping

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.x
- **npm** >= 9.x or **yarn** >= 1.22
- **Expo CLI** (installed via npx)
- **Expo Go** app on your mobile device (for testing)
- **Android Studio** (for Android development)
- **Xcode** (for iOS development - macOS only)

### Firebase Setup Required
- Firebase project with Authentication enabled
- Firestore database created
- Firebase config credentials

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/VedantSinghThakur21/Early-Epidemic-Detection-App.git
cd Early-Epidemic-Detection-App
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

> **Note**: `--legacy-peer-deps` flag is used to handle React 19 peer dependency conflicts with some packages.

---

## ⚙️ Configuration

### Firebase Configuration

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project

2. **Enable Authentication**:
   - Navigate to **Authentication** → **Sign-in method**
   - Enable **Email/Password** provider

3. **Create Firestore Database**:
   - Navigate to **Firestore Database**
   - Click **Create database**
   - Choose **Start in test mode** (for development)
   - Select your preferred region

4. **Set Firestore Security Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth.uid != null;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

5. **Get Firebase Config**:
   - Go to **Project Settings** → **Your apps**
   - Copy your Firebase configuration
   - Update `src/config/firebase.ts` with your credentials

```typescript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### EpiWatch API

The app uses the EpiWatch public API:
- **Base URL**: `https://epiwatch-wmad-refined-2.onrender.com`
- **Endpoints**: 
  - `/stats` - Dashboard statistics
  - `/alerts` - Active disease alerts
  - `/map` - Geographic outbreak data
  - `/health` - API health status

---

## 🏃 Running the App

### Start the Development Server

```bash
npm start
```

### Run on Specific Platforms

```bash
# iOS (macOS only)
npm run ios

# Android
npm run android

# Web
npm run web
```

### Using Expo Go (Easiest Method)

1. Install **Expo Go** on your mobile device:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Run `npm start`

3. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

---

## 📁 Project Structure

```
Early-Epidemic-Detection-App/
├── src/
│   ├── components/          # React components
│   │   ├── AlertDetailScreen.tsx
│   │   ├── AlertsList.tsx
│   │   ├── BottomNavigation.tsx
│   │   ├── ConnectionStatus.tsx
│   │   ├── HelpSupportScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── MapView.tsx
│   │   ├── NotificationsScreen.tsx
│   │   ├── PrivacySecurityScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── QuickStartGuide.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   ├── TrendChart.tsx
│   │   ├── shared/          # Shared components
│   │   └── ui/              # UI library (40+ components)
│   ├── config/              # Configuration files
│   │   └── firebase.ts      # Firebase config
│   ├── contexts/            # React Context providers
│   │   └── AuthContext.tsx  # Authentication state
│   ├── hooks/               # Custom React hooks
│   │   ├── useApi.ts
│   │   └── useEpiWatch.ts
│   ├── services/            # API services
│   │   ├── authService.firebase.rest.ts
│   │   ├── axiosConfig.ts
│   │   └── epiwatchService.ts
│   ├── styles/              # Global styles
│   ├── types/               # TypeScript definitions
│   │   ├── auth.types.ts
│   │   └── epiwatch.types.ts
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── assets/                  # Images, fonts
├── app.json                 # Expo configuration
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
└── README.md                # This file
```

---

## 🔌 API Integration

### EpiWatch API Endpoints

#### Dashboard Statistics
```typescript
GET /stats
Response: { total_cases, countries, critical_alerts, ... }
```

#### Active Alerts
```typescript
GET /alerts
Response: [{ id, title, location, risk_level, case_count, ... }]
```

#### Map Data
```typescript
GET /map
Response: [{ region, risk_level, alert_count, color }]
```

### Custom Hooks

```typescript
const { data, loading, error, refetch } = useDashboardStats();
const { data: outbreaks } = useMapData();
const { data: alerts } = useAlerts({ limit: 20 });
```

---

## 🔐 Authentication

### Firebase REST API Implementation

Uses Firebase Authentication REST API for React Native compatibility.

#### Registration Flow
1. User submits registration form
2. Creates Firebase Auth account via REST API
3. Creates Firestore user profile
4. Stores token & user data in AsyncStorage
5. Auto-login and redirect to dashboard

#### Login Flow
1. User submits credentials
2. Authenticates with Firebase REST API
3. Fetches user profile from Firestore
4. Stores session data locally
5. Updates AuthContext state

#### Session Persistence
- Tokens stored in AsyncStorage
- Auto-login on app restart
- Secure logout clears all data

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 👥 Authors

- **Vedant Singh Thakur** - [@VedantSinghThakur21](https://github.com/VedantSinghThakur21)

---

## 🙏 Acknowledgments

- **EpiWatch API** - Disease outbreak data
- **Firebase** - Authentication and database
- **Expo Team** - React Native framework
- **Lucide Icons** - Icon library

---

## 📧 Support

For support, open an issue on GitHub or contact the development team.

---

## 🔮 Roadmap

- [ ] Real-time push notifications
- [ ] Offline mode with data sync
- [ ] Multi-language support
- [ ] Advanced filtering
- [ ] Export data (CSV/PDF)
- [ ] Dark mode theme
- [ ] Admin dashboard

---

**Built with ❤️ for global health monitoring**

*Last Updated: November 4, 2025*
