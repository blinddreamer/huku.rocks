// MonitorPage.jsx
import React from "react";
import UptimeMonitor from "./monitor"; // Monitor component
import Animated from "./animated";

const MonitorPage = () => {
  return (
    <>
      <Animated>
        <div id="monitor">
          <h1 id="servicesuptimemonitor">services uptime monitor</h1>
          {/* Add multiple monitors for different services */}
          <div id="uptimeservice">
            <UptimeMonitor service="guacamole.huku.rocks" />
          </div>
          <div id="uptimeservice">
            <UptimeMonitor service="ha.huku.rocks" />
          </div>
          <div id="uptimeservice">
            <UptimeMonitor service="huku.rocks" />
          </div>
          <div id="uptimeservice">
            <UptimeMonitor service="ntfy.huku.rocks" />
          </div>
          <div id="uptimeservice">
            <UptimeMonitor service="plex.huku.rocks" />
          </div>
          <div id="uptimeservice">
            <UptimeMonitor service="request.huku.rocks" />
          </div>
          <div id="uptimeservice">
            <UptimeMonitor service="warden.huku.rocks" />
          </div>
          <div id="uptimeservice">
            <UptimeMonitor service="wiki.huku.rocks" />
          </div>
        </div>
      </Animated>
    </>
  );
};

export default MonitorPage;
