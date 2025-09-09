# AstraAI

AI-first orchestration platform for Zoom, Jira, and Slack — powered by Google Gemini.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Prototype](https://img.shields.io/badge/Status-Prototype-orange)](https://github.com/HVVSATHWIK/AstraVerse)
[![Hackathon Project](https://img.shields.io/badge/Project-Hackathon-blue)](https://github.com/HVVSATHWIK/AstraVerse)

AstraAI is an AI-first orchestration platform built to automate workflows across Zoom, Jira, and Slack — powered by Google Gemini.

🚀 Solo hackathon prototype: AI orchestration platform automating Zoom → Jira → Slack workflows in minutes.

## Visuals

```
[Frontend (React + TS)] <-> [Backend (Supabase)] <-> [AI (Gemini API)]
     |                           |                        |
     v                           v                        v
[Integrations]              [Database/Auth]          [Prompts/Processing]
(Zoom, Slack, Jira)         (Real-time)              (Content Gen, Analysis)
```

*Architecture Diagram: Simple flow of AstraAI components.*

*Dashboard Screenshot: [Add actual screenshot here] - Shows workflow builder with drag-and-drop nodes, KPI charts, and agent status panels.*

*Demo GIF: [Add GIF here] - Zoom meeting automation in action: transcription → summary → Jira ticket → Slack post.*

Architecture diagram, dashboard screenshots, and demo GIFs will be added soon (see Roadmap).

## Quick Demo Flow

1. **Transcribe Meeting**: Zoom meeting audio processed by Gemini.
2. **Summarize & Extract**: AI pulls action items & highlights.
3. **Automate Tasks**: Jira tickets created, Slack updates sent.
4. **Track Progress**: KPI dashboards update instantly.

Cuts down meeting note-taking from 30 minutes to just 2 minutes!

## Why AstraAI?

| Feature | AstraAI | Zapier | n8n |
|---------|---------|--------|-----|
| AI-First Orchestration | ✅ Agent-based, dynamic | ❌ Basic triggers | ❌ Manual flows |
| Real-Time AI Analytics | ✅ Tailored dashboards | ❌ Limited | ❌ Limited |
| Pilot Mode (Safe Testing) | ✅ Isolation & rollback | ❌ No | ❌ No |
| Hackathon-ready | ✅ Designed for quick proof-of-concepts | ❌ No | ❌ No |
| Footprint | Light (AI-focused) | Broad (all apps) | Broad (all apps) |

This makes AstraAI ideal for AI-driven productivity gains.

## Technology Stack

<details>
<summary>Click to expand Technology Stack</summary>

- **Frontend**: React + TypeScript, Tailwind CSS, 3D effects.
- **Backend**: Supabase (DB, auth, real-time).
- **AI**: Google Gemini API (prompts, future fine-tuning).
- **Build**: Vite.
- **Deployment**: Vercel/Netlify.

</details>

## Roadmap

🎯 **Current (Hackathon Prototype)**: Core workflows, Gemini integration, Zoom/Slack/Jira.

⏳ **Limitations**: Basic security/scalability, no production polish.

🚀 **Next**: More integrations (3 months), analytics/security (6 months), production features (1 year).

## Getting Started

1. Clone: `git clone https://github.com/HVVSATHWIK/AstraVerse.git`
2. Install: `npm install`
3. Env: Copy `.env.example` to `.env` (add Supabase/Gemini keys)
4. Run: `npm run dev`
5. Open: `http://localhost:5173`

See [docs/setup.md](docs/setup.md) for details.

## About the Hackathon Build

Built solo under time constraints during a hackathon. Focuses on proof-of-concept: AI automation, integrations, and agent management. Not production-ready, but demonstrates scalable AI orchestration ideas. Contributions welcome!

*Motivation: As a developer passionate about AI productivity, I wanted to create a tool that makes advanced AI accessible without complexity.*

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT License.
