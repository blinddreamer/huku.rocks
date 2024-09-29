import React, { useEffect, useState, Fragment } from "react";
import Animated from "./animated";
import LoadingSpinner from "./LoadingSpinner";

const Monitor = () => {
  const [monitors, setMonitors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMonitorsData = async () => {
    try {
      const response = await fetch(
        "https://apiuptime.lab.huku.rocks/api/monitors"
        //"http://192.168.250.50:5000/api/monitors"
      );
      if (!response.ok) {
        throw new Error(`Network response - not ok (${response.status})`);
      }
      const data = await response.json();
      console.log("Fetched Data:", data);
      if (Array.isArray(data) && data.length > 0) {
        setMonitors(data[0]);
      } else {
        setMonitors([]);
      }
    } catch (error) {
      console.error("Fetch Error:", error.message);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitorsData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Fragment>
      <Animated>
        <main>
          <div className="grid-container">
            <div className="grid-item">Name</div>
            <div className="grid-item">Status</div>
            <div className="grid-item">Uptime</div>
            {monitors.length > 0 ? (
              monitors.map((monitor) => (
                <Fragment key={monitor.ID}>
                  <div className="grid-item">{monitor.Name}</div>
                  <div className="grid-item">{monitor.Uptime_Status}</div>
                  <div className="grid-item">
                    {monitor.Uptime_Stats?.Total?.Uptime || "N/A"}%
                  </div>
                </Fragment>
              ))
            ) : (
              <div className="grid-item" colSpan="3">
                No data found.
              </div>
            )}
          </div>
        </main>
      </Animated>
    </Fragment>
  );
};

export default Monitor;
