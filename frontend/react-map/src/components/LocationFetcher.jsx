import React, { useEffect, useState } from "react";
import MapView from "./MapView";

const LocationFetcher = () => {
  const [locations, setLocations] = useState([]);

  const fetchLatest = async () => {
    try {
      const res = await fetch("http://localhost:5010/api/latest-sos");
      const data = await res.json();

      if (
        data &&
        data.latitude &&
        data.longitude &&
        !locations.some(
          (loc) =>
            loc.latitude === data.latitude &&
            loc.longitude === data.longitude &&
            loc.message === data.message
        )
      ) {
        setLocations((prev) => [...prev, data]);
      }
    } catch (err) {
      console.error("Error fetching SOS:", err);
    }
  };

  useEffect(() => {
    fetchLatest();
    const interval = setInterval(fetchLatest, 5000); // fetch every 5s
    return () => clearInterval(interval);
  }, [locations]);

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold">🆘 Live SOS Locations</h2>
      <MapView locations={locations} />
    </div>
  );
};

export default LocationFetcher;
