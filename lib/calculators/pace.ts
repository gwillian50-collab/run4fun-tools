/** Convert pace (sec/km) to speed (km/h) */
export function paceToSpeed(paceSeconds: number): number {
  if (paceSeconds <= 0) return 0;
  return Math.round((3600 / paceSeconds) * 100) / 100;
}

/** Convert speed (km/h) to pace (sec/km) */
export function speedToPace(speedKmh: number): number {
  if (speedKmh <= 0) return 0;
  return Math.round(3600 / speedKmh);
}

/** Format seconds to MM:SS */
export function formatPace(totalSeconds: number): string {
  if (totalSeconds <= 0) return "--:--";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/** Parse MM:SS string to total seconds */
export function parsePace(value: string): number | null {
  const parts = value.split(":");
  if (parts.length !== 2) return null;
  const min = parseInt(parts[0], 10);
  const sec = parseInt(parts[1], 10);
  if (isNaN(min) || isNaN(sec) || sec >= 60 || min < 0 || sec < 0) return null;
  return min * 60 + sec;
}

/** Format seconds to H:MM:SS or MM:SS */
export function formatTime(totalSeconds: number): string {
  if (totalSeconds <= 0) return "--:--";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Parse H:MM:SS or MM:SS to total seconds */
export function parseTime(value: string): number | null {
  const parts = value.split(":");
  if (parts.length === 2) {
    const m = parseInt(parts[0], 10);
    const s = parseInt(parts[1], 10);
    if (isNaN(m) || isNaN(s) || s >= 60 || m < 0 || s < 0) return null;
    return m * 60 + s;
  }
  if (parts.length === 3) {
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const s = parseInt(parts[2], 10);
    if (isNaN(h) || isNaN(m) || isNaN(s) || m >= 60 || s >= 60) return null;
    return h * 3600 + m * 60 + s;
  }
  return null;
}
