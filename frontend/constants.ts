import { RideLog, Alert } from './types';

export const MOCK_RIDE_HISTORY: RideLog[] = [
  { id: '1', date: 'Today, 8:30 AM', duration: '24m', distance: '12km', avgSpeed: 35, safetyScore: 98, status: 'Safe' },
  { id: '2', date: 'Yesterday, 6:15 PM', duration: '45m', distance: '18km', avgSpeed: 42, safetyScore: 85, status: 'Risky' },
  { id: '3', date: 'Mon, 9:00 AM', duration: '15m', distance: '5km', avgSpeed: 28, safetyScore: 100, status: 'Safe' },
];

export const MOCK_ALERTS: Alert[] = [
  { id: 'a1', type: 'HELMET', timestamp: 'Yesterday, 6:20 PM', location: 'Main St. Junction', resolved: true },
  { id: 'a2', type: 'ALCOHOL', timestamp: 'Last Week', location: 'Downtown', resolved: true },
];

export const ONBOARDING_STEPS = [
  {
    title: "Your Helmet. Your Guardian.",
    desc: "AI-powered protection that watches over every ride.",
    icon: "Shield"
  },
  {
    title: "Smart Prevention",
    desc: "Real-time sensors detect helmet usage and alcohol levels instantly.",
    icon: "Cpu"
  },
  {
    title: "Instant Emergency Response",
    desc: "Accident detection triggers immediate alerts to your loved ones.",
    icon: "Zap"
  }
];

export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';