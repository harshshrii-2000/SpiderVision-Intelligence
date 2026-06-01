import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Twitter, 
  Instagram, 
  Github, 
  Linkedin, 
  ShieldCheck, 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  KeyRound, 
  Mail, 
  AlertTriangle, 
  Search,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { LinkedAccount, SecuritySettings } from '../types';

interface AccountsTabProps {
  accounts: LinkedAccount[];
  toggleAccount: (id: string) => void;
  settings: SecuritySettings;
  updateSetting: (key: keyof SecuritySettings, val: boolean) => void;
  addAuditLog: (type: 'Login' | 'Alert' | 'Change' | 'System', severity: 'Info' | 'Low' | 'Medium' | 'High' | 'Critical', desc: string, detail: string) => void;
}

export default function AccountsTab({ accounts, toggleAccount, settings, updateSetting, addAuditLog }: AccountsTabProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailQuery, setEmailQuery] = useState('');
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailResult, setEmailResult] = useState<{
    checked: boolean;
    breached: boolean;
    count: number;
    sources: string[];
  } | null>(null);

  // Password strength logic
  const checkPasswordStrength = (pass: string) => {
    const criteria = {
      length: pass.length >= 10,
      caseMix: /[a-z]/.test(pass) && /[A-Z]/.test(pass),
      numbers: /\d/.test(pass),
      symbols: /[^A-Za-z0-9]/.test(pass),
    };

    const score = Object.values(criteria).filter(Boolean).length;
    let strength = 'Weak';
    let color = 'bg-red-500';
    let textClass = 'text-red-400';

    if (score === 4) {
      strength = 'Very Strong';
      color = 'bg-emerald-500';
      textClass = 'text-emerald-400';
    } else if (score === 3) {
      strength = 'Strong';
      color = 'bg-green-500';
      textClass = 'text-green-400';
    } else if (score === 2) {
      strength = 'Moderate';
      color = 'bg-yellow-500';
      textClass = 'text-yellow-400';
    }

    const tips: string[] = [];
    if (!criteria.length) tips.push('Be at least 10 characters long');
    if (!criteria.caseMix) tips.push('Mix both UPPER and lower case characters');
    if (!criteria.numbers) tips.push('Include at least one digit (0-9)');
    if (!criteria.symbols) tips.push('Add a special character / symbol (e.g., @, #, $, !)');

    return { score, strength, color, textClass, criteria, tips };
  };

  const strengthInfo = checkPasswordStrength(password);

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailQuery || checkingEmail) return;

    setCheckingEmail(true);
    addAuditLog('System', 'Info', 'HIBP Breach check requested', `Target email: ${emailQuery}`);
    try {
      const response = await fetch('/api/breach-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailQuery }),
      });
      const data = await response.json();
      
      setEmailResult({
        checked: true,
        breached: data.breached,
        count: data.count,
        sources: data.sources || [],
      });

      if (data.breached) {
        addAuditLog('Alert', 'High', 'Identity Breach Detected via HIBP', `${emailQuery} found in ${data.count} leak lists.`);
      } else {
        addAuditLog('System', 'Info', 'Identity Scan Passed', `${emailQuery} is secure with no leaked entries.`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingEmail(false);
    }
  };

  const getPlatformIcon = (platform: LinkedAccount['platform']) => {
    switch (platform) {
      case 'Twitter': return <Twitter className="w-5 h-5 text-[#1DA1F2]" />;
      case 'Instagram': return <Instagram className="w-5 h-5 text-[#E1306C]" />;
      case 'GitHub': return <Github className="w-5 h-5 text-gray-200" />;
      case 'LinkedIn': return <Linkedin className="w-5 h-5 text-[#0A66C2]" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="accounts-tab-grid">
      
      {/* 1. Linked Accounts and Security Settings */}
      <div className="lg:col-span-8 flex flex-col gap-6" id="left-accounts-column">
        
        {/* Linked Accounts Card */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-lg flex flex-col" id="linked-accounts-card">
          <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-3">
            <h3 className="font-sans font-semibold tracking-tight text-white text-base">
              Linked Accounts Protection
            </h3>
            <span className="text-xs font-mono text-gray-400">STATUS: INTERACTIVE PROTOCOL</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="accounts-grid">
            {accounts.map((acc) => (
              <div 
                key={acc.id}
                className={`p-4 rounded border flex items-center justify-between transition-all duration-200 ${
                  acc.protectionEnabled 
                    ? 'border-emerald-800/40 bg-emerald-950/5' 
                    : 'border-amber-800/40 bg-amber-950/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gray-900 rounded border border-gray-800 flex items-center justify-center">
                    {getPlatformIcon(acc.platform)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-white text-sm">{acc.name}</span>
                      {acc.status === 'Secure' ? (
                        <span className="flex items-center gap-0.5 text-[10px] text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-800/30">
                          <ShieldCheck className="w-2.5 h-2.5" /> SECURE
                        </span>
                      ) : (
                        <span className="flex items-center gap-0.5 text-[10px] text-amber-400 bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-800/30 animate-pulse">
                          <ShieldAlert className="w-2.5 h-2.5" /> REVIEW
                        </span>
                      )}
                    </div>
                    <div className="text-gray-400 text-xs font-mono mt-0.5">
                      {acc.handle} • {acc.lastActive}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <button
                    onClick={() => toggleAccount(acc.id)}
                    className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      acc.protectionEnabled ? 'bg-emerald-500' : 'bg-gray-700'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        acc.protectionEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                    {acc.protectionEnabled ? 'ACTIVE SHIELD' : 'SHIELD OFF'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Settings Section (Live Toggles) */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-lg" id="security-settings-card">
          <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-3">
            <h3 className="font-sans font-semibold tracking-tight text-white text-base">
              Proactive Protection Controls
            </h3>
            <span className="text-xs font-mono text-gray-400">REAL-TIME SYNCED DEVICES</span>
          </div>

          <div className="space-y-4" id="toggles-stack">
            {/* Toggle 1 */}
            <div className="flex items-start justify-between p-3 bg-gray-900/40 border border-gray-800/60 rounded">
              <div className="max-w-[80%]">
                <div className="text-sm font-semibold text-gray-200">Two-Factor Authentication Enforcer (2FA)</div>
                <div className="text-xs text-gray-400 mt-1">
                  Forces multi-channel OTP or hardware token authorizations whenever any linked social account initiates a login.
                </div>
              </div>
              <button
                onClick={() => {
                  const newVal = !settings.twoFactor;
                  updateSetting('twoFactor', newVal);
                  addAuditLog('Change', newVal ? 'Info' : 'Low', 'Two-Factor Authentication policy modified', `Policy set to: ${newVal ? 'STRICT' : 'OFF'}`);
                }}
                className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.twoFactor ? 'bg-emerald-500' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.twoFactor ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 2 */}
            <div className="flex items-start justify-between p-3 bg-gray-900/40 border border-gray-800/60 rounded">
              <div className="max-w-[80%]">
                <div className="text-sm font-semibold text-gray-200">Login Anomaly & Threat Engine</div>
                <div className="text-xs text-gray-400 mt-1">
                  Flags simultaneous logons across geographic spaces or unusual OS user agent requests.
                </div>
              </div>
              <button
                onClick={() => {
                  const newVal = !settings.anomalyDetection;
                  updateSetting('anomalyDetection', newVal);
                  addAuditLog('Change', newVal ? 'Info' : 'Low', 'Anomaly Detection setting changed', `Setting active: ${newVal}`);
                }}
                className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.anomalyDetection ? 'bg-emerald-500' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.anomalyDetection ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 3 */}
            <div className="flex items-start justify-between p-3 bg-gray-900/40 border border-gray-800/60 rounded">
              <div className="max-w-[80%]">
                <div className="text-sm font-semibold text-gray-200">Immediate New Device Alerts</div>
                <div className="text-xs text-gray-400 mt-1">
                  Pushes real-world SMS and web sockets socket alerts immediately upon unrecognized device detections.
                </div>
              </div>
              <button
                onClick={() => {
                  const newVal = !settings.newDeviceAlerts;
                  updateSetting('newDeviceAlerts', newVal);
                  addAuditLog('Change', 'Info', 'Device Alerts toggle clicked', `New target status: ${newVal}`);
                }}
                className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.newDeviceAlerts ? 'bg-emerald-500' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.newDeviceAlerts ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 4 */}
            <div className="flex items-start justify-between p-3 bg-gray-900/40 border border-gray-800/60 rounded">
              <div className="max-w-[80%]">
                <div className="text-sm font-semibold text-gray-200">Force Auto-Revoke Inactive Sessions</div>
                <div className="text-xs text-gray-400 mt-1">
                  Automatically flushes credential browser sessions that are inactive for more than three days.
                </div>
              </div>
              <button
                onClick={() => {
                  const newVal = !settings.autoRevokeSessions;
                  updateSetting('autoRevokeSessions', newVal);
                  addAuditLog('Change', 'Info', 'Session timeout policy changed', `Autocut set: ${newVal}`);
                }}
                className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.autoRevokeSessions ? 'bg-emerald-500' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.autoRevokeSessions ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 5 */}
            <div className="flex items-start justify-between p-3 bg-gray-900/40 border border-gray-800/60 rounded border-dashed">
              <div className="max-w-[80%]">
                <div className="text-sm font-semibold text-gray-200 flex items-center gap-1.5">
                  Real-time Phishing Link Scanner
                  <span className="bg-blue-900/80 border border-blue-700 text-blue-300 text-[9px] px-1.5 py-0.2 rounded uppercase font-bold tracking-wider">INTELLIGENT</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Intercepts, scans, and sandboxes incoming direct messages and bio links against malware signatures in real-time.
                </div>
              </div>
              <button
                onClick={() => {
                  const newVal = !settings.phishingScanner;
                  updateSetting('phishingScanner', newVal);
                  addAuditLog('Change', newVal ? 'Info' : 'Low', 'Phishing scanner updated', `Active scan set to: ${newVal}`);
                }}
                className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.phishingScanner ? 'bg-emerald-500' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.phishingScanner ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 2. Right Column - Password Strength and Breach Check */}
      <div className="lg:col-span-4 flex flex-col gap-6" id="right-accounts-column">
        
        {/* Realtime Password Checker */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-lg flex flex-col h-fit" id="pwd-strength-card">
          <div className="border-b border-gray-800 pb-3 mb-4">
            <h3 className="font-sans font-semibold tracking-tight text-white text-base">
              Password Threat Analyser
            </h3>
            <div className="text-xs text-gray-400 mt-0.5">Determine password resilience against dictionaries & hashing cracks.</div>
          </div>

          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password to test..."
              className="w-full bg-[#0b0f19] border border-gray-800 text-gray-200 placeholder-gray-500 text-sm rounded p-2.5 pr-10 focus:outline-none focus:border-blue-500 font-mono"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {password ? (
            <div className="space-y-3 font-sans">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400">Strength Rating:</span>
                <span className={`font-bold ${strengthInfo.textClass}`}>
                  {strengthInfo.strength} ({strengthInfo.score}/4)
                </span>
              </div>
              
              {/* Strength bars */}
              <div className="grid grid-cols-4 gap-1 h-1.5">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`rounded-sm transition-all duration-300 ${
                      step <= strengthInfo.score ? strengthInfo.color : 'bg-gray-800'
                    }`}
                  />
                ))}
              </div>

              {/* Criteria list */}
              <div className="bg-gray-905 bg-black/30 p-2.5 rounded border border-gray-800 text-xs text-gray-300 space-y-1.5 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className={strengthInfo.criteria.length ? 'text-emerald-400' : 'text-gray-500'}>
                    {strengthInfo.criteria.length ? '✓' : '✗'}
                  </span>
                  <span>Length &ge; 10 chars ({password.length})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={strengthInfo.criteria.caseMix ? 'text-emerald-400' : 'text-gray-500'}>
                    {strengthInfo.criteria.caseMix ? '✓' : '✗'}
                  </span>
                  <span>Lower- & Upper-case mix</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={strengthInfo.criteria.numbers ? 'text-emerald-400' : 'text-gray-500'}>
                    {strengthInfo.criteria.numbers ? '✓' : '✗'}
                  </span>
                  <span>Numeric input (0-9)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={strengthInfo.criteria.symbols ? 'text-emerald-400' : 'text-gray-500'}>
                    {strengthInfo.criteria.symbols ? '✓' : '✗'}
                  </span>
                  <span>Special symbols (@, #, !, etc.)</span>
                </div>
              </div>

              {/* Improvement tips */}
              {strengthInfo.tips.length > 0 && (
                <div className="text-xs">
                  <div className="text-orange-400 font-semibold mb-1">To improve complexity:</div>
                  <ul className="list-disc pl-4 text-gray-400 space-y-0.5">
                    {strengthInfo.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-gray-500 justify-center p-4 border border-dashed border-gray-800 rounded bg-[#0b0f19]/20">
              <KeyRound className="w-4 h-4 text-gray-600" />
              <span>Type a key above to analyze cracking speed.</span>
            </div>
          )}
        </div>

        {/* HaveIBeenPwned Checker Integration */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-lg flex flex-col h-fit" id="hibp-check-card">
          <div className="border-b border-gray-800 pb-3 mb-4">
            <h3 className="font-sans font-semibold tracking-tight text-white text-base">
              Breach Tracker (HIBP)
            </h3>
            <div className="text-xs text-gray-400 mt-0.5">Validate email leaks against cataloged database dumps.</div>
          </div>

          <form onSubmit={handleCheckEmail} className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
              <input
                type="email"
                required
                value={emailQuery}
                onChange={(e) => setEmailQuery(e.target.value)}
                placeholder="e.g. harshit@dev.me"
                className="w-full bg-[#0b0f19] border border-gray-800 text-gray-200 placeholder-gray-500 text-xs rounded p-2.5 pl-9 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={checkingEmail}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded focus:outline-none transition-colors duration-150 flex items-center justify-center min-w-[70px]"
            >
              {checkingEmail ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Scan'}
            </button>
          </form>

          {emailResult && emailResult.checked && (
            <div className="mt-2 text-xs font-mono">
              {emailResult.breached ? (
                <div className="p-3 bg-red-950/40 border border-red-800/60 rounded text-red-300">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    BREACH REPORT DETECTED!
                  </div>
                  <div>Account breached in <span className="font-extrabold text-white">{emailResult.count}</span> security dumps.</div>
                  <div className="text-gray-400 text-[11px] mt-2 font-sans mb-1 uppercase tracking-wider font-semibold">Identified Lists:</div>
                  <div className="max-h-[100px] overflow-y-auto space-y-1 mt-1 pr-1 border-t border-red-900/40 pt-1.5">
                    {emailResult.sources.map((src, i) => (
                      <div key={i} className="text-[11px] text-gray-300 flex items-center gap-1 bg-red-900/10 p-1 rounded">
                        <span className="text-red-500">•</span> {src}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded text-emerald-300">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    CLEAN IDENTITY SHIELD
                  </div>
                  <div>This email showed no compromised telemetry entries on known leak indexes.</div>
                </div>
              )}
            </div>
          )}

          <div className="text-[10px] text-gray-500 font-mono mt-2 leading-relaxed">
            Note: Tests for <span className="text-blue-400">"breached@mail.com"</span> or your verified <span className="text-blue-400">harshitshrivastav0110@gmail.com</span> simulate real-world dump triggers for verification.
          </div>
        </div>

      </div>

    </div>
  );
}
