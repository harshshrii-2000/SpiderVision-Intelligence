import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, ShieldAlert, Globe } from 'lucide-react';

interface AttackPulse {
  id: string;
  from: string;
  fromCoords: { x: number; y: number };
  toCoords: { x: number; y: number };
  ip: string;
  type: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

const ATTACK_ORIGINS = [
  { name: 'Beijing, CN', x: 740, y: 180, ip: '103.22.202.' },
  { name: 'Moscow, RU', x: 570, y: 110, ip: '95.105.161.' },
  { name: 'Warsaw, PL', x: 500, y: 130, ip: '185.20.140.' },
  { name: 'São Paulo, BR', x: 340, y: 350, ip: '191.240.22.' },
  { name: 'Fort Meade, US', x: 250, y: 160, ip: '74.125.19.' },
  { name: 'Seoul, KR', x: 780, y: 180, ip: '210.123.49.' },
  { name: 'Frankfurt, DE', x: 480, y: 130, ip: '46.165.210.' },
  { name: 'Sydney, AU', x: 820, y: 390, ip: '101.160.20.' },
];

export default function ThreatMap() {
  const [attacks, setAttacks] = useState<AttackPulse[]>([]);
  const [lastIncident, setLastIncident] = useState<AttackPulse | null>(null);

  // Target coordinates represent our command center (roughly Austin/Chicago/US East area)
  const targetCoords = { x: 260, y: 155 };

  useEffect(() => {
    // Generate simulated attack animations every few seconds
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * ATTACK_ORIGINS.length);
      const origin = ATTACK_ORIGINS[idx];
      const randomIpTail = Math.floor(Math.random() * 254) + 1;
      const attackTypes = [
        { name: 'Brute Force Attempt', severity: 'Medium' },
        { name: 'Phishing Token Hijack', severity: 'High' },
        { name: 'OAuth Revoke Probe', severity: 'Low' },
        { name: 'Credential Stuffing', severity: 'Critical' },
      ];
      const selectedType = attackTypes[Math.floor(Math.random() * attackTypes.length)];

      const newAttack: AttackPulse = {
        id: Math.random().toString(36).substring(2, 9),
        from: origin.name,
        fromCoords: { x: origin.x, y: origin.y },
        toCoords: targetCoords,
        ip: `${origin.ip}${randomIpTail}`,
        type: selectedType.name,
        severity: selectedType.severity as 'Low' | 'Medium' | 'High' | 'Critical',
      };

      setAttacks((prev) => [...prev.slice(-4), newAttack]);
      setLastIncident(newAttack);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'Critical': return '#ef4444'; // Red
      case 'High': return '#f97316'; // Orange
      case 'Medium': return '#f59e0b'; // Yellow
      default: return '#3b82f6'; // Blue
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-lg flex flex-col h-full select-none" id="geo-map-container">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#3b82f6] animate-pulse" />
          <h3 className="font-sans font-semibold tracking-tight text-white text-base">
            Global Live Threat Vectors
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-red-500">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            ATTACKS BLOCKED
          </span>
          <span className="text-gray-400 border border-gray-700 px-2 py-0.5 rounded">
            Target Node: SPIDER-SOC-01
          </span>
        </div>
      </div>

      {/* SVG Map Display */}
      <div className="relative flex-1 bg-[#0b0f19] border border-gray-800 rounded min-h-[300px] overflow-hidden flex items-center justify-center">
        {/* Simple futuristic styled cyber world SVG blueprint map */}
        <svg
          viewBox="0 0 920 460"
          className="w-full h-full opacity-40 select-none pointer-events-none"
        >
          {/* North America */}
          <path
            d="M 120,110 L 280,110 L 320,160 L 290,210 L 210,230 L 150,180 Z"
            fill="#1e293b"
            stroke="#475569"
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />
          {/* South America */}
          <path
            d="M 280,260 L 360,280 L 370,400 L 310,430 L 270,360 Z"
            fill="#1e293b"
            stroke="#475569"
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />
          {/* Eurasia */}
          <path
            d="M 420,90 L 780,100 L 860,180 L 760,260 L 640,240 L 520,260 L 460,180 Z"
            fill="#1e293b"
            stroke="#475569"
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />
          {/* Africa */}
          <path
            d="M 440,220 L 540,200 L 570,290 L 520,380 L 460,320 Z"
            fill="#1e293b"
            stroke="#475569"
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />
          {/* Australia */}
          <path
            d="M 760,330 L 840,340 L 850,420 L 750,400 Z"
            fill="#1e293b"
            stroke="#475569"
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />

          {/* Central Target Circle */}
          <circle cx={targetCoords.x} cy={targetCoords.y} r="6" fill="#10b981" />
          <circle cx={targetCoords.x} cy={targetCoords.y} r="16" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="3,3" className="animate-pulse" />

          {/* Draw attack paths dynamically */}
          {attacks.map((attack) => (
            <g key={attack.id}>
              {/* Path line from origin to target */}
              <motion.path
                d={`M ${attack.fromCoords.x},${attack.fromCoords.y} Q ${(attack.fromCoords.x + attack.toCoords.x)/2},${Math.min(attack.fromCoords.y, attack.toCoords.y) - 40} ${attack.toCoords.x},${attack.toCoords.y}`}
                fill="none"
                stroke={getSeverityColor(attack.severity)}
                strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0.8 }}
                animate={{ pathLength: 1, opacity: 0.1 }}
                transition={{ duration: 1.8, ease: 'easeOut' }}
              />

              {/* Glowing tracer moving from origin to target */}
              <motion.circle
                r="3"
                fill={getSeverityColor(attack.severity)}
                initial={{ offset: 0 }}
                animate={{ offset: 1 }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
              >
                <animateMotion
                  path={`M ${attack.fromCoords.x},${attack.fromCoords.y} Q ${(attack.fromCoords.x + attack.toCoords.x)/2},${Math.min(attack.fromCoords.y, attack.toCoords.y) - 40} ${attack.toCoords.x},${attack.toCoords.y}`}
                  dur="1.8s"
                  repeatCount="indefinite"
                />
              </motion.circle>

              {/* Pulse at the origin of attack */}
              <circle
                cx={attack.fromCoords.x}
                cy={attack.fromCoords.y}
                r="5"
                fill={getSeverityColor(attack.severity)}
              />
              <motion.circle
                cx={attack.fromCoords.x}
                cy={attack.fromCoords.y}
                r="15"
                fill="none"
                stroke={getSeverityColor(attack.severity)}
                strokeWidth="1"
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </g>
          ))}
        </svg>

        {/* Small floating info box containing last blocked attack */}
        <AnimatePresence mode="popLayout">
          {lastIncident && (
            <motion.div
              key={lastIncident.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bottom-3 left-3 right-3 bg-zinc-900/95 border border-zinc-800 p-2.5 rounded text-xs font-mono flex items-center justify-between gap-2 shadow"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: getSeverityColor(lastIncident.severity) }} />
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: getSeverityColor(lastIncident.severity) }} />
                </span>
                <span className="text-gray-400">[{lastIncident.from}]</span>
                <span className="text-blue-400 font-medium">{lastIncident.ip}</span>
                <span className="text-gray-200">→</span>
                <span className="text-gray-300 truncate max-w-[180px]">{lastIncident.type}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-red-950/50 border border-red-800/60 px-1.5 py-0.5 rounded text-[10px] text-red-400 font-sans uppercase font-semibold">
                <ShieldAlert className="w-3 h-3" />
                BLOCKED
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs font-mono">
        <div className="p-2 bg-[#1f2937]/50 rounded border border-gray-800">
          <div className="text-gray-400 text-[10px]">EAST ASIA (CN/KR)</div>
          <div className="text-yellow-400 font-bold mt-0.5">382 / MIN</div>
        </div>
        <div className="p-2 bg-[#1f2937]/50 rounded border border-gray-800">
          <div className="text-gray-400 text-[10px]">EUROPE (RU/DE)</div>
          <div className="text-orange-500 font-bold mt-0.5">581 / MIN</div>
        </div>
        <div className="p-2 bg-[#1f2937]/50 rounded border border-gray-800">
          <div className="text-gray-400 text-[10px]">LATIN AM (BR)</div>
          <div className="text-blue-400 font-bold mt-0.5">149 / MIN</div>
        </div>
        <div className="p-2 bg-[#1f2937]/50 rounded border border-gray-800">
          <div className="text-gray-400 text-[10px]">N. AMERICA (US)</div>
          <div className="text-emerald-500 font-bold mt-0.5">92 / MIN</div>
        </div>
      </div>
    </div>
  );
}
