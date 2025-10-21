# API Security Guide

## Current Status ✅
Your codebase is **SECURE** - no API keys were found in your code repository.

## What Was the API Key in Your Screenshot?
The API key visible in your screenshot was likely from:
- Browser DevTools showing network requests
- A third-party service making API calls
- Not stored in your repository

## Best Practices for API Keys

### 1. Use Environment Variables
```javascript
// ✅ GOOD - Using environment variable
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// ❌ BAD - Hardcoded API key
const API_KEY = "AIzaSyCC...";
```

### 2. For React Native/Expo Projects
Install `react-native-dotenv`:
```bash
npm install react-native-dotenv
```

Create `.env` file (already in `.gitignore`):
```
GOOGLE_MAPS_API_KEY=your_actual_key_here
```

Use in your code:
```javascript
import { GOOGLE_MAPS_API_KEY } from '@env';
```

### 3. If You Accidentally Committed an API Key

#### Step 1: Revoke the Exposed Key Immediately
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services → Credentials
3. Find the exposed API key
4. Click "Delete" or "Regenerate"

#### Step 2: Remove from Git History
```bash
# Option 1: Using git filter-repo (recommended)
pip install git-filter-repo
git filter-repo --path-match 'path/to/file/with/key' --invert-paths

# Option 2: Using BFG Repo-Cleaner
java -jar bfg.jar --replace-text passwords.txt your-repo.git
```

#### Step 3: Force Push (⚠️ Warning: Rewrites history)
```bash
git push origin --force --all
```

### 4. Restrict API Keys
Always restrict API keys in Google Cloud Console:
- **Application restrictions**: Set to specific apps/domains
- **API restrictions**: Enable only needed APIs
- **Usage quotas**: Set daily limits to prevent abuse

### 5. Monitor API Usage
- Enable billing alerts in Google Cloud
- Monitor API usage dashboard regularly
- Set up anomaly detection alerts

## Your Current Setup ✅
- `.gitignore` created with `.env` excluded
- `.env.example` created as template
- No API keys found in codebase
- You're following security best practices!

## If You Need to Add API Keys in Future
1. Create `.env` file (copy from `.env.example`)
2. Add your keys to `.env`
3. NEVER commit `.env` (it's in `.gitignore`)
4. Use environment variables in your code
5. Share `.env.example` with team members

## Emergency Contacts
- Google Cloud Support: https://cloud.google.com/support
- Expo Security: https://expo.dev/security
