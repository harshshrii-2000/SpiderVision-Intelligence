/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LinkedAccount {
  id: string;
  name: string;
  platform: 'Twitter' | 'Instagram' | 'GitHub' | 'LinkedIn';
  handle: string;
  lastActive: string;
  status: 'Secure' | 'Review';
  avatarUrl?: string;
  protectionEnabled: boolean;
}

export interface SecuritySettings {
  twoFactor: boolean;
  anomalyDetection: boolean;
  newDeviceAlerts: boolean;
  autoRevokeSessions: boolean;
  phishingScanner: boolean;
}

export interface ThreatIncident {
  id: string;
  type: string;
  platform: string;
  device: string;
  location: string;
  timestamp: string;
  status: 'Blocked' | 'Investigating' | 'Resolved';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface SystemProcess {
  pid: number;
  name: string;
  cpu: number;
  mem: string;
}

export interface AuditLogItem {
  id: string;
  time: string;
  type: 'Login' | 'Alert' | 'Change' | 'System';
  severity: 'Info' | 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  detail: string;
}

export interface BreachResult {
  email: string;
  breached: boolean;
  count: number;
  sources: string[];
}
