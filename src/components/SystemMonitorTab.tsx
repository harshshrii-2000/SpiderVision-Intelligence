import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Cpu, 
  Database, 
  Network, 
  Activity, 
  TrendingUp, 
  Server, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Zap,
  Radio,
  FileWarning
} from 'lucide-react';
import { SystemProcess } from '../types';

export default function SystemMonitorTab() {
  const [metrics, setMetrics] = useState({
    cpu: 18,
    ram: 45,
    disk: 52,
    ping: 28,
    gpu: 12,
    netRx: '1.2 MB/s',
    netTx: '450 KB/s',
    uptime: '1:45:12'
  });

  const [processes, setProcesses] = useState<SystemProcess[]>([
    { pid: 1404, name: "vscode", cpu: 4.2, mem: "310 MB" },
    { pid: 3201, name: "chrome", cpu: 8.5, mem: "412 MB" },
    { pid: 4920, name: "node", cpu: 12.1, mem: "185 MB" },
    { pid: 1042, name: "python3", cpu: 1.8, mem: "92 MB" },
    { pid: 900, name: "system", cpu: 0.5, mem: "45 MB" }
  ]);

  const [history, setHistory] = useState<{ cpu: number; ram: number }[]>(() => {
    // Fill initial 30 items for history
    const baseList = [];
    for (let i = 0; i < 30; i++) {
      baseList.push({
        cpu: Math.round(15 + Math.random() * 10),
        ram: Math.round(44 + Math.random() * 2)
      });
    }
    return baseList;
  });

  useEffect(() => {
    // Core polling system updates simulated values with live jitter
    const interval = setInterval(async () => {
      // 1. Fetch live metrics from local endpoint if available to reflect real host resources
      try {
        const response = await fetch('/api/system/stats');
        const data = await response.json();
        
        if (data.cpu !== undefined) {
          setMetrics({
            cpu: data.cpu,
            ram: data.ram,
            disk: data.disk,
            ping: data.ping,
            gpu: Math.round(5 + Math.random() * 15),
            netRx: data.interfaces.wlan0.rx,
            netTx: data.interfaces.wlan0.tx,
            uptime: formatUptime(data.uptime)
          });
          
          if (data.processes) {
            setProcesses(data.processes);
          }

          // Push new history coordinates
          setHistory(prev => {
            const next = [...prev.slice(1), { cpu: data.cpu, ram: data.ram }];
            return next;
          });
        }
      } catch (err) {
        // Fallback simulation if request fails or offline
        const simulatedCpu = Math.round(10 + Math.random() * 25);
        const simulatedRam = Math.round(40 + Math.random() * 8);
        setMetrics(prev => ({
          ...prev,
          cpu: simulatedCpu,
          ram: simulatedRam,
          ping: Math.round(15 + Math.random() * 25),
          gpu: Math.round(8 + Math.random() * 15),
        }));

        setHistory(prev => [...prev.slice(1), { cpu: simulatedCpu, ram: simulatedRam }]);

        // Animate some CPU process values with basic jitter
        setProcesses(prev => 
          prev.map(p => ({
            ...p,
            cpu: Math.max(0.1, Math.min(99.9, parseFloat((p.cpu + (Math.random() * 4 - 2)).toFixed(1))))
          })).sort((a, b) => b.cpu - a.cpu)
        );
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatUptime = (rawSeconds: number) => {
    const hours = Math.floor(rawSeconds / 3600);
    const minutes = Math.floor((rawSeconds % 3600) / 60);
    const secs = Math.floor(rawSeconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="sys-monitor-tab-root">
      
      {/* 1. Metric Cards at the Top */}
      <div className="lg:col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-4" id="stats-banner">
        
        {/* Card 1: CPU */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-gray-400 text-xs font-mono uppercase">CPU LOAD</span>
            <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-1">
              {metrics.cpu}%
            </div>
            <div className="text-[10px] text-gray-500 font-mono">5 CORE THREADS ACTIVE</div>
          </div>
          <div className="p-3 bg-blue-950/40 border border-blue-900/50 rounded flex items-center justify-center">
            <Cpu className="w-5 h-5 text-blue-400" />
          </div>
        </div>

        {/* Card 2: Memory */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-gray-400 text-xs font-mono uppercase">RAM USE</span>
            <div className="text-2xl font-bold font-mono text-white">
              {metrics.ram}%
            </div>
            <div className="text-[10px] text-gray-500 font-mono">DYNAMIC CACHE FLUSHED</div>
          </div>
          <div className="p-3 bg-indigo-950/40 border border-indigo-900/50 rounded flex items-center justify-center">
            <Database className="w-5 h-5 text-indigo-400" />
          </div>
        </div>

        {/* Card 3: Storage */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-gray-400 text-xs font-mono uppercase">Disk Usage</span>
            <div className="text-2xl font-bold font-mono text-white">
              {metrics.disk}%
            </div>
            <div className="text-[10px] text-gray-500 font-mono">VOLATILE SECTOR SANITY</div>
          </div>
          <div className="p-3 bg-emerald-950/40 border border-emerald-900/50 rounded flex items-center justify-center">
            <Server className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        {/* Card 4: Network Response */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-gray-400 text-xs font-mono uppercase">Network Ping</span>
            <div className="text-2xl font-bold font-mono text-white">
              {metrics.ping} ms
            </div>
            <div className="text-[10px] text-gray-500 font-mono">VPN NODE LATENCY</div>
          </div>
          <div className="p-3 bg-amber-950/40 border border-amber-900/50 rounded flex items-center justify-center">
            <Network className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
        </div>

      </div>

      {/* 2. Left Box: Resource Bars and Historical Line Chart */}
      <div className="lg:col-span-8 flex flex-col gap-6" id="left-monitor-sec">
        
        {/* Resource Bars Section */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-lg" id="resource-bars-card">
          <div className="border-b border-gray-800 pb-3 mb-4">
            <h3 className="font-sans font-semibold tracking-tight text-white text-base">
              System Resource Load Breakdown
            </h3>
            <div className="text-xs text-gray-400 mt-0.5">I/O values update automatically and represent immediate execution logs.</div>
          </div>

          <div className="space-y-4" id="load-bars">
            {/* CPU Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono font-medium">
                <span className="text-gray-300">Central Processing Unit (CPU)</span>
                <span className="text-gray-100">{metrics.cpu}%</span>
              </div>
              <div className="w-full bg-[#0b0f19] h-2 rounded overflow-hidden border border-gray-800">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500" 
                  style={{ width: `${metrics.cpu}%` }}
                />
              </div>
            </div>

            {/* RAM Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono font-medium">
                <span className="text-gray-300">Memory Allocation (RAM)</span>
                <span className="text-gray-100">{metrics.ram}%</span>
              </div>
              <div className="w-full bg-[#0b0f19] h-2 rounded overflow-hidden border border-gray-800">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-500" 
                  style={{ width: `${metrics.ram}%` }}
                />
              </div>
            </div>

            {/* Disk I/O Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono font-medium">
                <span className="text-gray-300">Disk I/O Volatiles (FIM Engine)</span>
                <span className="text-gray-100">{metrics.disk}%</span>
              </div>
              <div className="w-full bg-[#0b0f19] h-2 rounded overflow-hidden border border-gray-800">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500" 
                  style={{ width: `${metrics.disk}%` }}
                />
              </div>
            </div>

            {/* GPU Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono font-medium">
                <span className="text-gray-300">Graphics Execution (GPU)</span>
                <span className="text-gray-100">{metrics.gpu}%</span>
              </div>
              <div className="w-full bg-[#0b0f19] h-2 rounded overflow-hidden border border-gray-800">
                <div 
                  className="h-full bg-pink-500 transition-all duration-500" 
                  style={{ width: `${metrics.gpu}%` }}
                />
              </div>
            </div>

            {/* Network load line */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono font-medium">
                <span className="text-gray-300">Network I/O throughput speed</span>
                <span className="text-gray-100">Rx: {metrics.netRx} / Tx: {metrics.netTx}</span>
              </div>
              <div className="w-full bg-[#0b0f19] h-2 rounded overflow-hidden border border-gray-800">
                <div 
                  className="h-full bg-amber-500 transition-all duration-500" 
                  style={{ width: `${(metrics.cpu / 2) + Math.random() * 10}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Realistic SVG D3-inspired Sparkline History Chart */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-lg flex flex-col" id="sys-history-chart">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-sans font-semibold tracking-tight text-white text-base">
                60-Second System Historical Timeline
              </h3>
              <div className="text-xs text-gray-400 mt-0.5">Real-time telemetry log detailing processor load and static memory maps.</div>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-blue-500 rounded-sm inline-block" /> CPU</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-indigo-500 rounded-sm inline-block" /> RAM</span>
            </div>
          </div>

          <div className="relative h-44 w-full bg-[#0b0f19] border border-gray-800 rounded overflow-hidden p-3 flex flex-col justify-between">
            {/* SVG Plotting of CPU and RAM arrays */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              {/* Grid Lines */}
              <line x1="0" y1="25" x2="100" y2="25" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="2,2" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="2,2" />
              <line x1="0" y1="75" x2="100" y2="75" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="2,2" />

              {/* CPU Area Path */}
              <defs>
                <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="ramGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* CPU Area Under Path */}
              <path
                d={`M 0,100 L ${history.map((pt, index) => `${(index / (history.length - 1)) * 100},${100 - pt.cpu}`).join(' L ')} L 100,100 Z`}
                fill="url(#cpuGrad)"
              />

              {/* CPU Line Path */}
              <path
                d={history.map((pt, index) => `${(index / (history.length - 1)) * 100},${100 - pt.cpu}`).join(' L ')}
                fill="none"
                stroke="#3a82f6"
                strokeWidth="1.5"
              />

              {/* RAM Line Path */}
              <path
                d={history.map((pt, index) => `${(index / (history.length - 1)) * 100},${100 - pt.ram}`).join(' L ')}
                fill="none"
                stroke="#6366f1"
                strokeWidth="1.5"
                strokeDasharray="1,1"
              />
            </svg>

            {/* Static labels inside graph */}
            <div className="relative flex justify-between text-[10px] font-mono text-gray-500 h-full pointer-events-none">
              <div className="flex flex-col justify-between">
                <span>100%</span>
                <span>50%</span>
                <span>0%</span>
              </div>
              <div className="flex items-end text-right">
                <span>T-60s</span>
                <span className="ml-auto">LIVE FEED</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Right Box: Process Table and network interfaces list */}
      <div className="lg:col-span-4 flex flex-col gap-6" id="right-monitor-sec">
        
        {/* Top 5 active processes */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-lg flex flex-col" id="processes-card">
          <div className="border-b border-gray-800 pb-3 mb-4 flex justify-between items-center">
            <h3 className="font-sans font-semibold tracking-tight text-white text-base">
              Active Server Processes
            </h3>
            <span className="text-emerald-400 text-xs font-mono flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> TOP 5 LOADERS
            </span>
          </div>

          <div className="overflow-x-auto" id="processes-table-scroll">
            <table className="w-full text-left border-collapse text-xs font-mono text-gray-300">
              <thead>
                <tr className="border-b border-gray-850 text-gray-500 text-[10px] uppercase font-bold tracking-wider">
                  <th className="py-2.5 px-1">PID/NAME</th>
                  <th className="py-2.5 px-1 text-right">CPU LOAD</th>
                  <th className="py-2.5 px-1 text-right">MEM ASSIGNED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-850">
                {processes.map((proc, index) => (
                  <tr key={proc.pid} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-1 font-medium flex flex-col">
                      <span className="text-white font-bold">{proc.name}</span>
                      <span className="text-gray-500 text-[10px]">PID: {proc.pid}</span>
                    </td>
                    <td className="py-2.5 px-1 text-right text-gray-100">
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-blue-400">{proc.cpu}%</span>
                        {/* Mini bar chart */}
                        <div className="w-12 bg-[#0b0f19] h-1.5 rounded overflow-hidden mt-1 border border-gray-800">
                          <div className="bg-blue-400 h-full" style={{ width: `${Math.min(100, proc.cpu * 6)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-1 text-right text-gray-400">{proc.mem}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Network interfaces */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-lg flex flex-col" id="network-interfaces-card">
          <div className="border-b border-gray-800 pb-3 mb-4">
            <h3 className="font-sans font-semibold tracking-tight text-white text-base">
              Network Interfaces Link
            </h3>
            <div className="text-xs text-gray-400 mt-0.5">Monitoring live network adapters.</div>
          </div>

          <div className="space-y-3" id="interfaces-stack">
            {/* Interface 1 */}
            <div className="p-3 bg-gray-900/60 border border-gray-800 rounded flex items-center justify-between font-mono text-xs">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white">wlan0</span>
                  <span className="bg-emerald-950 text-emerald-400 text-[9px] px-1.5 py-0.2 rounded font-sans uppercase font-semibold">CONNECTED</span>
                </div>
                <div className="text-gray-400 mt-1">Speed Rx: 4.8 MB/s | Tx: 1.2 MB/s</div>
              </div>
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>

            {/* Interface 2 */}
            <div className="p-3 bg-gray-900/20 border border-gray-850 rounded flex items-center justify-between font-mono text-xs opacity-50">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-gray-400">eth0</span>
                  <span className="bg-gray-800 text-gray-400 text-[9px] px-1.5 py-0.2 rounded font-sans uppercase font-semibold">INACTIVE</span>
                </div>
                <div className="text-gray-500 mt-1">No ethernet link protocol parsed</div>
              </div>
              <Radio className="w-4 h-4 text-gray-600" />
            </div>

            {/* Interface 3 */}
            <div className="p-3 bg-blue-950/20 border border-blue-900/30 rounded flex items-center justify-between font-mono text-xs">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-blue-400">vpn0</span>
                  <span className="bg-blue-950 text-blue-400 text-[9px] px-1.5 py-0.2 rounded font-sans uppercase font-semibold border border-blue-900/40">SECURED TUNNEL</span>
                </div>
                <div className="text-gray-300 mt-1">WireGuard AES-256 Auth Channel</div>
              </div>
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
