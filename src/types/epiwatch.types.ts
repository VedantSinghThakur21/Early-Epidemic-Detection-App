// ============================================
// EpiWatch API Type Definitions
// ============================================

/**
 * Health Check Response
 * Endpoint: GET /api/v1/health
 */
export interface HealthResponse {
  status: string;
  timestamp: string;
  service: string;
  version: string;
}

/**
 * Dashboard Statistics Response
 * Endpoint: GET /api/v1/statistics
 */
export interface DashboardStats {
  total_outbreaks: number;
  active_diseases: number;
  affected_countries: number;
  last_updated: string;
  top_diseases: TopDisease[];
}

export interface TopDisease {
  disease: string;
  current_count: number;
  change_pct: number;
  trend: 'up' | 'down' | 'stable';
}

/**
 * Alert Response
 * Endpoint: GET /api/v1/alerts
 * 
 * Note: The API returns alerts as anomaly detections with severity scores
 * 
 * ⚠️ API Inconsistency:
 * - Query parameter: severity='medium'
 * - Response field: severity_level='moderate'
 * Our app handles this conversion automatically.
 */
export interface Alert {
  id: string;
  timestamp: string;
  disease: string;
  location: string;
  city_location: string;
  context_description: string;
  date: string;
  actual_count: number;
  expected_count: number;
  deviation: number;
  deviation_pct: number;
  severity: number; // Severity score (0-100)
  severity_level: 'critical' | 'high' | 'moderate' | 'low'; // API returns 'moderate' not 'medium'
  anomaly_type: string;
  z_score: number;
  message: string;
  
  // Computed properties for UI compatibility
  title?: string;
  description?: string;
  time?: string; // Relative time like "47 minutes ago"
}

/**
 * Map Outbreak Data
 * Endpoint: GET /api/v1/map
 */
export interface MapOutbreak {
  id: string;
  disease: string;
  country: string;
  iso3: string;
  latitude: number;
  longitude: number;
  outbreak_count: number;
  risk_level: 'critical' | 'high' | 'moderate' | 'low';
  year: number;
  
  // Computed properties for UI compatibility
  location?: {
    name: string;
    country: string;
    lat: number;
    lng: number;
  };
  severity?: 'critical' | 'high' | 'moderate' | 'low';
  cases?: number;
}

/**
 * Disease Trend Data
 * Endpoint: GET /api/v1/trends
 * 
 * The API returns an array of disease trends, not a wrapped object
 */
export interface DiseaseTrend {
  disease: string;
  total_count: number;
  trend_data: Array<{
    date: string;
    count: number;
  }>;
  change_pct: number;
  trend_direction: 'up' | 'down' | 'stable';
  severity: 'major' | 'moderate' | 'minor';
  description: string;
}

// API returns array directly, not wrapped
export type TrendsResponse = DiseaseTrend[];

/**
 * Diseases List Response
 * Endpoint: GET /api/v1/diseases
 */
export interface DiseasesResponse {
  diseases: string[];
  total_count: number;
}

/**
 * Generic API Error Response
 */
export interface ApiError {
  error: string;
  message: string;
  status_code: number;
}

/**
 * API Request Parameters
 */
export interface AlertsParams {
  limit?: number;
  severity?: 'critical' | 'high' | 'medium' | 'low'; // API expects 'medium' in params
  disease?: string;
}

export interface MapParams {
  year?: number;
  disease?: string;
}

export interface TrendsParams {
  diseases?: string; // Comma-separated disease names
}
