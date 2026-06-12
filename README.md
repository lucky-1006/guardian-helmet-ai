# 🛡️ Guardian Helmet AI — Intelligent Safety Dashboard

Guardian Helmet AI is a smart, connected helmet ecosystem designed to protect motorcyclists by integrating real-time telemetry, active safety metrics, and automated emergency response mechanics. The project consists of a high-fidelity React dashboard interface (frontend) and an Express-powered server (backend) that processes data from simulated IoT sensors on the helmet.

---

## 🚀 Key Features

- **HUD Safety Dashboard**: Dynamic telemetry visualizer showcasing live speed tracking, connectivity links, and simulated system health.
- **Smart Helmet Verification**: Lock/unlock sensor monitoring to check if the helmet is buckled and securely worn before riding.
- **Alcohol Interlock Sensor**: Built-in breathalyzer sensor reading with visual threshold gauges to prevent driving under the influence.
- **Impact G-Force Simulator**: Visual coordinate grid measuring simulated G-Force impacts and vector distributions.
- **Emergency SOS Dispatcher**: Instantly broadcasts critical crash/accident data (GPS coordinates, sensor state, and rider medical profiles) to simulated emergency dispatch centers.
- **Developer Tools Console**: Interactive debug drawer allowing developers to trigger simulated crash events, disconnect sensors, toggle battery states, and override threshold alerts in real-time.
- **Voice Assistant Integration**: Interactive mic controller visualizer mimicking speech-driven helmet controls.

---

## 🛠️ Technology Stack

- **Root & Monorepo Manager**: Node.js & npm (Concurrent execution setup)
- **Frontend (Client)**: 
  - **Framework**: Vite + React (v19) + TypeScript
  - **Styling**: Tailwind CSS (Void theme: dark-mode focused, neon accents, and sleek glassmorphism)
  - **Icons**: Lucide React
  - **Graphs**: Recharts (for dynamic speed/velocity telemetry history)
- **Backend (Server)**:
  - **Framework**: Node.js + Express + TypeScript
  - **Runtime Watcher**: TSX (TypeScript Execute)

---

## 📂 Project Directory Structure

```text
guardian-helmet-ai/
├── backend/                       # Node.js + Express backend service
│   ├── src/
│   │   └── server.ts              # Main server setup and endpoints
│   ├── package.json               # Backend dependencies & run scripts
│   └── tsconfig.json              # TypeScript compilation setup
├── frontend/                      # Vite + React frontend dashboard
│   ├── components/                # Modular UI controls (GlassCard, Button, VoiceAssistant, etc.)
│   ├── screens/                   # Views (Dashboard, MapScreen, Setup, Onboarding, Status)
│   ├── services/                  # IoT and mock telemetry controllers
│   ├── index.html                 # App base HTML template
│   ├── index.tsx                  # Client entrypoint
│   ├── types.ts                   # Unified TS declarations
│   └── vite.config.ts             # Vite server compiler config
├── package.json                   # Root package configurations (concurrent management)
├── package-lock.json              # Unified dependency lockfile
└── README.md                      # Comprehensive user & developer documentation
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher recommended
- **npm**: v9.0.0 or higher (distributed with Node.js)

### Installation

Clone the repository and run the pre-configured root script to install dependencies for the root, frontend, and backend packages in a single step:

```bash
# Clone the repository
git clone https://github.com/lucky-1006/guardian-helmet-ai.git

# Navigate into the project folder
cd guardian-helmet-ai

# Install dependencies globally and inside subfolders
npm run install:all
```

### Running Locally

Launch both the Vite development client and the Express backend server concurrently using the root dev command:

```bash
# Start both frontend and backend concurrently
npm run dev
```

* **Frontend Dashboard**: running at [http://localhost:3000](http://localhost:3000)
* **Backend API Server**: running at [http://localhost:3001](http://localhost:3001)

### Building for Production

Compile both applications into optimized production builds (`dist/` directories):

```bash
npm run build
```

---

## 📡 API Endpoints (Backend)

The backend exposes the following REST APIs on port `3001`:

### 1. Retrieve Helmet Status
* **Endpoint**: `GET /api/status`
* **Response Payload**:
  ```json
  {
    "status": "online",
    "deviceConnected": true,
    "deviceId": "helmet-x1-789a",
    "firmwareVersion": "1.0.4",
    "battery": 88,
    "timestamp": "2026-06-12T13:19:58.000Z"
  }
  ```

### 2. Fetch Historical Rides
* **Endpoint**: `GET /api/rides`
* **Description**: Returns a list of past rides including duration, safety rating, average speed, and safety classification.

### 3. Fetch System Alerts
* **Endpoint**: `GET /api/alerts`
* **Description**: Logs of previous safety violations (e.g., helmet unbuckled or alcohol limits crossed).

### 4. Dispatch Emergency Signal
* **Endpoint**: `POST /api/emergency`
* **Request Body**:
  ```json
  {
    "type": "CRASH",
    "location": { "lat": 12.9716, "lng": 77.5946 },
    "riderProfile": { "name": "Swastik Singh", "bloodGroup": "O+" },
    "sensorData": { "gForce": 8.5 }
  }
  ```
* **Response**: `{ "success": true, "message": "Emergency dispatch message broadcasted." }`

---

## 📊 Release Log & Versioning

### `v1.0.0` (Current Release)
- Initial release of the unified **Guardian Helmet AI** project.
- Configured monorepo scripts for automatic, single-command installations and builds.
- Refined the dashboard's design system using vibrant dark mode cues (Void theme) and responsive telemetry charts.
- Configured Express REST backend service supporting active emergency webhooks.

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
