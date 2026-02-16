import { VehicleStatus } from "@/lib/types";

export default function StatusBadge({ status }: { status: VehicleStatus }) {
  if (status === "available") {
    return (
      <span className="pill pillAvailable" aria-label="Status: Available">
        <span className="dot dotAvailable" aria-hidden="true" />
        Available
      </span>
    );
  }

  if (status === "in_ride") {
    return (
      <span className="pill pillInRide" aria-label="Status: In Ride">
        <span className="dot dotInRide" aria-hidden="true" />
        In Ride
      </span>
    );
  }

  return (
    <span className="pill pillMaint" aria-label="Status: Maintenance">
      <span className="dot dotMaint" aria-hidden="true" />
      Maintenance
    </span>
  );
}
