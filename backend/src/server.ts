import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Mock database data
const mockRideHistory = [
  { id: '1', date: 'Today, 8:30 AM', duration: '24m', distance: '12km', avgSpeed: 35, safetyScore: 98, status: 'Safe' },
  { id: '2', date: 'Yesterday, 6:15 PM', duration: '45m', distance: '18km', avgSpeed: 42, safetyScore: 85, status: 'Risky' },
  { id: '3', date: 'Mon, 9:00 AM', duration: '15m', distance: '5km', avgSpeed: 28, safetyScore: 100, status: 'Safe' },
];

const mockAlerts = [
  { id: 'a1', type: 'HELMET', timestamp: 'Yesterday, 6:20 PM', location: 'Main St. Junction', resolved: true },
  { id: 'a2', type: 'ALCOHOL', timestamp: 'Last Week', location: 'Downtown', resolved: true },
];

// Routes
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    deviceConnected: true,
    deviceId: 'helmet-x1-789a',
    firmwareVersion: '1.0.4',
    battery: 88,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/rides', (req, res) => {
  res.json(mockRideHistory);
});

app.get('/api/alerts', (req, res) => {
  res.json(mockAlerts);
});

app.post('/api/emergency', (req, res) => {
  const { type, location, riderProfile, sensorData } = req.body;
  console.log(`[EMERGENCY ALERT] Level critical incident detected!`);
  console.log(`Type: ${type || 'CRASH/SOS'}`);
  console.log(`Location: ${JSON.stringify(location || 'Unknown Coordinates')}`);
  console.log(`Rider: ${JSON.stringify(riderProfile || 'Unknown Rider')}`);
  console.log(`Sensor Data: ${JSON.stringify(sensorData || '{}')}`);
  res.status(201).json({ success: true, message: 'Emergency dispatch message broadcasted.' });
});

app.listen(port, () => {
  console.log(`Guardian Helmet AI Backend listening at http://localhost:${port}`);
});
