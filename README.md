# 🚨 ResQNet – Real-Time SOS Location Dashboard

ResQNet is a **real-time emergency alert and tracking system** built to help visualize SOS messages on a live interactive map.  
The platform uses **Node.js (Express)** for the backend and **React + Leaflet** for the frontend.

🌐 **Live Demo:** [https://resqnet-dashboard.onrender.com](https://resqnet-dashboard.onrender.com)

---

## ⚙️ Features

- 📍 **Live SOS Location Tracking** – Displays emergency markers on a real-time map.
- 🔄 **Instant Map Updates** – Uses **Server-Sent Events (SSE)** for instant marker updates without refreshing.
- 🗺️ **Interactive Map Interface** – Built using **React Leaflet** and OpenStreetMap.
- ✅ **Resolve & Remove Alerts** – Admins can mark resolved SOS alerts.
- 🌩️ **Deployed on Render** – Fully hosted backend + frontend on a single Render service.

---

## 🧠 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React (Vite), Leaflet, Axios |
| **Backend** | Node.js, Express.js, CORS |
| **Realtime Communication** | Server-Sent Events (SSE) |
| **Deployment** | Render |

---

curl -X POST https://resqnet-dashboard.onrender.com/api/sos \
  -H "Content-Type: application/json" \
  -d '{"message":"Test SOS from user","latitude":28.6139,"longitude":77.2090}'


## 🗂️ Folder Structure

