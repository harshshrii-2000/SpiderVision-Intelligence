import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Cpu, 
  FlameKindling, 
  Network, 
  Binary, 
  Skull, 
  FileWarning, 
  Zap, 
  Sparkles,
  ClipboardList
} from 'lucide-react';
import { ThreatIncident } from '../types';
import ThreatMap from './ThreatMap';

interface ThreatsTabProps {
  incidents: ThreatIncident[];
  resolveIncident: (id: string) => void;
  addAuditLog: (type: 'Login' | 'Alert' | 'Change' | 'System', severity: 'Info' | 'Low' | 'Medium' | 'High' | 'Critical', desc: string, detail: string) => void;
}

export default function ThreatsTab({ incidents, resolveIncident, addAuditLog }: ThreatsTabProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  // Attack origin breakdown data
  const attackVectors = [
    { name: 'Credential Stuffing / Brute Force', percentage: 74, color: 'bg-red-500', count: 3412 },
    { name: 'Phishing Token Hijack / Email Spoof', percentage: 58, color: 'bg-orange-500', count: 2688 },
    { name: 'OAuth Hijack & Unauthorized API Grants', percentage: 42, color: 'bg-yellow-500', count: 1912 },
    { name: 'Infected Malware Tokens / Exploit Droppers', percentage: 29, color: 'bg-blue-500', count: 1321 },
    { name: 'OSINT Scraping / Footprinting Tactics', percentage: 18, color: 'bg-indigo-500', count: 819 },
  ];

  const handleRunScan = async () => {
    if (analyzing) return;
    setAnalyzing(true);
    setAiReport(null);
    addAuditLog('System', 'Info', 'Deep AI Threat Intelligence scan triggered', 'Querying SpiderVision Security and Gemini agent endpoints...');

    try {
      const response = await fetch('/api/threats/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'Deep Core AI Intelligence Scan',
          logs: {
            activeSystemThreats: incidents,
            attackMatrixSummary: attackVectors,
            firmwareStatus: 'Secure',
            integrityCheck: 'Passed'
          }
        }),
      });

      const data = await response.json();
      if (data.analysis) {
        setAiReport(data.analysis);
        addAuditLog('Alert', 'Low', 'AI Intelligence Scan report published', 'Generated core recommendations safely.');
      } else if (data.recommendations) {
        // Fallback simulated summary
        const recommendationsString = `### SpiderVision Intelligence - Threat Core Report\n\n${data.detailedAnalysis}\n\n#### Direct Mitigation Recommendations:\n` + 
          data.recommendations.map((r: string, i: number) => `${i + 1}. **${r}**`).join('\n');
        setAiReport(recommendationsString);
        addAuditLog('Alert', 'Low', 'AI Intelligence Scan report published', 'Generated fallback suggestions.');
      }
    } catch (err) {
      console.error(err);
      setAiReport('### AI Offline Error\n\nAn error occurred while connecting to the SpiderVision Cloud Intelligence servers. Please verify that your `GEMINI_API_KEY` is configured in the backend environment.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getSeverityBadge = (sev: ThreatIncident['severity']) => {
    switch (sev) {
      case 'Critical': return 'bg-red-950/70 text-red-400 border border-red-800/80';
      case 'High': return 'bg-orange-950/70 text-orange-400 border border-orange-850';
      case 'Medium': return 'bg-yellow-950/70 text-yellow-500 border border-yellow-800';
      default: return 'bg-blue-950/70 text-blue-400 border border-blue-800';
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="threats-tab-root">
      
      {/* LEFT COLUMN: Deep Live World Map & Vectors (SOC Panel) */}
      <div className="xl:col-span-7 flex flex-col gap-6" id="threats-gis-column">
        {/* Threat Origin GIS Canvas */}
        <ThreatMap />

        {/* Attack Vector Bars */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-lg" id="attack-vector-card">
          <div className="border-b border-gray-800 pb-3 mb-4">
            <h3 className="font-sans font-semibold tracking-tight text-white text-base">
              Threat Vector Analytics Map
            </h3>
            <div className="text-xs text-secondary mt-0.5">Chronological frequency rating of detected attack patterns.</div>
          </div>

          <div className="space-y-4" id="vectors-list">
            {attackVectors.map((vec, idx) => (
              <div key={idx} className="space-y-1.5 font-sans">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-300 font-medium">{vec.name}</span>
                  <span className="text-gray-400">
                    {vec.count} detections ({vec.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-[#0b0f19] h-2.5 rounded overflow-hidden flex items-center border border-gray-800">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${vec.percentage}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: idx * 0.1 }}
                    className={`h-full ${vec.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Active Incidents list & AI Threat Scanner */}
      <div className="xl:col-span-5 flex flex-col gap-6" id="threats-incidents-column">

        {/* AI Cyber Threat Scanner Controls */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-lg flex flex-col" id="deep-ai-scanner-card">
          <div className="border-b border-gray-800 pb-3 mb-4 flex justify-between items-center">
            <div>
              <h3 className="font-sans font-semibold tracking-tight text-white text-base flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                Gemini Threat Intelligence AI
              </h3>
              <div className="text-xs text-gray-400 mt-0.5">Automated SOC analysis of your logs for vulnerability detection.</div>
            </div>
          </div>

          {!aiReport ? (
            <div className="text-center p-6 bg-[#0b0f19]/40 rounded border border-gray-800 border-dashed" id="scan-pre-state">
              <div className="flex justify-center mb-3">
                <Binary className={`w-8 h-8 text-blue-400/80 ${analyzing ? 'animate-spin' : ''}`} />
              </div>
              <p className="text-xs text-gray-300 leading-relaxed max-w-sm mx-auto mb-4">
                Run a sandboxed, automated correlation scanning operation. Feed current active threats and network telemetry lists into Gemini to flag high-risk accounts.
              </p>
              <button
                onClick={handleRunScan}
                disabled={analyzing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 text-white font-semibold text-xs py-2.5 px-4 rounded focus:outline-none transition-all duration-150 flex items-center justify-center gap-1.5 shadow-sm"
              >
                {analyzing ? (
                  <>
                    <RefreshCwIcon className="w-3.5 h-3.5 animate-spin" />
                    DECODING THREAT PATTERNS...
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    RUN DUAL PROACTIVE AI SCAN
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 font-sans" id="scan-post-state">
              <div className="bg-[#0b0f19] border border-gray-800 text-gray-200 text-xs font-mono p-4 rounded max-h-[340px] overflow-y-auto leading-relaxed whitespace-pre-wrap select-text markdown-body">
                {aiReport}
              </div>
              <button
                onClick={() => setAiReport(null)}
                className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold py-2.5 rounded transition-colors"
              >
                Clear Intelligence Report
              </button>
            </div>
          )}
        </div>

        {/* Threat Incidents Feed */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-lg flex-1 flex flex-col" id="active-incidents-feed">
          <div className="border-b border-gray-800 pb-3 mb-4 flex items-center justify-between">
            <h3 className="font-sans font-semibold tracking-tight text-white text-base">
              Active Security Incidents
            </h3>
            <span className="text-xs font-mono bg-red-950 text-red-400 px-2.5 py-0.5 rounded border border-red-900/60 font-bold">
              {incidents.filter(i => i.status !== 'Resolved').length} ACTIVE
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[420px] flex-1 pr-1" id="incidents-stack">
            {incidents.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center border border-dashed border-gray-800 rounded bg-[#0b0f19]/20" id="no-incidents-view">
                <ShieldCheck className="w-10 h-10 text-emerald-500/80 mb-2" />
                <p className="text-sm font-semibold text-white">Spider Shield is Silent</p>
                <p className="text-xs text-gray-500 mt-1">Zero compromise vectors flagged across active databases.</p>
              </div>
            ) : (
              incidents.map((inc) => (
                <div 
                  key={inc.id}
                  className={`p-3.5 rounded border flex flex-col gap-2.5 transition-all bg-gray-900/70 ${
                    inc.status === 'Resolved' 
                      ? 'border-gray-800 opacity-60' 
                      : 'border-red-950/40 hover:border-red-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getSeverityBadge(inc.severity)}`}>
                          {inc.severity}
                        </span>
                        <span className="font-mono text-gray-400 text-xs">ID: {inc.id}</span>
                      </div>
                      <div className="text-sm font-semibold text-white mt-1.5">{inc.type}</div>
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${
                      inc.status === 'Blocked' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/50' : 
                      inc.status === 'Investigating' ? 'bg-amber-950 text-amber-400 border border-amber-900/50' :
                      'bg-gray-800 text-gray-400'
                    }`}>
                      {inc.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-xs font-mono text-gray-400 bg-black/20 p-2 rounded">
                    <div>
                      <span className="text-gray-500">Platform:</span> <span className="text-gray-300">{inc.platform}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">IP Origin:</span> <span className="text-gray-300">{inc.location}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Device signature:</span> <span className="text-gray-300">{inc.device}</span>
                    </div>
                    <div className="col-span-2 text-[11px] text-gray-500 font-sans italic">
                      Locked at {inc.timestamp}
                    </div>
                  </div>

                  {inc.status !== 'Resolved' && (
                    <button
                      onClick={() => resolveIncident(inc.id)}
                      className="w-full bg-[#1e293b] hover:bg-[#334155] text-white font-semibold text-xs py-1.5 rounded transition-all duration-150 border border-gray-700/80 uppercase tracking-wide"
                    >
                      Acknowledge & Force Resolve
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

// Inline replacement of RefreshCw loop icon helper
function RefreshCwIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}
