import axios, { AxiosInstance, AxiosError } from 'axios';

/**
 * EpiWatch API Configuration
 * 
 * IMPORTANT: This API is hosted on a free tier service that:
 * - Spins down after 15 minutes of inactivity
 * - Takes ~30 seconds to wake up on first request
 * - Requires longer timeout settings
 */

const API_BASE_URL = 'https://epiwatch-api-qil4.onrender.com';
const API_VERSION = 'api/v1';

// Timeout configuration (in milliseconds)
const TIMEOUTS = {
  REQUEST: 60000,  // 60 seconds - handles cold start
  RETRY: 70000,    // 70 seconds for retries
};

/**
 * Create and configure Axios instance
 */
export const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${API_BASE_URL}/${API_VERSION}`,
    timeout: TIMEOUTS.REQUEST,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    // React Native specific configuration
    validateStatus: (status) => status >= 200 && status < 300,
    maxRedirects: 5,
  });

  // Request Interceptor - Add logging and authentication if needed
  instance.interceptors.request.use(
    (config) => {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
      
      // You can add authentication headers here if needed in the future
      // config.headers.Authorization = `Bearer ${token}`;
      
      return config;
    },
    (error) => {
      console.error('[API Request Error]', error);
      return Promise.reject(error);
    }
  );

  // Response Interceptor - Handle errors globally
  instance.interceptors.response.use(
    (response) => {
      console.log(`[API Response] ${response.status} ${response.config.url}`);
      return response;
    },
    (error: AxiosError) => {
      // Enhanced error logging for debugging
      console.error('[API Error Details]', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      });

      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        console.error('[API Timeout] Request took too long. API may be waking up from sleep...');
        error.message = 'Request timeout. The API might be waking up (takes ~30-60 seconds). Please wait and try again.';
      } else if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
        console.error('[DNS Error] Could not resolve hostname');
        error.message = 'Could not connect to server. Please check your internet connection.';
      } else if (error.code === 'ECONNREFUSED') {
        console.error('[Connection Refused] Server refused connection');
        error.message = 'Server connection refused. The API may be temporarily unavailable.';
      } else if (error.response) {
        // Server responded with error status
        console.error(`[API Error] ${error.response.status}:`, error.response.data);
        error.message = `Server error: ${error.response.status} ${error.response.statusText}`;
      } else if (error.request) {
        // Request made but no response
        console.error('[API Network Error] No response received from server');
        error.message = 'No response from server. Please check your internet connection and try again.';
      } else {
        console.error('[API Error]', error.message);
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
};

/**
 * Singleton Axios instance for EpiWatch API
 */
export const apiClient: AxiosInstance = createAxiosInstance();

/**
 * Retry logic for handling cold starts
 */
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 2,
  delay: number = 2000
): Promise<T> => {
  let lastError: any;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      if (i < maxRetries) {
        console.log(`[Retry] Attempt ${i + 1} of ${maxRetries}. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};

/**
 * Test API connectivity
 * Useful for debugging network issues
 */
export const testConnection = async (): Promise<{
  success: boolean;
  message: string;
  responseTime?: number;
}> => {
  const startTime = Date.now();
  
  try {
    const response = await axios.get(`${API_BASE_URL}/${API_VERSION}/health`, {
      timeout: 10000, // 10 second timeout for quick test
    });
    
    const responseTime = Date.now() - startTime;
    
    return {
      success: true,
      message: `Connected successfully in ${(responseTime / 1000).toFixed(2)}s`,
      responseTime,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Connection failed',
    };
  }
};
