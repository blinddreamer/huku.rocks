//DO NOT USE

import React, { useState, useEffect } from "react";
import axios from "axios";

const UptimeMonitor = ({ service }) => {
  const [uptimeData, setUptimeData] = useState([]);

  useEffect(() => {
    // Fetch uptime data from the backend
    axios
      .get(`https://api.huku.rocks/api/uptime/${service}`)
      .then((response) => {
        console.log(`Data fetched for ${service}:`, response.data);
        const data = Array.isArray(response.data) ? response.data : [];
        setUptimeData(data);
      })
      .catch((err) => {
        console.error("Error fetching uptime data:", err);
        setUptimeData([]); // Ensure uptimeData remains an empty array in case of error
      });
  }, [service]);

  const totalCubes = 24;

  // Use the last 24 data points, and if there are fewer, fill the rest with null (representing no data)
  const statusData = uptimeData
    .slice(0, totalCubes)
    .map((entry) => entry.status);

  // Ensure that we always have 24 cubes, filling the remaining with `null` to represent no data
  const paddedData = [
    ...statusData,
    ...Array(totalCubes - statusData.length).fill(null), // Fill with null (no data) if there aren't 24 data points
  ];

  return (
    <div>
      <h3>{service}</h3>
      <div className="cube-grid">
        {paddedData.map((status, index) => (
          <div
            key={index}
            className={`cube ${
              status === 1 ? "green" : status === 0 ? "red" : "white"
            }`}
            title={
              uptimeData[index]
                ? new Date(uptimeData[index].timestamp).toLocaleString()
                : "No data"
            }
          ></div>
        ))}
      </div>
    </div>
  );
};

export default UptimeMonitor;
