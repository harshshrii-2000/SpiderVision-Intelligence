import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  Layers, 
  Radio, 
  ServerCrash,
  Globe,
  Settings,
  Flame,
  CheckCircle,
  DatabaseZap,
  LayoutGrid
} from 'lucide-react';
import { LinkedAccount, SecuritySettings, ThreatIncident, AuditLogItem } from './types';
import AccountsTab from './components/AccountsTab';
import ThreatsTab from './components/ThreatsTab';
import SystemMonitorTab from './components/SystemMonitorTab';
import AuditLogTab from './components/AuditLogTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<'accounts' | 'threats' | 'system' | 'audit'>('accounts');
  
  // 1. Linked Accounts State with initial requested accounts
  const [accounts, setAccounts] = useState<LinkedAccount[]>([
    { id: '1', name: 'Twitter / X', platform: 'Twitter', handle: '@harshit_dev', lastActive: 'last active 2h ago', status: 'Secure', protectionEnabled: true },
    { id: '2', name: 'Instagram', platform: 'Instagram', handle: '@harshit.codes', lastActive: 'last active 5h ago', status: 'Review', protectionEnabled: false },
    { id: '3', name: 'GitHub', platform: 'GitHub', handle: '@harshit', lastActive: 'last active 1h ago', status: 'Secure', protectionEnabled: true },
    { id: '4', name: 'LinkedIn', platform: 'LinkedIn', handle: 'Harshit S.', lastActive: 'last active 1d ago', status: 'Secure', protectionEnabled: true }
  ]);

  // 2. Proactive Security settings state
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactor: true,
    anomalyDetection: true,
    newDeviceAlerts: true,
    autoRevokeSessions: false,
    phishingScanner: true
  });

  // 3. active security incident state feed
  const [incidents, setIncidents] = useState<ThreatIncident[]>([
    { id: 'INC-2041', type: 'Blocked Brute-Force Login Attempt', platform: 'Twitter / X', device: 'Mozilla/5.0 (Kali Linux x86_64)', location: '95.105.161.4 Warsaw, PL', timestamp: '2026-06-01T17:48:00Z', status: 'Blocked', severity: 'High' },
    { id: 'INC-8890', type: 'OAuth Scope Expansion Redirect Blocked', platform: 'Instagram', device: 'Custom Python 3 / Requests payload client', location: '103.22.202.12 Beijing, CN', timestamp: '25 minutes ago', status: 'Investigating', severity: 'Medium' },
    { id: 'INC-4190', type: 'Credential Stuffing Cascade Triggered', platform: 'LinkedIn', device: 'Credential Sprayer botnet wrapper-81', location: '185.20.140.2 Frankfurt, DE', timestamp: '2 hours ago', status: 'Blocked', severity: 'Critical' },
    { id: 'INC-7091', type: 'Session Token Grab Attempt via DM Phishing', platform: 'GitHub', device: 'Chromium Linux (Heuristic Spoofed)', location: '74.125.19.8 Fort Meade, US', timestamp: '3 hours ago', status: 'Blocked', severity: 'Critical' }
  ]);

  // 4. Chronological Audit Logs history
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    { id: 'LOG-001', time: '19:42:15', type: 'Login', severity: 'Info', description: 'Successful administrative dashboard session established', detail: 'Origin IP: 127.0.0.1 (Local workstation localhost) | Protocol: HTTPS container ingress' },
    { id: 'LOG-002', time: '19:44:10', type: 'System', severity: 'Info', description: 'FIM File Integrity System initiated successfully', detail: 'Directories observed: Desktop, Documents, Downloads. Status: CLEAN' },
    { id: 'LOG-003', time: '19:45:00', type: 'Alert', severity: 'High', description: 'Blocked intrusion cascade at LinkedIn pipeline', detail: 'Payload flagged: credential stuffing dictionary from 185.20.140.2' },
    { id: 'LOG-004', time: '19:47:02', type: 'Change', severity: 'Info', description: 'Phishing scanner policy set globally', detail: 'Toggled option globally for active linked Twitter, Instagram, GitHub endpoints.' }
  ]);

  // Helper helper to add items to audit log
  const addAuditLog = (type: 'Login' | 'Alert' | 'Change' | 'System', severity: 'Info' | 'Low' | 'Medium' | 'High' | 'Critical', desc: string, detail: string) => {
    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0];
    const newLogItem: AuditLogItem = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      time: timeString,
      type: type,
      severity: severity,
      description: desc,
      detail: detail
    };
    setAuditLogs(prev => [newLogItem, ...prev]);
  };

  // Toggle specific account protection shielding status
  const toggleAccount = (id: string) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.id === id) {
        const nextState = !acc.protectionEnabled;
        // Logging the outcome down inside our audit logs list
        addAuditLog(
          'Change', 
          nextState ? 'Info' : 'Low', 
          `Shield protection ${nextState ? 'ENABLED' : 'DISABLED'} on ${acc.name}`, 
          `Policy enforced: ${acc.handle} shield is now ${nextState ? 'ACTIVE' : 'IDLE'}`
        );
        return {
          ...acc,
          protectionEnabled: nextState,
          status: nextState ? 'Secure' : 'Review'
        };
      }
      return acc;
    }));
  };

  // Update overall unified protection configurations
  const updateSetting = (key: keyof SecuritySettings, val: boolean) => {
    setSecuritySettings(prev => ({ ...prev, [key]: val }));
  };

  // Resolve active security incident entries
  const resolveIncident = (id: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        addAuditLog('System', 'Info', `Incident Resolved: ${inc.id}`, `User manually audited risk vector and completed credentials rotation.`);
        return { ...inc, status: 'Resolved' };
      }
      return inc;
    }));
  };

  const clearLogs = () => {
    setAuditLogs([]);
    addAuditLog('System', 'Info', 'Audit log space successfully purged', 'Database space registers at zero records.');
  };

  // Calculate live dynamic threat score (Risk index)
  const calculateRiskIndex = () => {
    let score = 15; // baseline threat evaluation score
    
    // Add weights for unprotected accounts
    const unprotectedCount = accounts.filter(a => !a.protectionEnabled).length;
    score += unprotectedCount * 12;

    // Add weights for active security incidents
    const activeIncidents = incidents.filter(i => i.status !== 'Resolved').length;
    score += activeIncidents * 15;

    // Reduce score if critical toggles are active
    if (securitySettings.twoFactor) score -= 8;
    if (securitySettings.anomalyDetection) score -= 8;
    if (securitySettings.phishingScanner) score -= 6;

    const finalScore = Math.max(5, Math.min(99, score));
    return finalScore;
  };

  const threatScore = calculateRiskIndex();

  const getThreatLabel = (score: number) => {
    if (score > 75) return { text: 'CRITICAL HAZARD', class: 'text-red-500 bg-red-950 border-red-800 animate-pulse' };
    if (score > 40) return { text: 'MEDIUM WARNING', class: 'text-amber-500 bg-amber-950 border-amber-800' };
    return { text: 'SECURE POSTURE', class: 'text-emerald-400 bg-emerald-950 border-emerald-800' };
  };

  const threatLabel = getThreatLabel(threatScore);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#09090b] text-[#e4e4e7] font-sans" id="spidervision-main-workspace shadow-none flex-none">
      
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-[#0c0c0e] border-r border-[#27272a] flex flex-col p-6 select-none shrink-0" id="sleek-sidebar">
        
        {/* Sidebar Brand Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-lg font-bold text-white shadow-md shadow-blue-500/20">
              🕸️
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white leading-tight">SpiderVision</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-none mt-0.5">Intelligence Command</p>
            </div>
          </div>
          <p className="text-[9px] text-zinc-600 uppercase tracking-wider font-semibold">See Every Threat Before It Strikes</p>
        </div>

        {/* Sidebar Nav buttons */}
        <nav className="space-y-1.5 flex-1 select-none" id="tabs-navigation-panel">
          <button
            onClick={() => setActiveTab('accounts')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-md transition duration-150 ${
              activeTab === 'accounts' 
                ? 'bg-[#27272a] text-white shadow-none' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
            }`}
          >
            <Settings className="w-4 h-4" /> SOCIAL ACCOUNTS
          </button>

          <button
            onClick={() => setActiveTab('threats')}
            className={`w-full relative flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-md transition duration-150 ${
              activeTab === 'threats' 
                ? 'bg-[#27272a] text-white' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
            }`}
          >
            <ShieldAlert className="w-4 h-4" /> THREAT DISCOVERY
            {incidents.filter(i => i.status !== 'Resolved').length > 0 && (
              <span className="absolute right-3 bg-red-650 text-white font-extrabold text-[9px] rounded-full px-1.5 py-0.2">
                {incidents.filter(i => i.status !== 'Resolved').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-md transition duration-150 ${
              activeTab === 'system' 
                ? 'bg-[#27272a] text-white' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
            }`}
          >
            <Activity className="w-4 h-4" /> SYSTEM MONITOR
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-md transition duration-150 ${
              activeTab === 'audit' 
                ? 'bg-[#27272a] text-white' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
            }`}
          >
            <Layers className="w-4 h-4" /> CHRONO AUDIT LOGS
          </button>
        </nav>

        {/* Sidebar Security Score Card */}
        <div className="p-4 bg-[#18181b] rounded-lg border border-[#27272a]">
          <div className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider mb-1">Security Score</div>
          <div className="text-2xl font-bold text-green-500 font-mono tracking-tight flex items-baseline justify-between">
            <span>{100 - threatScore}%</span>
            <span className="text-[10px] font-sans font-bold tracking-wide uppercase px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800">
              {threatScore > 50 ? 'Review' : 'Secure'}
            </span>
          </div>
          <div className="w-full h-1 bg-zinc-800 rounded mt-2.5 overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-500" 
              style={{ width: `${100 - threatScore}%` }}
            />
          </div>
        </div>

      </aside>

      {/* RIGHT MAIN PANEL */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b]" id="working-tab-viewport">
        
        {/* Content Header Dashboard Bar */}
        <header className="h-16 px-6 border-b border-[#27272a] flex items-center justify-between shrink-0 bg-[#0c0c0e]/30 select-none">
          <h2 className="text-sm font-bold tracking-wide text-zinc-100 uppercase">
            {activeTab === 'accounts' && 'Account Protection Command Shield'}
            {activeTab === 'threats' && 'Active Security Threat Matrix'}
            {activeTab === 'system' && 'Deep System Telemetry Monitor'}
            {activeTab === 'audit' && 'Chronological Auditable Events Log'}
          </h2>

          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2 bg-[#18181b] border border-[#27272a] px-3 py-1.5 rounded text-xs font-medium text-zinc-200">
              <span className="w-2 h-2 rounded-full bg-green-500 pulse"></span>
              <span>System: Optimal</span>
            </div>
            <div className="text-zinc-500 text-[10px] hidden md:block select-all">
              PORT: 3000
            </div>
          </div>
        </header>

        {/* Content Tab Carriage container */}
        <div className="flex-1 p-6 overflow-y-auto" id="sleek-content-carriage">
          <AnimatePresence mode="wait">
            {activeTab === 'accounts' && (
              <motion.div
                key="accounts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                <AccountsTab 
                  accounts={accounts} 
                  toggleAccount={toggleAccount}
                  settings={securitySettings} 
                  updateSetting={updateSetting}
                  addAuditLog={addAuditLog}
                />
              </motion.div>
            )}

            {activeTab === 'threats' && (
              <motion.div
                key="threats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                <ThreatsTab 
                  incidents={incidents} 
                  resolveIncident={resolveIncident}
                  addAuditLog={addAuditLog}
                />
              </motion.div>
            )}

            {activeTab === 'system' && (
              <motion.div
                key="system"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                <SystemMonitorTab />
              </motion.div>
            )}

            {activeTab === 'audit' && (
              <motion.div
                key="audit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                <AuditLogTab 
                  logs={auditLogs} 
                  clearLogs={clearLogs}
                  addAuditLog={addAuditLog}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Core Footer Block */}
        <footer className="bg-[#0c0c0e] border-t border-[#27272a] text-[10px] text-zinc-500 font-mono px-6 py-3 flex flex-col md:flex-row justify-between items-center gap-2 select-none" id="bottom-footer">
          <div className="flex items-center gap-3">
            <span>PORT: 3000 (SECURE CONTAIND)</span>
            <span className="text-zinc-800">|</span>
            <span>PLATFORM: Node / Flask Interlaced API</span>
          </div>
          <div>
            <span>SPIDERVISION THREAT DATABASE VERIFICATION CORE v2.4.9</span>
          </div>
        </footer>

      </main>

    </div>
  );
}
