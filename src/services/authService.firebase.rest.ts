import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance } from 'axios';
import { 
  User, 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse 
} from '../types/auth.types';
import { FIREBASE_AUTH_API, FIREBASE_API_KEY, firebaseConfig } from '../config/firebase';

const TOKEN_KEY = '@epiwatch_token';
const USER_KEY = '@epiwatch_user';
const REFRESH_TOKEN_KEY = '@epiwatch_refresh_token';

/**
 * Firebase Authentication Service (REST API)
 * 
 * Uses Firebase REST API for React Native compatibility
 * Handles user authentication, registration, and profile management with Firestore
 */
class AuthService {
  private firestoreAPI: AxiosInstance;

  constructor() {
    // Firestore REST API client
    this.firestoreAPI = axios.create({
      baseURL: `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`,
      timeout: 10000,
    });
  }

  /**
   * Login user with Firebase Authentication REST API
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // Call Firebase Auth REST API
      const response = await axios.post(
        `${FIREBASE_AUTH_API}:signInWithPassword?key=${FIREBASE_API_KEY}`,
        {
          email: credentials.email,
          password: credentials.password,
          returnSecureToken: true,
        }
      );

      const { idToken, refreshToken, localId } = response.data;

      // Get user data from Firestore
      const userData = await this.getFirestoreUser(localId, idToken);

      // Store tokens and user data
      await this.setToken(idToken);
      await this.setRefreshToken(refreshToken);
      await this.setUser(userData);

      return {
        success: true,
        user: userData,
        token: idToken,
        message: 'Login successful',
      };
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error);

      let message = 'Login failed';
      const errorCode = error.response?.data?.error?.message;

      if (errorCode === 'EMAIL_NOT_FOUND') {
        message = 'No account found with this email';
      } else if (errorCode === 'INVALID_PASSWORD' || errorCode === 'INVALID_LOGIN_CREDENTIALS') {
        message = 'Invalid email or password';
      } else if (errorCode === 'USER_DISABLED') {
        message = 'This account has been disabled';
      } else if (errorCode === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
        message = 'Too many failed attempts. Please try again later';
      }

      return {
        success: false,
        message,
      };
    }
  }

  /**
   * Register new user with Firebase Authentication REST API
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      // Create user in Firebase Auth
      const authResponse = await axios.post(
        `${FIREBASE_AUTH_API}:signUp?key=${FIREBASE_API_KEY}`,
        {
          email: data.email,
          password: data.password,
          returnSecureToken: true,
        }
      );

      const { idToken, refreshToken, localId } = authResponse.data;

      // Create user document in Firestore
      const userData: User = {
        id: localId,
        email: data.email,
        name: data.name,
        role: data.role || 'Health Official',
        organization: data.organization || '',
        location: data.location || '',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await this.createFirestoreUser(localId, userData, idToken);

      // Store tokens and user data
      await this.setToken(idToken);
      await this.setRefreshToken(refreshToken);
      await this.setUser(userData);

      return {
        success: true,
        user: userData,
        token: idToken,
        message: 'Registration successful',
      };
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error);

      let message = 'Registration failed';
      const errorCode = error.response?.data?.error?.message;

      if (errorCode === 'EMAIL_EXISTS') {
        message = 'An account with this email already exists';
      } else if (errorCode === 'INVALID_EMAIL') {
        message = 'Invalid email address';
      } else if (errorCode === 'WEAK_PASSWORD') {
        message = 'Password is too weak. Use at least 6 characters';
      }

      return {
        success: false,
        message,
      };
    }
  }

  /**
   * Get user data from Firestore
   */
  private async getFirestoreUser(userId: string, idToken: string): Promise<User> {
    try {
      const response = await this.firestoreAPI.get(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      const fields = response.data.fields;
      return {
        id: userId,
        email: fields.email?.stringValue || '',
        name: fields.name?.stringValue || '',
        role: fields.role?.stringValue || 'Health Official',
        organization: fields.organization?.stringValue || '',
        location: fields.location?.stringValue || '',
        avatar: fields.avatar?.stringValue || '',
        createdAt: fields.createdAt?.timestampValue || new Date().toISOString(),
        updatedAt: fields.updatedAt?.timestampValue || new Date().toISOString(),
      };
    } catch (error) {
      console.error('Get Firestore user error:', error);
      // Return basic user data if Firestore fetch fails
      return {
        id: userId,
        email: '',
        name: 'User',
        role: 'Health Official',
        organization: '',
        location: '',
        avatar: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  }

  /**
   * Create user document in Firestore
   */
  private async createFirestoreUser(userId: string, userData: User, idToken: string): Promise<void> {
    try {
      await this.firestoreAPI.patch(
        `/users/${userId}`,
        {
          fields: {
            name: { stringValue: userData.name },
            email: { stringValue: userData.email },
            role: { stringValue: userData.role },
            organization: { stringValue: userData.organization },
            location: { stringValue: userData.location },
            avatar: { stringValue: userData.avatar },
            createdAt: { timestampValue: userData.createdAt },
            updatedAt: { timestampValue: userData.updatedAt },
          },
        },
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );
    } catch (error) {
      console.error('Create Firestore user error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY, REFRESH_TOKEN_KEY]);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Get stored token
   */
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  }

  /**
   * Store token
   */
  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Set token error:', error);
    }
  }

  /**
   * Get stored refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Get refresh token error:', error);
      return null;
    }
  }

  /**
   * Store refresh token
   */
  async setRefreshToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Set refresh token error:', error);
    }
  }

  /**
   * Get stored user
   */
  async getUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  /**
   * Store user
   */
  async setUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Set user error:', error);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<User>): Promise<{ success: boolean; message: string }> {
    try {
      const token = await this.getToken();
      const currentUser = await this.getUser();

      if (!token || !currentUser) {
        return { success: false, message: 'No user logged in' };
      }

      // Update Firestore document
      const fields: any = {};
      if (updates.name) fields.name = { stringValue: updates.name };
      if (updates.organization) fields.organization = { stringValue: updates.organization };
      if (updates.location) fields.location = { stringValue: updates.location };
      fields.updatedAt = { timestampValue: new Date().toISOString() };

      await this.firestoreAPI.patch(
        `/users/${currentUser.id}?updateMask.fieldPaths=name&updateMask.fieldPaths=organization&updateMask.fieldPaths=location&updateMask.fieldPaths=updatedAt`,
        { fields },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local user data
      const updatedUser = { ...currentUser, ...updates, updatedAt: new Date().toISOString() };
      await this.setUser(updatedUser);

      return { success: true, message: 'Profile updated successfully' };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return { success: false, message: error.message || 'Failed to update profile' };
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  /**
   * Get current user and refresh token if needed
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = await this.getToken();
      const user = await this.getUser();

      if (!token || !user) {
        return null;
      }

      // Optionally refresh the token here if needed
      // For now, just return the stored user
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }
}

export default new AuthService();
