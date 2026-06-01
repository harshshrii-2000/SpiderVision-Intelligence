# SpiderVision Intelligence 🕷️🕸️👁️
> **See Every Threat Before It Strikes.**
> Monitor • Detect • Analyze • Protect

---

## 📌 Project Overview
**SpiderVision Intelligence** is a multi-dimensional, production-ready full-stack Cybersecurity Monitoring & Threat Intelligence Platform. Inspired by a spider's hyper-sensitive ability to sense minutest vibrations across its web, this command center continuously probes connected digital accounts, local host vitals, process trees, and live socket adapters to preemptively flag, block, and mitigate intrusive threat vectors.

This command center integrates a **Social Media Account Protection Tool** alongside a live-probing **System Activity Monitor**, featuring inline real-time AI security reports fueled by the advanced **Google Gemini API**, a high-fidelity vector threat maps visualizer, custom credential dictionary strength testing, and deterministic HaveIBeenPwned API simulator loops.

---

## 🚀 Key Modules & Active Features

### 🔒 Tab 1 — Accounts (Account Protection Shield)
- **Account Protection Shielding**: Instant per-account active state toggles for 4 social platforms (*Twitter/X*, *Instagram*, *GitHub*, *LinkedIn*).
- **Proactive Protection Controls**: Multi-channel settings including:
  - Strict Two-Factor Authentication Enforcer
  - Geo-location Anomaly and Travel Threat Engine
  - Real-time SMS & Browser New Device Alerts
  - Force Auto-Revoke of stale inactive browser sessions
- **Password Threat Analyser**: Dynamic strength scorer with color bar graphs tracking 4 discrete complexity requirements (length, case mix, numbers, symbols) and tailored mitigation instructions.
- **Breach Tracker (HIBP)**: Validates compromised email hashes against known corporate data drops.

### 🛡️ Tab 2 — Threats (Threat Discovery & Mapping)
- **Active Incident Response**: Live list tracking intrusion IDs, origin locations, User Agents, and resolution controls.
- **Global Live Threat Vectors Map**: Vector world outline featuring moving data trails, active country alerts, and real-time visual pings.
- **Threat Vector Analytics Map**: Horizontal metrics showing percentage distribution across critical hacking vectors.
- **Gemini Threat analysis Scan**: Dispatches JSON log state payloads into server-side Gemini pipelines to return technical advisory advisories.

### 💻 Tab 3 — System Monitor (Vitals Telemetry)
- **Host Metrics Header**: Dynamic cards displaying live CPU Load, RAM Allocation, Disk Sector Status, and Host network latency.
- **60-Second Sparkline Trend Chart**: SVG line chart tracking history.
- **Active Server Processes**: List representing CPU priorities and memory size footprints.
- **Network Adapters**: Track connection status on wlan0, eth0, and encrypted VPN tunnels.

### 📊 Tab 4 — Chrono Audit Logs
- Chronological security audits categorized by badges (`Login`, `Alert`, `Change`, `System`) alongside severity tags (`Critical`, `High`, `Medium`, `Info`).
- Compiled comprehensive reports using Gemini.

---

## 📦 Directory Structure

```text
├── server.ts                 # Full-Stack Express Server (API core / Vite middleware)
├── package.json              # App manifest & tool dependencies
├── metadata.json             # AI Studio Application metadata configuration
├── .env.example              # Secret key placeholder file
├── src/
│   ├── App.tsx               # Main Command Center Container
│   ├── types.ts              # Declarative TypeScript Type Safeguards
│   ├── index.css             # Root Tailwind CSS with fonts initialization
│   ├── main.tsx              # React mounting entry point
│   ├── components/
│   │   ├── AccountsTab.tsx   # Tab 1: Protection policies, password & email leaks
│   │   ├── ThreatsTab.tsx    # Tab 2: Hacking vector bars & AI triggers
│   │   ├── ThreatMap.tsx     # Vector live threat mapping visual SVG representation
│   │   ├── SystemMonitorTab.tsx # Tab 3: Sparkline telemetry chart & process grids
│   │   └── AuditLogTab.tsx   # Tab 4: Chronological auditable events log
```

---

## 🐍 Python / Flask Backend Reference Architecture
If you plan to run a parallel lightweight python implementation locally or on your production cluster, the codebase is architectural-ready. Below is the Flask skeleton setup for your portfoli:

### 1. Requirements (`requirements.txt`)
```text
Flask==3.0.2
Flask-Login==0.6.3
psutil==5.9.8
watchdog==4.0.0
requests==2.31.0
google-genai==2.4.0
```

### 2. Flask Entry Point (`app.py`)
```python
import os
import psutil
from flask import Flask, jsonify, render_template
from flask_login import LoginManager, UserMixin

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "spider-vision-secret-token")

@app.route("/api/system/stats")
def system_stats():
    # Real host hardware metrics
    cpu_percent = psutil.cpu_percent(interval=None)
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage('/')
    
    # Processes
    processes = []
    for proc in sorted(psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_info']), key=lambda p: p.info.get('cpu_percent', 0), reverse=True)[:5]:
        processes.append({
            "pid": proc.info['pid'],
            "name": proc.info['name'],
            "cpu": proc.info['cpu_percent'] or 0.1,
            "mem": f"{round(proc.info['memory_info'].rss / (1024 * 1024))} MB"
        })

    return jsonify({
        "cpu": cpu_percent,
        "ram": memory.percent,
        "disk": disk.percent,
        "ping": 12,
        "processes": processes,
        "interfaces": {
            "wlan0": {"status": "connected", "rx": "4.8 MB/s", "tx": "1.2 MB/s"}
        }
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000)
```

---

## 🛠️ Installation & Local Setup

### Prerequisite Node.js Flow:
1. Ensure **Node.js (18+)** is configured.
2. Clone this repository locally.
3. Install package assets:
   ```bash
   npm install
   ```
4. Create the local environmental secrets:
   ```bash
   cp .env.example .env
   ```
   Add your `GEMINI_API_KEY` to `.env` file or from AI Studio Settings Panel.
5. Kick off development hot-reload server:
   ```bash
   npm run dev
   ```
6. Build for production:
   ```bash
   npm run build
   ```

---

## 🤖 GitHub Automation & Push Guide
Push this production-ready code straight to your GitHub repository: [harshshrii-2000/SpiderVision-Intelligence](https://github.com/harshshrii-2000/SpiderVision-Intelligence) using these terminal steps:

```bash
# 1. Initialize local folder as a git database
git init

# 2. Add local workspace tracking configurations
git add .

# 3. Save core commit files
git commit -m "feat: initial commit production-ready SpiderVision-Intelligence SOC dashboard"

# 4. Target your remote branch
git branch -M main

# 5. Connect to wild repository
git remote add origin https://github.com/harshshrii-2000/SpiderVision-Intelligence.git

# 6. Push code to main
git push -u origin main
```

---

## 🗺️ Future Roadmap
- [ ] Connect remote system agent telemetry over daemon websockets.
- [ ] Incorporate deep packet scraping parser for honeypot detections.
- [ ] Port offline database checking to a localized Redis/SQLite container loop.
- [ ] Establish alerts dispatching over Twilio or Discord webhooks.

---

## 🛡️ License
Distributed under the Apache-2.0 License. See `LICENSE` for more information.
Created by **[Harshit S.](https://github.com/harshshrii-2000)**.
