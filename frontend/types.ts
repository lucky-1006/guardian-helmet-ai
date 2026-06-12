export enum AppScreen {
  ONBOARDING = 'ONBOARDING',
  SETUP_PROFILE = 'SETUP_PROFILE',
  SETUP_PERMISSIONS = 'SETUP_PERMISSIONS',
  DASHBOARD = 'DASHBOARD',
  HISTORY = 'HISTORY',
  MAP = 'MAP',
  STATUS = 'STATUS',
  SETTINGS = 'SETTINGS',
  RIDE_SUMMARY = 'RIDE_SUMMARY',
}

export interface RiderProfile {
  name: string;
  phone: string;
  emergencyContact: string;
  vehicleNumber: string;
  isConfigured: boolean;
}

export interface SensorData {
  helmetWorn: boolean;
  alcoholLevel: number; // 0-100, >30 is unsafe
  speed: number; // km/h
  impactForce: number; // G-force
  timestamp: number;
}

export interface SimulationOverrides {
  forceCrash: boolean;
  forceDrunk: boolean;
  forceHelmetOff: boolean;
}

export interface RideLog {
  id: string;
  date: string;
  duration: string;
  distance: string;
  avgSpeed: number;
  safetyScore: number; // 0-100
  status: 'Safe' | 'Risky' | 'Incident';
}

export interface Alert {
  id: string;
  type: 'CRASH' | 'ALCOHOL' | 'HELMET' | 'SOS';
  timestamp: string;
  location: string;
  resolved: boolean;
}

export interface ConnectivityStatus {
  bluetooth: boolean;
  wifi: boolean;
}