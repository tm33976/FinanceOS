# FinanceOS — Finance Dashboard

A full-stack finance tracking app I built as part of an assignment. The goal was to build something that actually works end-to-end — not just a UI mockup or a backend with no frontend.

## What it does

- Track income and expenses across categories
- Dashboard with charts showing monthly trends and category breakdown
- Role-based access (Admin / Analyst / Viewer) — each role sees and can do different things
- Admin can create users directly from the app — no self-registration
- All records are shared across users (global ledger), not per-user isolated data

## Tech used

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth  
**Frontend:** Next.js 14 (App Router), React, Tailwind CSS, Chart.js

## Why I structured it this way

I kept controllers thin on purpose — they just call a service and send the response back. All the actual logic (DB queries, error throwing, data shaping) lives in services. Makes it easy to change one without touching the other.

For the dashboard stats I used MongoDB aggregation pipelines instead of fetching all records and crunching numbers in JavaScript. For large datasets this is significantly faster — the database is doing the heavy lifting where it should be.

## Roles and what they can do

| Action | Admin | Analyst | Viewer |
|---|---|---|---|
| View dashboard + records | ✅ | ✅ | ✅ |
| Add / edit records | ✅ | ✅ | ❌ |
| Delete records | ✅ | ❌ | ❌ |
| Manage users | ✅ | ❌ | ❌ |

## Running locally

You need Node.js 18+ and a MongoDB connection (local or Atlas).

**Backend**
```bash
cd backend
npm install
cp .env.example .env
# fill in MONGODB_URI and JWT_SECRET in .env
npm run seed    # creates demo users + 150 sample records
npm run dev     # runs on port 5000
```

**Frontend**
```bash
cd frontend
npm install
cp .env.local.example .env.local
# set NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm run dev     # runs on port 3000
```

## Demo accounts (after seeding)

```
admin@demo.com    password123   (full access)
analyst@demo.com  password123   (can add/edit records)
viewer@demo.com   password123   (read only)
```

## Things I'd improve with more time

- Add proper unit tests for the service layer — the aggregation logic especially deserves test coverage
- Export records to CSV — useful for accountants
- Real-time dashboard updates using WebSockets when someone else adds a record
- Email notifications for large transactions
- Better mobile navigation — the sidebar collapses but could be smoother

## Folder structure

```
backend/
  controllers/    route handlers, kept thin
  services/       all business logic lives here
  models/         mongoose schemas
  routes/         express routers
  middleware/     jwt auth + request validation
  scripts/        seed script for demo data

frontend/
  app/            next.js app router pages
  components/     reusable UI components
  lib/            api client, auth context, utilities
  types/          typescript interfaces
```

##  Author

👨‍💻 **Tushar Mishra**  
📧 tm3390782@gmail.com 