# DukaGuard

Retail Loss Prevention SaaS for Kenya

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Demo Login

- **PIN: 1234** — Owner account (Jane Wanjiku)
- **PIN: 5678** — Manager account (Peter Ochieng)  
- **PIN: 9012** — Attendant account (Mary Akinyi)

## Features

- Offline-first sales & stock ledger (IndexedDB/Dexie.js)
- PWA with service worker
- Mobile-first design (large tap targets, bottom nav)
- English/Swahili bilingual support
- PIN-based authentication
- Sales logging with product picker
- Stock management with reorder alerts
- Shift open/close with cash variance tracking
- M-Pesa statement import (CSV)
- Dashboard with stats & weekly trend charts
- Anomaly alerts with risk scores
- Multi-outlet support
- Numeric keypad for cash entry

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS
- Dexie.js (IndexedDB wrapper)
- Zustand (state management)
- Recharts (charts)
- Lucide React (icons)

## Architecture

The app uses a local-first architecture:
- All data stored in browser IndexedDB via Dexie.js
- Sync queue for pending API operations when offline
- Service worker for asset caching and offline support
- Ready to connect to Django REST API backend
