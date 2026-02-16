import { Metrics, Vehicle, VehicleStatus } from "./types";

/**
 * Server Components (Node) should use API_BASE.
 * Client Components (browser) can use NEXT_PUBLIC_API_BASE.
 */
const SERVER_BASE = process.env.API_BASE || "http://127.0.0.1:5001";
const CLIENT_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:5001";

function baseUrl() {
  return typeof window === "undefined" ? SERVER_BASE : CLIENT_BASE;
}

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status} calling ${path}`);
  }
  return res.json() as Promise<T>;
}

export async function getMetrics(): Promise<Metrics> {
  return http<Metrics>("/metrics");
}

export async function getVehicles(): Promise<Vehicle[]> {
  const data = await http<{ vehicles: Vehicle[] }>("/vehicles");
  return data.vehicles;
}

export async function patchVehicleStatus(vehicleId: string, status: VehicleStatus): Promise<Vehicle> {
  const data = await http<{ vehicle: Vehicle }>(`/vehicles/${vehicleId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return data.vehicle;
}

export async function assignDriver(vehicleId: string, driver: string | null): Promise<Vehicle> {
  const data = await http<{ vehicle: Vehicle }>(`/vehicles/${vehicleId}/assign`, {
    method: "PATCH",
    body: JSON.stringify({ driver }),
  });
  return data.vehicle;
}
