import React from "react";
import LocationFetcher from "./components/LocationFetcher";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">ResQNet Dashboard</h1>
      <LocationFetcher />
    </div>
  );
};

export default App;
