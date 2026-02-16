from __future__ import annotations
from flask import Flask, jsonify, request
from flask_cors import CORS
from dataclasses import dataclass, asdict
from typing import Optional, Dict, List
import time

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@dataclass
class Vehicle:
    id: str
    status: str  # "available" | "in_ride" | "maintenance"
    location: str
    driver: Optional[str]
    earnings_today: float
    rides_today: int
    updated_at: int

def now_ms() -> int:
    return int(time.time() * 1000)

# In-memory "DB"
VEHICLES: Dict[str, Vehicle] = {
    "VH-1001": Vehicle("VH-1001", "available", "San Francisco, CA", None, 126.50, 7, now_ms()),
    "VH-1002": Vehicle("VH-1002", "in_ride", "San Francisco, CA", "DR-9001", 312.10, 14, now_ms()),
    "VH-1003": Vehicle("VH-1003", "maintenance", "Oakland, CA", "DR-9002", 88.40, 4, now_ms()),
    "VH-1004": Vehicle("VH-1004", "available", "San Jose, CA", None, 204.00, 10, now_ms()),
}

VALID_STATUSES = {"available", "in_ride", "maintenance"}

def vehicle_to_json(v: Vehicle) -> dict:
    return asdict(v)

@app.get("/health")
def health():
    return jsonify({"ok": True})

@app.get("/vehicles")
def list_vehicles():
    vehicles = [vehicle_to_json(v) for v in VEHICLES.values()]
    # Sort by updated_at desc
    vehicles.sort(key=lambda x: x["updated_at"], reverse=True)
    return jsonify({"vehicles": vehicles})

@app.get("/metrics")
def metrics():
    vehicles = list(VEHICLES.values())
    total = len(vehicles)
    available = sum(1 for v in vehicles if v.status == "available")
    in_ride = sum(1 for v in vehicles if v.status == "in_ride")
    maintenance = sum(1 for v in vehicles if v.status == "maintenance")

    total_rides = sum(v.rides_today for v in vehicles)
    total_earnings = round(sum(v.earnings_today for v in vehicles), 2)

    utilization = 0.0 if total == 0 else round((in_ride / total) * 100.0, 1)

    return jsonify({
        "total": total,
        "available": available,
        "in_ride": in_ride,
        "maintenance": maintenance,
        "utilization_pct": utilization,
        "total_rides_today": total_rides,
        "total_earnings_today": total_earnings
    })

@app.patch("/vehicles/<vehicle_id>/status")
def update_vehicle_status(vehicle_id: str):
    v = VEHICLES.get(vehicle_id)
    if not v:
        return jsonify({"error": "Vehicle not found"}), 404

    data = request.get_json(silent=True) or {}
    status = data.get("status")

    if status not in VALID_STATUSES:
        return jsonify({"error": f"Invalid status. Must be one of {sorted(list(VALID_STATUSES))}"}), 400

    v.status = status
    v.updated_at = now_ms()
    return jsonify({"vehicle": vehicle_to_json(v)})

@app.patch("/vehicles/<vehicle_id>/assign")
def assign_driver(vehicle_id: str):
    v = VEHICLES.get(vehicle_id)
    if not v:
        return jsonify({"error": "Vehicle not found"}), 404

    data = request.get_json(silent=True) or {}
    driver = data.get("driver")

    if driver is not None and (not isinstance(driver, str) or len(driver.strip()) < 3):
        return jsonify({"error": "Driver must be a string like 'DR-1234' or null"}), 400

    v.driver = driver
    v.updated_at = now_ms()
    return jsonify({"vehicle": vehicle_to_json(v)})

if __name__ == "__main__":
    # Run: python app.py
    app.run(host="0.0.0.0", port=5001, debug=True)
