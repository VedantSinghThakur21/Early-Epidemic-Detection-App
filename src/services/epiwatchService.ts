import { AxiosResponse } from 'axios';
import { apiClient, retryRequest } from './axiosConfig';
import {
  HealthResponse,
  DashboardStats,
  Alert,
  AlertsParams,
  MapOutbreak,
  MapParams,
  TrendsResponse,
  TrendsParams,
  DiseasesResponse,
} from '../types/epiwatch.types';

/**
 * EpiWatch API Service
 * 
 * Provides typed methods for all EpiWatch API endpoints
 */
class EpiWatchService {
  
  /**
   * Health Check
   * Endpoint: GET /health
   * Use this to verify API availability
   */
  async getHealth(): Promise<HealthResponse> {
    try {
      console.log('[EpiWatch] Checking API health...');
      const response: AxiosResponse<HealthResponse> = await apiClient.get('/health');
      console.log('[EpiWatch] API is healthy:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[EpiWatch] Health check failed:', error.message);
      if (error.code === 'ECONNABORTED') {
        throw new Error('API is waking up. This may take up to 60 seconds. Please wait...');
      } else if (error.request && !error.response) {
        throw new Error('Cannot connect to server. Please check your internet connection.');
      }
      throw error;
    }
  }

  /**
   * Dashboard Statistics
   * Endpoint: GET /stats
   * Returns comprehensive outbreak statistics
   */
  async getStatistics(): Promise<DashboardStats> {
    try {
      console.log('[EpiWatch] Fetching statistics...');
      // Use retry logic for critical endpoints
      const data = await retryRequest(async () => {
        const response: AxiosResponse<DashboardStats> = await apiClient.get('/stats');
        return response.data;
      }, 3, 3000); // 3 retries, 3 second delay
      console.log('[EpiWatch] Statistics loaded:', data);
      return data;
    } catch (error: any) {
      console.error('[EpiWatch] Failed to fetch statistics:', error.message);
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        throw new Error('API is waking up from sleep. Please wait 30-60 seconds and try again.');
      } else if (error.request && !error.response) {
        throw new Error('Network error. Please check your internet connection.');
      }
      throw error;
    }
  }

  /**
   * Get Alerts
   * Endpoint: GET /alerts
   * @param params - Query parameters for filtering alerts
   */
  async getAlerts(params?: AlertsParams): Promise<Alert[]> {
    try {
      const response: AxiosResponse<Alert[]> = await apiClient.get('/alerts', {
        params: {
          limit: params?.limit || 20,
          severity: params?.severity,
          disease: params?.disease,
        },
      });
      return response.data;
    } catch (error) {
      console.error('[EpiWatch] Failed to fetch alerts:', error);
      throw error;
    }
  }

  /**
   * Get Map Data
   * Endpoint: GET /map
   * Returns outbreak data for map visualization
   */
  async getMapData(params?: MapParams): Promise<MapOutbreak[]> {
    try {
      const response: AxiosResponse<MapOutbreak[]> = await apiClient.get('/map', {
        params: {
          year: params?.year,
          disease: params?.disease,
        },
      });
      return response.data;
    } catch (error) {
      console.error('[EpiWatch] Failed to fetch map data:', error);
      throw error;
    }
  }

  /**
   * Get 7-Day Trends
   * Endpoint: GET /trends
   * Returns trend analysis for specified diseases
   * Note: This endpoint returns 500 error on the new API
   */
  async getTrends(params?: TrendsParams): Promise<TrendsResponse> {
    try {
      const response: AxiosResponse<TrendsResponse> = await apiClient.get('/trends', {
        params: {
          diseases: params?.diseases,
        },
      });
      return response.data;
    } catch (error) {
      // Suppress error logging for broken endpoint
      console.log('[EpiWatch] Trends endpoint unavailable (500 error) - using fallback data');
      throw error;
    }
  }

  /**
   * Get All Diseases
   * Endpoint: GET /diseases
   * Returns list of all tracked diseases
   */
  async getDiseases(): Promise<DiseasesResponse> {
    try {
      const response: AxiosResponse<DiseasesResponse> = await apiClient.get('/diseases');
      return response.data;
    } catch (error) {
      console.error('[EpiWatch] Failed to fetch diseases list:', error);
      throw error;
    }
  }

  /**
   * Wake up API (call before critical operations)
   * This endpoint is typically faster and helps wake the service
   */
  async wakeUpApi(): Promise<boolean> {
    try {
      await this.getHealth();
      return true;
    } catch (error) {
      console.warn('[EpiWatch] Wake-up call failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const epiwatchService = new EpiWatchService();
export default epiwatchService;
