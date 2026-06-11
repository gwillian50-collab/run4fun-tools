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

// Training paces based on VDOT using Daniels' intensity percentages
export function getTrainingPaces(vdot: number): TrainingPaces {
  // Easy: 59-74% vVO2max (approx 65-78% HRmax)
  // Using intensity multipliers from Daniels' tables
  const easyMinVelocity = vdot * 0.59 * 14.49; // m/min at lower easy
  const easyMaxVelocity = vdot * 0.74 * 14.49;
  
  // These are approximate using VO2 to velocity conversion
  // Better: use the pace predictions from known percentages
  const easyMinPace = velocityToPaceSeconds(easyMaxVelocity); // faster end
  const easyMaxPace = velocityToPaceSeconds(easyMinVelocity); // slower end

  // Marathon pace: ~75-84% vVO2max
  const mVelocity = vdot * 0.80 * 14.49;
  const marathon = velocityToPaceSeconds(mVelocity);

  // Threshold: ~86-88% vVO2max (roughly 1hr race pace)
  // Best computed from ~60min race equivalent
  const tVelocity = vdot * 0.88 * 14.49;
  const threshold = velocityToPaceSeconds(tVelocity);

  // Interval: ~97-100% vVO2max
  const iVelocity = vdot * 0.975 * 14.49;
  const interval = velocityToPaceSeconds(iVelocity);

  // Repetition: ~105-120% vVO2max (faster than race pace)
  const rVelocity = vdot * 1.10 * 14.49;
  const repetition = velocityToPaceSeconds(rVelocity);

  return {
    easy: { min: easyMinPace, max: easyMaxPace },
    marathon,
    threshold,
    interval,
    repetition,
  };
}

function velocityToPaceSeconds(velocityMPerMin: number): number {
  if (velocityMPerMin <= 0) return 0;
  return Math.round(1000 / velocityMPerMin * 60);
}
