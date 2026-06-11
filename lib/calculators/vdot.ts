/**
 * VDOT Calculator based on Jack Daniels' Running Formula
 * Uses the official Daniels/Gilbert oxygen power formula
 */

// Velocity in meters per minute from pace (min/km)
function paceToVelocity(paceSeconds: number): number {
  return 1000 / (paceSeconds / 60);
}

// VO2 at a given velocity (ml/kg/min)
function velocityToVO2(v: number): number {
  return -4.60 + 0.182258 * v + 0.000104 * v * v;
}

// %VO2max at a given duration (minutes)
function percentVO2Max(t: number): number {
  return 0.8 + 0.1894393 * Math.exp(-0.012778 * t) + 0.2989558 * Math.exp(-0.1932605 * t);
}

// Calculate VDOT from a race performance
export function calculateVDOT(distanceMeters: number, timeSeconds: number): number {
  const t = timeSeconds / 60; // time in minutes
  const v = distanceMeters / t; // velocity in m/min
  const vo2 = velocityToVO2(v);
  const pct = percentVO2Max(t);
  const vdot = vo2 / pct;
  return Math.round(vdot * 10) / 10;
}

// Calculate race time in seconds for a given distance and VDOT
export function predictTime(distanceMeters: number, vdot: number): number {
  // Binary search for the time that produces the target VDOT
  let lo = 60; // 1 minute
  let hi = 86400; // 24 hours

  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    const t = mid / 60;
    const v = distanceMeters / t;
    const vo2 = velocityToVO2(v);
    const pct = percentVO2Max(t);
    const estimatedVDOT = vo2 / pct;

    if (estimatedVDOT > vdot) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  return Math.round((lo + hi) / 2);
}

export interface TrainingPaces {
  easy: { min: number; max: number }; // seconds per km
  marathon: number;
  threshold: number;
  interval: number;
  repetition: number;
}

// Inverse of velocityToVO2: find velocity (m/min) for a target VO2 via binary search
function vo2ToVelocity(targetVO2: number): number {
  let lo = 1.0;
  let hi = 1500.0;
  for (let i = 0; i < 64; i++) {
    const mid = (lo + hi) / 2;
    if (velocityToVO2(mid) < targetVO2) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// Training paces based on VDOT using Daniels' %VO2max intensities
export function getTrainingPaces(vdot: number): TrainingPaces {
  return {
    easy: {
      min: velocityToPaceSeconds(vo2ToVelocity(vdot * 0.74)), // faster end (74% VO2max)
      max: velocityToPaceSeconds(vo2ToVelocity(vdot * 0.59)), // slower end (59% VO2max)
    },
    marathon: velocityToPaceSeconds(vo2ToVelocity(vdot * 0.80)),
    threshold: velocityToPaceSeconds(vo2ToVelocity(vdot * 0.88)),
    interval: velocityToPaceSeconds(vo2ToVelocity(vdot * 0.975)),
    repetition: velocityToPaceSeconds(vo2ToVelocity(vdot * 1.10)),
  };
}

function velocityToPaceSeconds(velocityMPerMin: number): number {
  if (velocityMPerMin <= 0) return 0;
  return Math.round(1000 / velocityMPerMin * 60);
}
