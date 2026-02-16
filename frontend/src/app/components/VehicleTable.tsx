"use client";

import { useMemo, useState } from "react";
import StatusBadge from "./StatusBadge";
import { Vehicle, VehicleStatus } from "@/lib/types";
import { assignDriver, patchVehicleStatus } from "@/lib/api";

type Props = {
  vehicles: Vehicle[];
  onUpdated: () => void;
};

const STATUS_OPTIONS: { key: VehicleStatus; label: string }[] = [
  { key: "available", label: "Available" },
  { key: "in_ride", label: "In Ride" },
  { key: "maintenance", label: "Maintenance" },
];

export default function VehicleTable({ vehicles, onUpdated }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [driverDraft, setDriverDraft] = useState<Record<string, string>>({});

  const sorted = useMemo(() => {
    return [...vehicles].sort((a, b) => b.updated_at - a.updated_at);
  }, [vehicles]);

  async function updateStatus(id: string, status: VehicleStatus) {
    try {
      setLoadingId(id);
      await patchVehicleStatus(id, status);
      onUpdated();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  }

  async function saveDriver(id: string) {
    const value = (driverDraft[id] ?? "").trim();
    const payload = value.length === 0 ? null : value;
    try {
      setLoadingId(id);
      await assignDriver(id, payload);
      onUpdated();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  }

  async function clearDriver(id: string) {
    try {
      setLoadingId(id);
      await assignDriver(id, null);
      setDriverDraft((d) => ({ ...d, [id]: "" }));
      onUpdated();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <section className="card" aria-label="Vehicles">
      <div className="cardHeader">
        <div>
          <h2 className="cardTitle">Vehicles</h2>
          <div className="small">Update status, assign drivers, and track daily performance.</div>
        </div>
        <div className="pill" aria-label="Data freshness">
          <span className="dot dotInRide" aria-hidden="true" />
          Live-ish (10s refresh)
        </div>
      </div>

      <div className="tableWrap" role="region" aria-label="Vehicles table">
        <table>
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Status</th>
              <th>Location</th>
              <th>Driver</th>
              <th>Earnings</th>
              <th>Rides</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((v) => (
              <tr key={v.id}>
                <td style={{ fontWeight: 760, letterSpacing: "-0.01em" }}>{v.id}</td>
                <td><StatusBadge status={v.status} /></td>
                <td className="muted">{v.location}</td>

                <td>
                  <div className="tableActions">
                    <input
                      className="input"
                      style={{ width: 160 }}
                      aria-label={`Driver for ${v.id}`}
                      placeholder={v.driver ?? "Unassigned"}
                      value={driverDraft[v.id] ?? ""}
                      onChange={(e) => setDriverDraft((d) => ({ ...d, [v.id]: e.target.value }))}
                    />
                    <button
                      className="btn btnPrimary"
                      onClick={() => saveDriver(v.id)}
                      disabled={loadingId === v.id}
                    >
                      Save
                    </button>
                    <button
                      className="btn"
                      onClick={() => clearDriver(v.id)}
                      disabled={loadingId === v.id}
                      aria-label={`Clear driver for ${v.id}`}
                    >
                      Clear
                    </button>
                  </div>
                  <div className="small" style={{ marginTop: 6 }}>
                    Current: <span className="muted">{v.driver ?? "—"}</span>
                  </div>
                </td>

                <td>${v.earnings_today.toFixed(2)}</td>
                <td>{v.rides_today}</td>

                <td>
                  <div className="tableActions">
                    {STATUS_OPTIONS.map((s) => (
                      <button
                        key={s.key}
                        className={`btn ${s.key === v.status ? "btnPrimary" : ""}`}
                        onClick={() => updateStatus(v.id, s.key)}
                        disabled={loadingId === v.id || v.status === s.key}
                        aria-label={`Set ${v.id} status to ${s.label}`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}

            {sorted.length === 0 ? (
              <tr>
                <td colSpan={7} className="muted">No vehicles found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
