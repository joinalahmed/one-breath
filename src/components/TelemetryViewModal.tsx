import React from 'react';
import { motion } from 'motion/react';
import { loadTelemetryLogs, analyzeTelemetryLogs } from '../telemetry';

interface TelemetryViewModalProps {
  onClose: () => void;
}

export const TelemetryViewModal: React.FC<TelemetryViewModalProps> = ({ onClose }) => {
  const logs = loadTelemetryLogs();
  const analysis = analyzeTelemetryLogs(logs);

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `one_breath_telemetry_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-slate-950/95 p-4 text-slate-100 overflow-y-auto flex flex-col justify-between"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="max-w-xl mx-auto w-full pb-8"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-xl font-black text-cyan-400">📊 Playtest Telemetry Analytics</h2>
            <p className="text-xs text-slate-400">16:30 Revision Block Diagnostic Dashboard</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* 5 Key Questions Analysis Cards */}
        <div className="space-y-4 mb-6">
          {/* Q1: Progression felt? */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              1. Median Max Depth ({analysis.medianMaxDepth}m)
            </h3>
            <p className="text-xs text-slate-300">
              {logs.length > 3
                ? `Median depth across ${logs.length} logged dives is ${analysis.medianMaxDepth}m.`
                : 'Need more dives logged to calculate depth progression.'}
            </p>
          </div>

          {/* Q2: Drowned % */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              2. Drowned Share ({analysis.drownedPercentage}%) — Target: 15–25%
            </h3>
            <p className="text-xs text-slate-300">
              {analysis.drownedPercentage < 15
                ? 'Below target: Ascent tax may be too generous or players playing very safe.'
                : analysis.drownedPercentage > 25
                ? 'Above target: Ascent tax is punishingly high.'
                : 'Ideal target range achieved! Risk vs reward is well balanced.'}
            </p>
          </div>

          {/* Q3: Stone cut depth clustering */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              3. Weight Stone Cuts ({analysis.stoneCutDepths.length} cuts)
            </h3>
            <p className="text-xs text-slate-300">
              {analysis.stoneCutDepths.length > 0
                ? `Cut depth cluster: [${analysis.stoneCutDepths.slice(-6).join('m, ')}m]`
                : 'No stone cuts recorded yet.'}
            </p>
          </div>

          {/* Q4: Behavior after basket loss */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              4. Reaction After Basket Loss
            </h3>
            <p className="text-xs text-slate-300">
              {analysis.depthsAfterBasketLoss.length > 0
                ? analysis.depthsAfterBasketLoss
                    .slice(-4)
                    .map((item, idx) => `After ${item.previousOutcome} -> Next dive depth: ${item.nextDepth}m`)
                    .join(' | ')
                : 'No basket loss events recorded.'}
            </p>
          </div>

          {/* Q5: Two currencies */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              5. Fish Collectors vs Non-Collectors
            </h3>
            <p className="text-xs text-slate-300">
              Fish collectors ({analysis.fishCollectorsVSNonCollectors.collectorCount}): Avg Depth{' '}
              {analysis.fishCollectorsVSNonCollectors.collectorAvgDepth}m | Pure Pearl Hunters (
              {analysis.fishCollectorsVSNonCollectors.nonCollectorCount}): Avg Depth{' '}
              {analysis.fishCollectorsVSNonCollectors.nonCollectorAvgDepth}m
            </p>
          </div>
        </div>

        {/* JSON Export Button */}
        <div className="flex space-x-3 mb-6">
          <button
            onClick={handleExportJson}
            className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center space-x-2"
          >
            <span>📥 Export Telemetry JSON</span>
          </button>
        </div>

        {/* Raw Log Table */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-3 overflow-x-auto">
          <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
            Raw Dive Event Log ({logs.length} entries)
          </h4>
          <table className="w-full text-left text-[11px] font-mono text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500">
                <th className="py-1 px-2">#</th>
                <th className="py-1 px-2">Outcome</th>
                <th className="py-1 px-2">MaxD</th>
                <th className="py-1 px-2">Coins</th>
                <th className="py-1 px-2">Fish</th>
                <th className="py-1 px-2">StoneCut</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice(-15).map((log, idx) => (
                <tr key={log.id || idx} className="border-b border-slate-800/50 hover:bg-slate-800/50">
                  <td className="py-1 px-2">{log.diveIndex}</td>
                  <td
                    className={`py-1 px-2 font-bold ${
                      log.outcome === 'surfaced'
                        ? 'text-emerald-400'
                        : log.outcome === 'shark'
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {log.outcome}
                  </td>
                  <td className="py-1 px-2">{log.maxDepth}m</td>
                  <td className="py-1 px-2 text-amber-300">+{log.scoreBanked}</td>
                  <td className="py-1 px-2 text-emerald-300">+{log.fishCollected}</td>
                  <td className="py-1 px-2">{log.stoneCutAtDepth !== null ? `${log.stoneCutAtDepth}m` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};
