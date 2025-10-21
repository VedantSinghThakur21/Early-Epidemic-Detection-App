import { useState, useEffect, useCallback, useRef } from 'react';
import epiwatchService from '../services/epiwatchService';
import {
  DashboardStats,
  Alert,
  AlertsParams,
  MapOutbreak,
  MapParams,
  TrendsResponse,
  DiseasesResponse,
} from '../types/epiwatch.types';
import { useApi, ApiState } from './useApi';

/**
 * Hook for Dashboard Statistics
 */
export function useDashboardStats(): ApiState<DashboardStats> {
  const fetchStats = useCallback(async () => {
    return epiwatchService.getStatistics();
  }, []);
  
  return useApi(fetchStats, true);
}

/**
 * Hook for Alerts with filtering
 */
export function useAlerts(params?: AlertsParams) {
  const [filters, setFilters] = useState<AlertsParams | undefined>(params);
  const initialFetchDone = useRef(false);
  
  const fetchAlerts = useCallback(async () => {
    return epiwatchService.getAlerts(filters);
  }, [filters]);
  
  const state = useApi(fetchAlerts, true);

  const updateFilters = useCallback((newFilters: AlertsParams) => {
    setFilters(newFilters);
    // Manually refetch after filter change
    setTimeout(() => state.refetch(), 0);
  }, [state]);

  return {
    ...state,
    updateFilters,
  };
}

/**
 * Hook for Map Data
 */
export function useMapData(params?: MapParams): ApiState<MapOutbreak[]> {
  const fetchMapData = useCallback(async () => {
    return epiwatchService.getMapData(params);
  }, [params?.year, params?.disease]);
  
  return useApi(fetchMapData, true);
}

/**
 * Hook for Trends Data
 */
export function useTrends(diseases?: string): ApiState<TrendsResponse> {
  const fetchTrends = useCallback(async () => {
    return epiwatchService.getTrends({ diseases });
  }, [diseases]);
  
  return useApi(fetchTrends, true);
}

/**
 * Hook for Diseases List
 */
export function useDiseases(): ApiState<DiseasesResponse> {
  return useApi(() => epiwatchService.getDiseases());
}

/**
 * Hook for API Health Check
 */
export function useApiHealth() {
  const [isHealthy, setIsHealthy] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await epiwatchService.getHealth();
        setIsHealthy(true);
      } catch (error) {
        setIsHealthy(false);
      } finally {
        setChecking(false);
      }
    };

    checkHealth();
  }, []);

  return { isHealthy, checking };
}
