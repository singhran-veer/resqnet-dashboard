import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 5010;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://your-frontend-name.onrender.com"],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve built frontend (for Render)
app.use(express.static(path.join(__dirname, "../frontend/react-map/dist")));

let clients = [];
let sosList = [];

// 🔹 SSE Stream (live updates)
app.get("/api/sos/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const clientId = Date.now();
  clients.push(res);
  console.log(`✅ Client ${clientId} connected`);

  // Heartbeat to prevent Render / browser timeout
  const keepAlive = setInterval(() => {
    res.write(":\n\n");
  }, 15000);

  req.on("close", () => {
    console.log(`❌ Client ${clientId} disconnected`);
    clearInterval(keepAlive);
    clients = clients.filter((c) => c !== res);
  });
});

// 🔹 Get all SOS entries
app.get("/api/sos", (req, res) => {
  res.json(sosList);
});

// 🔹 Receive new SOS
app.post("/api/sos", (req, res) => {
  const { message, latitude, longitude } = req.body;

  const newSOS = {
    id: Date.now(),
    message,
    latitude,
    longitude,
    time: new Date(),
  };

  sosList.push(newSOS);
  console.log("📩 Received SOS:", newSOS);

  // Send to all connected clients
  clients.forEach((client) => {
    client.write(`data: ${JSON.stringify(newSOS)}\n\n`);
  });

  res.status(200).json({ success: true });
});

// 🔹 Delete SOS (mark resolved)
app.delete("/api/sos/:id", (req, res) => {
  const id = Number(req.params.id);
  sosList = sosList.filter((sos) => sos.id !== id);
  console.log(`🗑️ SOS ${id} removed`);
  res.status(200).json({ success: true });
});

// Serve React app
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/react-map/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
