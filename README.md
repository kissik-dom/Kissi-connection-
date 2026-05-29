# 👑 Royal Kingdom Connection

The official diplomatic video conferencing platform of **The Royal Kissi Kingdom**.

Connect with dignitaries, host council meetings, and conduct royal ceremonies with sovereign-grade security and elegance.

## Features

- 🏰 **Meeting Rooms** — Create diplomatic, council, public, and private rooms with unique join links
- 🌍 **Diplomatic Connect** — Schedule meetings with agenda management, recording toggle, and multiple meeting types
- 📹 **Video Conferencing** — HD video calls with camera/mic controls, screen sharing, and virtual backgrounds
- 🎭 **Royal Virtual Backgrounds** — Throne Room, Council Chamber, Royal Garden, Diplomatic Hall, and Ceremony Hall
- 🛡️ **Admin Panel** — Full management of rooms, meetings, and recordings
- 📊 **Dashboard** — Real-time stats, upcoming meetings, active rooms, and quick actions
- 🔐 **Authentication** — Secure signup/login with email and password

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **UI:** Tailwind CSS v4 + shadcn/ui
- **Backend:** Convex (real-time database & serverless functions)
- **Auth:** Convex Auth with password-based authentication
- **Hosting:** Vercel (frontend) + Convex Cloud (backend)
- **Routing:** React Router v7

## Design System

| Color | Hex | Usage |
|-------|-----|-------|
| Royal Navy | `#0a1628` | Primary backgrounds, text |
| Royal Gold | `#a08030` | Accents, highlights, branding |
| Royal Cream | `#f5f0e8` | Page backgrounds |
| Burgundy | `#6b1d2a` | Council badges |
| Emerald | `#1a6b4a` | Success states, public badges |

Light and dark modes supported.

## Getting Started

### Prerequisites
- [Bun](https://bun.sh/) or [Node.js](https://nodejs.org/) 18+
- A [Convex](https://convex.dev/) account

### Setup

```bash
# Install dependencies
bun install

# Set up Convex (creates a new project and generates types)
bunx convex dev --once

# Start development server
bun run dev
```

### Environment Variables

Create a `.env.local` file:

```
CONVEX_DEPLOYMENT=your-convex-deployment-url
VITE_CONVEX_URL=your-convex-url
```

### Build & Deploy

```bash
# Build for production
bun run build

# Preview build
bun run preview
```

For Vercel deployment, the `vercel.json` is pre-configured with SPA routing rewrites.

## Kingdom Motto

*Omnividens, Omnipotens, Omniaeternus*

---

© 2026 The Royal Kissi Kingdom
