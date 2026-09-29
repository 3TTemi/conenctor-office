# 🏢 Connector Office

A Minecraft-style virtual office where each character represents a connected app (Gmail, Calendar, Notion, Drive, GitHub) and debriefs you on the past day's activity.

![Voxel Office Demo](https://img.shields.io/badge/demo-hackathon-green)

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Controls

| Key | Action |
|-----|--------|
| `W` `A` `S` `D` | Move around |
| `E` | Talk to nearby character |
| `Tab` | Switch accounts (when viewing multi-account apps) |
| `Esc` | Close dialog |

## 30-Second Demo Script

1. **Start** – You spawn in the center of a blocky Minecraft-style office
2. **Walk left** (A key) toward the **red character** – that's the Gmail clerk
3. **Press E** – See a debrief: unread emails from personal, school, and work accounts
4. **Press Tab** – Cycle through the three Gmail accounts
5. **Press Esc** – Close the panel
6. **Walk right** to the **blue character** (Calendar) – see today's meetings
7. **Explore** the office: Notion (black, back-left), Drive (green, back-right), GitHub (dark, center-back)

Each character shows what happened in their app over the past 24 hours.

---

## Characters

| Character | App | Location | Accounts |
|-----------|-----|----------|----------|
| Mail Clerks | Gmail | Front-left | personal, school, professional |
| Cal | Google Calendar | Front-right | primary |
| Nori | Notion | Back-left | personal, DTI, URMC |
| Dax | Google Drive | Back-right | primary |
| Octo | GitHub | Center-back | primary |

---

## Connector Interface

The demo ships with **fixture data** – realistic fake debriefs so it runs with no API keys or secrets.

For **live data**, an external host (like Grok Bot) produces JSON that this app consumes. **The app never calls Gmail, Calendar, Notion, Drive, or GitHub APIs directly.**

### Debrief Payload Shape

```typescript
interface DebriefPayload {
  app: 'gmail' | 'calendar' | 'notion' | 'drive' | 'github';
  account: string;           // e.g., "personal", "school", "work"
  accountLabel?: string;     // Human-readable, e.g., "Personal (alex@gmail.com)"
  since: string;             // ISO timestamp – debriefs cover activity since this time
  bullets: DebriefBullet[];
  summary?: string;          // Optional one-line summary
  unreadCount?: number;      // Optional count badge
}

interface DebriefBullet {
  text: string;
  link?: string;
  timestamp?: string;        // ISO timestamp
  priority?: 'high' | 'normal' | 'low';
}
```

### How to Refresh Live Data

**Option 1: Drop a JSON file**

Place your debriefs at:
```
public/data/live-debriefs.json
```

Format:
```json
{
  "fetchedAt": "2024-01-15T10:00:00Z",
  "debriefs": [
    {
      "app": "gmail",
      "account": "personal",
      "accountLabel": "Personal",
      "since": "2024-01-14T10:00:00Z",
      "bullets": [
        { "text": "New email from Mom", "priority": "normal" }
      ]
    }
  ]
}
```

**Option 2: POST to the app**

If you add an API route (e.g., via Vite middleware or a backend), POST to `/api/debrief`:

```bash
curl -X POST http://localhost:3000/api/debrief \
  -H "Content-Type: application/json" \
  -d '{"debriefs": [...]}'
```

**Enable live mode:**

```bash
VITE_USE_LIVE_DATA=true npm run dev
```

---

## Project Structure

```
├── src/
│   ├── main.ts              # Entry point
│   ├── connector/
│   │   ├── types.ts         # Debrief payload types
│   │   └── DebriefAdapter.ts# Fixture/live data adapter
│   ├── data/
│   │   └── fixtures.ts      # Demo fixture data
│   ├── game/
│   │   ├── World.ts         # Voxel office environment
│   │   ├── Player.ts        # WASD movement
│   │   └── Character.ts     # NPC characters
│   └── ui/
│       ├── DebriefPanel.ts  # Debrief dialog
│       └── Prompt.ts        # "Press E" prompt
├── index.html
├── package.json
└── README.md
```

---

## Quick Actions (Stub)

The debrief panel includes a **Quick Actions** stub button. This is intentionally non-functional – it's a placeholder for a future pass where you could:

- Archive/reply to emails
- RSVP to calendar events  
- Comment on Notion pages
- Star Drive files
- Review GitHub PRs

The stub is clearly labeled "Coming in a future update."

---

## Tech Stack

- **Three.js** – 3D rendering with blocky voxel aesthetic
- **TypeScript** – Type-safe connector interface
- **Vite** – Fast dev server and build

No OAuth. No API secrets. No direct calls to external services.

---

## License

ISC
