import MetricCards from "@/app/components/MetricCards";
import ClientVehicles from "@/app/vehicles-client";
import { getMetrics, getVehicles } from "@/lib/api";

export default async function Page() {
  const [metrics, vehicles] = await Promise.all([getMetrics(), getVehicles()]);

  return (
    <main className="container">
      <div className="header">
        <div>
          <h1 className="h1">FleetOps Dashboard</h1>
          <div className="subhead">
            Partner tooling prototype — manage vehicle availability, driver assignment, and daily performance.
          </div>
        </div>

        <div className="rightGroup">
          <span className="pill" aria-label="Stack">
            <span className="dot dotAvailable" aria-hidden="true" />
            Next.js + TypeScript + Flask
          </span>
        </div>
      </div>

      <MetricCards metrics={metrics} />

      <div className="toolbar">
        <div className="muted2">
          Tip: Update a vehicle status or driver, then hit <b>Refresh</b>.
        </div>
      </div>

      <ClientVehicles initialVehicles={vehicles} />
    </main>
  );
}
