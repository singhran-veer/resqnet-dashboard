import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 5010;

// ✅ Proper CORS setup for local + Render
app.use(
  cors({
    origin: ["http://localhost:5173", "https://resqnet-dashboard.onrender.com"],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve built React app (for Render)
app.use(express.static(path.join(__dirname, "../frontend/react-map/dist")));

let clients = [];
let sosList = [];

// 🔹 SSE connection (live updates)
app.get("/api/sos/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // Important for Render
  res.flushHeaders();

  const clientId = Date.now();
  clients.push(res);
  console.log(`✅ Client ${clientId} connected`);

  // 🫀 Keepalive ping every 10s (prevents disconnect)
  const keepAlive = setInterval(() => {
    res.write(": keep-alive\n\n");
  }, 10000);

  req.on("close", () => {
    console.log(`❌ Client ${clientId} disconnected`);
    clearInterval(keepAlive);
    clients = clients.filter((c) => c !== res);
  });
});

// 🔹 Get all stored SOS entries
app.get("/api/sos", (req, res) => {
  res.json(sosList);
});

// 🔹 Handle new SOS (POST)
app.post("/api/sos", (req, res) => {
  const { message, latitude, longitude, lat, lon } = req.body;

  const newSOS = {
    id: Date.now(),
    message: message || "No message provided",
    latitude: latitude ?? lat,
    longitude: longitude ?? lon,
    time: new Date(),
  };

  sosList.push(newSOS);
  console.log("📩 Received SOS:", newSOS);

  // Broadcast new SOS to all connected clients
  clients.forEach((client) => {
    client.write(`data: ${JSON.stringify(newSOS)}\n\n`);
  });

  res.status(200).json({ success: true, newSOS });
});

// 🔹 Delete SOS
app.delete("/api/sos/:id", (req, res) => {
  const id = Number(req.params.id);
  sosList = sosList.filter((sos) => sos.id !== id);
  console.log(`🗑️ SOS ${id} removed`);
  res.status(200).json({ success: true });
});

// ✅ Serve frontend for all other routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/react-map/dist/index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
