import { Metrics } from "@/lib/types";

function KPI({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card" role="group" aria-label={label}>
      <div className="kpiLabel">{label}</div>
      <div className="kpiValue">{value}</div>
      {sub ? <div className="kpiSub">{sub}</div> : null}
    </div>
  );
}

export default function MetricCards({ metrics }: { metrics: Metrics }) {
  return (
    <div className="kpiGrid" aria-label="Fleet metrics">
      <KPI label="Total Vehicles" value={`${metrics.total}`} />
      <KPI label="Utilization" value={`${metrics.utilization_pct}%`} sub="In ride / total" />
      <KPI label="Rides Today" value={`${metrics.total_rides_today}`} />
      <KPI label="Earnings Today" value={`$${metrics.total_earnings_today.toFixed(2)}`} />
    </div>
  );
}
