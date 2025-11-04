// ============================================
// EpiWatch API Type Definitions
// ============================================

/**
 * Health Check Response
 * Endpoint: GET /health
 */
export interface HealthResponse {
  status: string;
  timestamp: string;
  database?: string;
  model?: string;
  service?: string;
  version?: string;
}

/**
 * Dashboard Statistics Response
 * Endpoint: GET /stats
 */
export interface DashboardStats {
  total_cases: number;
  countries: number;
  critical_alerts: number;
  regions_monitored: number;
  active_alerts: number;
  last_update: string;
  // Computed for backwards compatibility
  total_outbreaks?: number;
  active_diseases?: number;
  affected_countries?: number;
  last_updated?: string;
  top_diseases?: TopDisease[];
}

export interface TopDisease {
  disease: string;
  current_count: number;
  change_pct: number;
  trend: 'up' | 'down' | 'stable';
}

/**
 * Alert Response
 * Endpoint: GET /alerts
 * 
 * New API format
 */
export interface Alert {
  id: number;
  title: string;
  location: string;
  risk_level: 'critical' | 'high' | 'moderate' | 'low';
  case_count: number;
  date: string;
  summary: string;
  color: string;
  
  // Computed properties for backwards compatibility
  timestamp?: string;
  disease?: string;
  city_location?: string;
  context_description?: string;
  actual_count?: number;
  expected_count?: number;
  deviation?: number;
  deviation_pct?: number;
  severity?: number;
  severity_level?: 'critical' | 'high' | 'moderate' | 'low';
  anomaly_type?: string;
  z_score?: number;
  message?: string;
  description?: string;
  time?: string;
}

/**
 * Map Outbreak Data
 * Endpoint: GET /map
 * New API format
 */
export interface MapOutbreak {
  region: string;
  risk_level: 'critical' | 'high' | 'moderate' | 'low';
  alert_count: number;
  color: string;
  
  // Computed for backwards compatibility
  id?: string;
  disease?: string;
  country?: string;
  iso3?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  cases?: number;
  outbreak_count?: number;
  year?: number;
  date?: string;
  location?: {
    name: string;
    country: string;
    lat: number;
    lng: number;
  };
  severity?: 'critical' | 'high' | 'moderate' | 'low';
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
