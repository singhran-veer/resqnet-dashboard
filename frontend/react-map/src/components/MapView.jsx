import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || window.location.origin;


// Custom SOS marker icon
const sosIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/14831/14831599.png",
  iconSize: [65, 65],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

export default function MapView() {
  const [sosList, setSosList] = useState([]);

  useEffect(() => {
    const fetchSOS = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/sos`);
        setSosList(res.data);
        console.log("📡 Initial SOS fetched:", res.data);
      } catch (err) {
        console.error("❌ Error fetching SOS:", err);
      }
    };

    fetchSOS();

    // ✅ Setup SSE connection
    const eventSource = new EventSource(`${API_BASE_URL}/api/sos/stream`);

    eventSource.onopen = () => console.log("✅ SSE connection opened");
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📡 SSE update received:", data);
        setSosList((prev) => [...prev, data]);
      } catch (err) {
        console.error("⚠️ SSE parse error:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("❌ SSE error:", err);
    };

    return () => {
      console.log("🧹 Closing SSE connection");
      eventSource.close();
    };
  }, []);

  const handleResolve = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/sos/${id}`);
      console.log("✅ SOS resolved:", id);
      setSosList((prev) => prev.filter((sos) => sos.id !== id));
    } catch (err) {
      console.error("❌ Error resolving SOS:", err);
    }
  };

  return (
    <MapContainer
      center={[28.6139, 77.209]}
      zoom={5}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      />

      {sosList.map((sos) => (
        <Marker key={sos.id} position={[sos.latitude, sos.longitude]} icon={sosIcon}>
          <Popup>
            <b>{sos.message}</b>
            <br />
            📍 Lat: {sos.latitude}, Lng: {sos.longitude}
            <br />
            🕒 {sos.time ? new Date(sos.time).toLocaleString() : ""}
            <br />
            <button
              style={{
                marginTop: "5px",
                padding: "5px 10px",
                background: "#e63946",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => handleResolve(sos.id)}
            >
              Mark Resolved
            </button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
