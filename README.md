
# Shopping App (React Native Conversion)

This is a code bundle for the React Native version of the Shopping App. The original project has been converted from a React web application to a React Native mobile application.

## Running the React Native App

### 1. Install Dependencies

First, make sure you have a React Native development environment set up. You can find instructions on the official [React Native website](https://reactnative.dev/docs/environment-setup).

Next, install the required npm packages:

```bash
npm install
```

### 2. Install Additional Libraries

This project requires a few additional libraries for maps, charts, and SVGs. Please install them by running:

```bash
npm install react-native-maps react-native-svg react-native-gifted-charts lucide-react-native
```

If you are targeting iOS, you will also need to install the pods:

```bash
cd ios && pod install
```

### 3. Run the App

To run the application, use the following commands from your project root:

**For Android:**

```bash
npx react-native run-android
```

**For iOS:**

```bash
npx react-native run-ios
```

## Original React Project

The original React web project is still available in the repository. To run it:

1.  Install dependencies: `npm install`
2.  Start the development server: `npm run dev`
