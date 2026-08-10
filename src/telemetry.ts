import { DiveTelemetryLog } from './types';

const TELEMETRY_KEY = 'one_breath_telemetry_logs_v1';
const SESSION_ID_KEY = 'one_breath_session_id_v1';

export function getOrCreateSessionId(): string {
  let id = localStorage.getItem(SESSION_ID_KEY);
  if (!id) {
    id = 'session_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
    localStorage.setItem(SESSION_ID_KEY, id);
  }
  return id;
}

export function loadTelemetryLogs(): DiveTelemetryLog[] {
  try {
    const raw = localStorage.getItem(TELEMETRY_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to load telemetry logs', e);
  }
  return [];
}

export function appendTelemetryLog(log: DiveTelemetryLog) {
  const current = loadTelemetryLogs();
  current.push(log);
  try {
    localStorage.setItem(TELEMETRY_KEY, JSON.stringify(current));
  } catch (e) {
    console.warn('Failed to save telemetry log', e);
  }
}

export function clearTelemetryLogs() {
  localStorage.removeItem(TELEMETRY_KEY);
}

export interface TelemetryAnalysis {
  totalDives: number;
  medianMaxDepth: number;
  drownedPercentage: number;
  sharkHitPercentage: number;
  surfacedPercentage: number;
  stoneCutDepths: number[];
  depthsAfterBasketLoss: Array<{ previousOutcome: string; nextDepth: number }>;
  fishCollectorsVSNonCollectors: {
    collectorAvgDepth: number;
    nonCollectorAvgDepth: number;
    collectorCount: number;
    nonCollectorCount: number;
  };
}

export function analyzeTelemetryLogs(logs: DiveTelemetryLog[]): TelemetryAnalysis {
  if (logs.length === 0) {
    return {
      totalDives: 0,
      medianMaxDepth: 0,
      drownedPercentage: 0,
      sharkHitPercentage: 0,
      surfacedPercentage: 0,
      stoneCutDepths: [],
      depthsAfterBasketLoss: [],
      fishCollectorsVSNonCollectors: {
        collectorAvgDepth: 0,
        nonCollectorAvgDepth: 0,
        collectorCount: 0,
        nonCollectorCount: 0,
      },
    };
  }

  // 1. Median maxDepth
  const depths = logs.map((l) => l.maxDepth).sort((a, b) => a - b);
  const mid = Math.floor(depths.length / 2);
  const medianMaxDepth = depths.length % 2 !== 0 ? depths[mid] : (depths[mid - 1] + depths[mid]) / 2;

  // 2. Drowned / Shark / Surfaced share
  const drownedCount = logs.filter((l) => l.outcome === 'drowned').length;
  const sharkCount = logs.filter((l) => l.outcome === 'shark').length;
  const surfacedCount = logs.filter((l) => l.outcome === 'surfaced').length;

  const drownedPercentage = Math.round((drownedCount / logs.length) * 100);
  const sharkHitPercentage = Math.round((sharkCount / logs.length) * 100);
  const surfacedPercentage = Math.round((surfacedCount / logs.length) * 100);

  // 3. Stone cut depths
  const stoneCutDepths = logs
    .filter((l) => l.stoneCutAtDepth !== null)
    .map((l) => l.stoneCutAtDepth as number);

  // 4. Depths after basket loss
  const depthsAfterBasketLoss: Array<{ previousOutcome: string; nextDepth: number }> = [];
  for (let i = 0; i < logs.length - 1; i++) {
    if (logs[i].outcome === 'shark' || logs[i].outcome === 'drowned') {
      depthsAfterBasketLoss.push({
        previousOutcome: logs[i].outcome,
        nextDepth: logs[i + 1].maxDepth,
      });
    }
  }

  // 5. Fish collectors vs non-collectors
  const fishCollectors = logs.filter((l) => l.fishCollected > 0);
  const nonCollectors = logs.filter((l) => l.fishCollected === 0);

  const collectorAvgDepth = fishCollectors.length
    ? Math.round((fishCollectors.reduce((acc, l) => acc + l.maxDepth, 0) / fishCollectors.length) * 10) / 10
    : 0;

  const nonCollectorAvgDepth = nonCollectors.length
    ? Math.round((nonCollectors.reduce((acc, l) => acc + l.maxDepth, 0) / nonCollectors.length) * 10) / 10
    : 0;

  return {
    totalDives: logs.length,
    medianMaxDepth: Math.round(medianMaxDepth * 10) / 10,
    drownedPercentage,
    sharkHitPercentage,
    surfacedPercentage,
    stoneCutDepths,
    depthsAfterBasketLoss,
    fishCollectorsVSNonCollectors: {
      collectorAvgDepth,
      nonCollectorAvgDepth,
      collectorCount: fishCollectors.length,
      nonCollectorCount: nonCollectors.length,
    },
  };
}
