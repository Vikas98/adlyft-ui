# Adlyft UI — Advertiser Dashboard

A modern advertiser-facing dashboard for the Adlyft ad network platform, built with React + Vite + Tailwind CSS.

## Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Inter font
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP**: Axios
- **Routing**: React Router v6

## Quick Start

### Prerequisites
- Node.js 18+
- Adlyft backend running at `http://localhost:5000` (optional — falls back to demo data)

### Installation

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Demo Credentials

| Field | Value |
|-------|-------|
| Email | `demo@adlyft.com` |
| Password | `demo123` |

> If the backend is offline, logging in with demo credentials will work in demo mode with mock data.

## Backend Integration

The UI connects to the Adlyft backend at `http://localhost:5000/api`.

Clone and start the backend:
```bash
git clone https://github.com/Vikas98/adlyft-backend.git
cd adlyft-backend
npm install
cp .env.example .env
npm run seed   # Seed demo data
npm run dev    # Start on port 5000
```

Then start the frontend:
```bash
cd adlyft-ui
npm run dev    # Start on port 5173
```

## Project Structure

```
src/
├── App.jsx                    # Root with React Router
├── main.jsx                   # Entry point
├── index.css                  # Tailwind base styles
├── services/
│   └── api.js                 # Axios API client (connects to backend)
├── context/
│   └── AuthContext.jsx        # JWT auth state
├── data/
│   └── mockData.js            # Fallback mock data
├── utils/
│   ├── formatters.js          # Currency, number, date formatters
│   └── constants.js           # Nav items, statuses, categories
├── components/
│   ├── common/                # Reusable UI components
│   ├── layout/                # Sidebar, Header, Layout
│   ├── dashboard/             # Dashboard widgets
│   ├── campaigns/             # Campaign components
│   ├── publishers/            # Publisher components
│   ├── analytics/             # Chart components
│   └── billing/               # Billing components
└── pages/
    ├── Login.jsx
    ├── Dashboard.jsx
    ├── Campaigns.jsx
    ├── CreateCampaign.jsx
    ├── Publishers.jsx
    ├── Analytics.jsx
    ├── Billing.jsx
    └── Settings.jsx
```

## Features

- 🔐 JWT Authentication (with demo mode fallback)
- �� Analytics dashboard with Recharts (impressions, clicks, CTR, spend)
- 📢 Campaign management (create, filter, track)
- 🏢 Publisher discovery (filter by category, search)
- 💳 Billing & invoices
- ⚙️ Profile & API key settings
- 🌙 Demo mode banner when backend is offline

## Build

```bash
npm run build    # Production build
npm run preview  # Preview production build
```
