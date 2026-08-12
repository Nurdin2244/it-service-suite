# IT Service Suite

A single internal tool that combines the four things an IT support team actually manages day to day: help desk tickets, equipment inventory, employee onboarding/offboarding, and a user directory — all sharing one connected data layer instead of existing as separate, disconnected tools.

## Live Demo

https://github.com/Nurdin2244

Log in with any name — no real account is required, this is a front-end demo.

## Why This Project Exists

Most portfolio projects are single, isolated tools. This one is different on purpose: it's built the way a real internal IT platform works, where the pieces actually talk to each other.

- Create an onboarding record for a new hire, and that person automatically appears in the User Directory — no retyping their name anywhere else.
- Create an offboarding record, and you pick the person from a real dropdown instead of typing their name freely.
- Open a new support ticket, and the requester field is a dropdown pulled from the same directory.
- Every number on the Dashboard — open tickets, assets in use, upcoming onboarding dates — updates live the moment something changes in any other module.

That connectedness is the actual point of the project: it's a small demonstration of systems integration, not just four separate demos glued together with the same color scheme.

## Features

**Dashboard**
Live stats (open tickets, assets in use, upcoming onboarding/offboarding, total assets tracked), two bar charts built with plain HTML5 Canvas (no chart libraries), and a list of upcoming onboarding/offboarding dates.

**Tickets**
A drag-and-drop kanban board (To Do / In Progress / Resolved), with priority tags and a requester field sourced from the User Directory.

**Assets**
A searchable, filterable inventory table for tracking laptops, monitors, and other equipment, with CSV export.

**Onboarding & Offboarding**
Checklist-based tracking for new hires and departing employees, each with a different default checklist. Completing an Onboarding record automatically adds that person to the User Directory. Offboarding records let you select an existing employee instead of retyping their details.

**User Directory**
A central list of employees, each showing which assets are currently assigned to them, computed automatically from the Assets module.

**Login Screen**
A simple session-based login (name and role), used to personalize the top bar and demonstrate a real app entry flow. No backend or real authentication — this is a front-end project.

## Built With

- HTML
- CSS
- Vanilla JavaScript (no frameworks, no build step, no dependencies)
- Browser localStorage and sessionStorage for data persistence

## Run It Locally

No installation needed. Download every file into the same folder, then open `index.html` in any browser.

Files: `index.html`, `style.css`, `script.js`, `data.js`, `dashboard.js`, `tickets.js`, `assets.js`, `onboarding.js`, `users.js`, `login.js`

## How It Was Built

This project was built in five stages, each one a working, tested milestone rather than one large push:

1. **Shell** — sidebar navigation and a responsive layout with a mobile menu.
2. **Dashboard** — a shared data layer with seed data, plus live stats and Canvas charts.
3. **Core Modules** — Tickets, Assets, and Onboarding rebuilt to read and write through that shared data layer instead of standing alone.
4. **User Directory** — a real directory that Tickets and Onboarding both connect to, including automatic user creation from new-hire onboarding records.
5. **Login & Polish** — a session-based login screen, role display, and a final pass on transitions and mobile behavior.

## Notes

- All data is stored in the browser via localStorage, so it resets if you clear your browser data. There is no real backend or database.
- The login screen does not perform real authentication — it's meant to demonstrate the flow and app structure, not to be production-secure.
- This project intentionally avoids frameworks and build tools to stay simple to run and review — no `npm install` required.
