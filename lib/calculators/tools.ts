import { formatTime, formatPace } from "./pace";

/** Calculate lap times from pace (sec/km) */
export function calculateLaps(paceSeconds: number) {
  const laps = [
    { label: "100m", meters: 100 },
    { label: "200m", meters: 200 },
    { label: "400m", meters: 400 },
    { label: "800m", meters: 800 },
    { label: "1 km", meters: 1000 },
  ];
  return laps.map(({ label, meters }) => ({
    label,
    time: formatTime(Math.round((paceSeconds * meters) / 1000)),
  }));
}

export const RACE_DISTANCES = [
  { label: "Maratona", meters: 42195 },
  { label: "Meia Maratona", meters: 21097 },
  { label: "10 Milhas", meters: 16093 },
  { label: "15 km", meters: 15000 },
  { label: "10 km", meters: 10000 },
  { label: "8 km", meters: 8000 },
  { label: "6 km", meters: 6000 },
  { label: "5 km", meters: 5000 },
  { label: "2 Milhas", meters: 3219 },
  { label: "3200 m", meters: 3200 },
  { label: "3 km", meters: 3000 },
  { label: "1 Milha", meters: 1609 },
  { label: "1600 m", meters: 1600 },
  { label: "1500 m", meters: 1500 },
];

import { predictTime } from "./vdot";

export function calculateEquivalents(vdot: number) {
  return RACE_DISTANCES.map(({ label, meters }) => {
    const timeSeconds = predictTime(meters, vdot);
    const paceSeconds = Math.round((timeSeconds / meters) * 1000);
    return {
      label,
      meters,
      time: formatTime(timeSeconds),
      pace: formatPace(paceSeconds) + "/km",
    };
  });
}

export interface GoalSuggestion {
  label: string;
  targetSeconds: number;
  paceSeconds: number;
  pace: string;
  time: string;
}

export function calculateGoals(
  distanceMeters: number,
  currentTimeSeconds: number
): GoalSuggestion[] {
  const targets: number[] = [];

  // Generate targets at round numbers below current time
  const step = distanceMeters >= 10000 ? 300 : distanceMeters >= 5000 ? 60 : 30;
  const minTarget = Math.max(currentTimeSeconds * 0.75, 60);

  let t = currentTimeSeconds - step;
  while (t >= minTarget) {
    targets.push(Math.floor(t / step) * step);
    t -= step;
    if (targets.length >= 6) break;
  }

  return targets.map((target) => {
    const paceSeconds = Math.round((target / distanceMeters) * 1000);
    return {
      label: `Sub ${formatTime(target + 1)}`,
      targetSeconds: target,
      paceSeconds,
      pace: formatPace(paceSeconds) + "/km",
      time: formatTime(target),
    };
  });
}
