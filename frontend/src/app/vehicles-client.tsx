"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import VehicleTable from "@/app/components/VehicleTable";
import { getVehicles } from "@/lib/api";
import { Vehicle } from "@/lib/types";

export default function ClientVehicles({ initialVehicles }: { initialVehicles: Vehicle[] }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const v = await getVehicles();
      setVehicles(v);
      setLastUpdated(Date.now());
    } catch (e: any) {
      setError(e?.message ?? "Failed to refresh vehicles");
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh every 10s
  useEffect(() => {
    const t = setInterval(refresh, 10000);
    return () => clearInterval(t);
  }, [refresh]);

  const updatedLabel = useMemo(() => {
    const d = new Date(lastUpdated);
    return d.toLocaleTimeString();
  }, [lastUpdated]);

  return (
    <div>
      {error ? (
        <div className="card" style={{ borderColor: "rgba(239, 68, 68, 0.40)", marginBottom: 12 }}>
          <div style={{ fontWeight: 750 }}>Couldn’t load vehicles</div>
          <div className="muted">{error}</div>
        </div>
      ) : null}

      <div className="toolbar">
        <div className="small">
          Last updated: <span className="muted">{updatedLabel}</span>
        </div>
        <div className="rightGroup">
          <button className="btn btnPrimary" onClick={refresh} disabled={loading} aria-label="Refresh vehicles">
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      <VehicleTable vehicles={vehicles} onUpdated={refresh} />
    </div>
  );
}
