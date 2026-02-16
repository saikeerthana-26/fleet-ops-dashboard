# FleetOps Dashboard

A lightweight fleet management dashboard inspired by Lyft’s Fleets Tooling platform.

## 🚗 Overview

FleetOps Dashboard is a full-stack application that allows fleet operators to:

- View fleet performance metrics (utilization, rides, earnings)
- Manage vehicle availability (Available, In Ride, Maintenance)
- Assign or remove drivers from vehicles
- Monitor daily operational activity

This project simulates internal tooling used to manage vehicle fleets at scale.

---

## 🛠 Tech Stack

**Frontend**
- Next.js (App Router)
- React
- TypeScript
- Modern CSS (custom SaaS-style UI)

**Backend**
- Python
- Flask (REST API)
- In-memory data store

---

## 🏗 Architecture

- REST API design (`GET`, `PATCH`)
- Server + Client Components (Next.js)
- Typed API layer (TypeScript)
- Clean component-driven UI structure

---

## ▶️ Run Locally

### Backend
```bash
cd backend
python app.py
```

### Frontend
``` bash
cd frontend
npm install
npm run dev
```
Open: http://localhost:3000
