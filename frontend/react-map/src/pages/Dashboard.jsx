import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const navigate = useNavigate();

  const handleShowMap = () => {
    if (latitude && longitude) {
      navigate(`/map?lat=${latitude}&lon=${longitude}`);
    } else {
      alert("Please enter both latitude and longitude");
    }
  };

  return (
    <div className="dashboard">
      <h1>ResQNet Dashboard</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />
        <button onClick={handleShowMap}>Show on Map</button>
      </div>
    </div>
  );
}

export default Dashboard;
