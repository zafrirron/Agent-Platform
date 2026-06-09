# Presenter Guide — Agent Platform Team Adoption

## Screen setup

**Dual monitor (ideal):**
- **Main screen** (audience sees): browser with `team-adoption.html` + your IDE for the demo
- **Second screen** (you only): this file open in your editor as speaker notes

**Single monitor:**
- Open this file on your phone or print it — the story beats are short enough to glance at

---

## Opening the deck

Open `team-adoption.html` directly in Chrome/Edge:
```
start D:\Dev\Agent-Platform\presentation\team-adoption.html
```
Navigate with **← →** arrow keys or click the dots. No server needed.

---

## Presentation flow

| Time | What's on screen | Your action |
|------|-----------------|-------------|
| 0–2 min | Slides 1–2 (title, friction) | Talk through the problem. Ask the room a question. |
| 2–5 min | Slides 3–5 (solution, lifecycle, routing) | Keep it fast — explain the model, not every feature. |
| 5–9 min | Slides 6–8 (gates, cross-IDE, your rules) | Slow down here — this is where developers get convinced. |
| 9–17 min | **Slide 9 (demo guide) stays on screen** | Alt-tab to IDE. Follow the step-by-step script on slide 9. |
| 17–19 min | Slides 10–11 (before/after, Day 1) | Fast. The demo already proved the numbers. |
| 19–22 min | Slide 12 (approval ask) | Direct ask. Read the action items aloud. |
| 22–25 min | Slide 12 stays up | Q&A. Use the objection table in STORY-PLAN.md. |

---

## The demo transition

Slide 9 is designed to stay visible while you demo. It shows the exact commands — the audience can follow along, and you have the script in front of you. Do not switch away from it until the demo is done.

Before the demo, have these pre-opened so you can alt-tab instantly:
1. A terminal at `D:\Dev\platform-demo`
2. Your IDE (Cursor or Claude Code) pointed at `D:\Dev\platform-demo` but **not yet opened** — open it live during Step 3

---

## The moment that lands hardest

The Security gate firing in Step 5 is your proof point. When you type *"Add user authentication"* and Step 5a fires without you doing anything, **pause and point it out explicitly:**

> *"I didn't ask for a security review — the platform triggered it automatically."*

That single moment is worth more than five slides of explanation.

---

## Files in this folder

| File | Purpose |
|------|---------|
| `team-adoption.html` | 12-slide presentation deck — open in browser |
| `STORY-PLAN.md` | Full story beats, talking points, demo script, objection handling |
| `PRESENTER-GUIDE.md` | This file — screen setup and timing guide |
| `agent-platform-beta.html` | Original beta overview deck (reference only) |

## Demo repo

`D:\Dev\platform-demo` — clean git repo with the bare todo-app, ready for the live install demo.
