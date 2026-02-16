export type VehicleStatus = "available" | "in_ride" | "maintenance";

export type Vehicle = {
  id: string;
  status: VehicleStatus;
  location: string;
  driver: string | null;
  earnings_today: number;
  rides_today: number;
  updated_at: number;
};

export type Metrics = {
  total: number;
  available: number;
  in_ride: number;
  maintenance: number;
  utilization_pct: number;
  total_rides_today: number;
  total_earnings_today: number;
};
