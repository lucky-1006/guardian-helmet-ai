# 🛡️ Guardian Helmet AI — Intelligent Safety Dashboard

Guardian Helmet AI is a smart, connected helmet ecosystem designed to protect motorcyclists by integrating real-time telemetry, active safety metrics, and automated emergency response mechanics. The project consists of a high-fidelity React dashboard interface (frontend) and an Express-powered server (backend) that processes data from simulated IoT sensors on the helmet.

<img width="546" height="1076" alt="life home" src="https://github.com/user-attachments/assets/f4a1f797-37ef-4503-aa57-07679f38abb7" />
<img width="548" height="1076" alt="life stats" src="https://github.com/user-attachments/assets/9d7d9380-7a27-45f3-85b1-f534f23d1ee9" />
<img width="547" height="1079" alt="life map" src="https://github.com/user-attachments/assets/a3eb8f7d-0a74-4620-b9b7-3b6ad99a9026" />
<img width="542" height="1071" alt="life system" src="https://github.com/user-attachments/assets/56ff4235-c815-44f4-a3ab-bb9651cf79e6" />
<img width="547" height="1079" alt="life setting" src="https://github.com/user-attachments/assets/27a1260c-b3a7-4fb2-83bc-8fc355214bb0" />


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

## ⚙️ How to Run Locally — Step-by-Step Guide

Follow these steps to configure, install, and launch the Guardian Helmet AI application on any system.

### 📋 Prerequisites

Before starting, ensure you have the following installed on your machine:
1. **Node.js** (v18.0.0 or higher recommended): [Download Node.js](https://nodejs.org/)
2. **npm** (v9.0.0 or higher, usually comes bundled with Node.js): You can check your versions by running:
   ```bash
   node -v
   npm -v
   ```
3. **Git**: [Download Git](https://git-scm.com/)

---

### 🛠️ Step 1: Clone the Repository

Download the project code to your local machine:
```bash
git clone https://github.com/lucky-1006/guardian-helmet-ai.git
cd guardian-helmet-ai
```

---

### 📦 Step 2: Install All Dependencies

The project uses a root-level script to install dependencies for the root environment, the frontend, and the backend concurrently:
```bash
npm run install:all
```
*(Alternative: You can manually navigate to the `frontend/` and `backend/` directories and run `npm install` inside each.)*

---

### 🔐 Step 3: Configure Environment Variables (Optional)

The application uses environment files for configuration:

#### A. Backend Configuration
Create a `.env` file inside the `backend/` directory:
```bash
# Path: backend/.env
PORT=3001
```

#### B. Frontend Configuration (For Map Visualization)
The application uses Mapbox static maps for routes and heatmap displays. If you want the map backgrounds to render properly instead of showing as a fallback blank state, create a `.env` file inside the `frontend/` directory:
```bash
# Path: frontend/.env
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_public_access_token
```
*(You can get a free token by creating a free account at [Mapbox](https://www.mapbox.com/)).*

---

### 🚀 Step 4: Run the Application Locally

Start both the frontend client and the backend server concurrently in development mode using:
```bash
npm run dev
```

Your terminal will display logs for both the frontend compiler and backend server:
* 🖥️ **Frontend Dashboard**: Open [http://localhost:3000](http://localhost:3000) in your web browser.
* ⚙️ **Backend API Server**: Listening at [http://localhost:3001](http://localhost:3001).

---

### 🧪 Step 5: Test the Live Connection

Once the dashboard loads at `http://localhost:3000`:
1. Verify the link indicator in the top-left corner shows **System Online** (green).
2. Click the **Terminal icon (Developer Tools)** in the top-right header to toggle the debug console drawer.
3. Use the toggle buttons in the drawer to override sensors (such as helmet buckle state, alcohol level sliders, or simulating emergency crash incidents).
4. Verify backend routes respond correctly by opening [http://localhost:3001/api/status](http://localhost:3001/api/status) in your browser.

---

### 📦 Step 6: Build for Production (Deploy ready)

To build both modules into optimized production bundles (`dist/` directories):
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
