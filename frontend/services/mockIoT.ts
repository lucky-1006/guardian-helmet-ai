import { SensorData, SimulationOverrides } from '../types';

export const generateMockSensorData = (
  prevData: SensorData | null, 
  overrides: SimulationOverrides
): SensorData => {
  const now = Date.now();
  
  if (overrides.forceCrash) {
    return {
      helmetWorn: true,
      alcoholLevel: 0,
      speed: 0,
      impactForce: 8.5, // Critical Impact
      timestamp: now
    };
  }

  if (overrides.forceDrunk) {
    return {
      helmetWorn: true,
      alcoholLevel: 85, // High alcohol
      speed: 15,
      impactForce: 1.0,
      timestamp: now
    };
  }
  
  // Normal or Helmet Off Simulation
  const helmetStatus = overrides.forceHelmetOff ? false : true;

  // Smoother speed changes for faster polling
  const prevSpeed = prevData ? prevData.speed : 0;
  // Change speed by smaller increments since we poll faster now
  const speedChange = (Math.random() - 0.5) * 2; 
  let newSpeed = Math.max(0, Math.min(120, prevSpeed + speedChange));
  
  // Round to integer for display, but keep float internally if we had state for it
  // For this mock, we just round.
  newSpeed = Math.round(newSpeed);

  // Micro-fluctuations for G-Force (Idle engine vibration simulation)
  const baseG = 1.0;
  const vibration = (Math.random() - 0.5) * 0.05;
  const bump = Math.random() > 0.96 ? Math.random() * 0.3 : 0; // Occasional bump
  
  const newImpact = Math.max(0, baseG + vibration + bump);

  // Alcohol level drift
  const prevAlcohol = prevData ? prevData.alcoholLevel : 0.00;
  const alcoholChange = (Math.random() - 0.5) * 0.02; // Slower drift
  const newAlcohol = Math.max(0, Math.min(0.15, prevAlcohol + alcoholChange));

  return {
    helmetWorn: helmetStatus,
    alcoholLevel: newAlcohol, 
    speed: newSpeed,
    impactForce: Number(newImpact.toFixed(2)),
    timestamp: now
  };
};