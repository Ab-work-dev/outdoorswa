# Outdoors WA — Industry Ecosystem Mapping Platform

**Initial functional application** built with Next.js App Router, React, TypeScript, PostgreSQL (`pg`), Zod and Leaflet.

> Independent project prototype for evaluation by Outdoors WA. Not an official Outdoors WA production system. Illustrative seed records are clearly labelled and are **not** verified WA organisations.

## Architecture

```text
Browser (React client components)
    ├── Dashboard: summary / distributions
    ├── Activities: classification + CRUD
    ├── Organisations: provider/supplier roles + CRUD
    ├── Locations: coordinates + CRUD + map
    └── Relationships: activity ↔ organisation/location
                 ↓ HTTPS JSON
Next.js App Router route handlers
    ├── Zod input validation + parameterised SQL
    ├── Server-side administrator session check
    └── Cookie authentication / basic audit logging
                 ↓
PostgreSQL (activities, organisations, locations, relationships, audit_log)
```

Each **activity**, **organisation**, and **location** has an immutable UUID primary key and an easy-to-read generated code (ACT-00001, ORG-00001, LOC-00001). Organisations may have multiple roles. A relationship links one activity to one organisation **or** one location, with a role and evidence URL.

## Prerequisites

- Node.js 22.18+ or 24+ recommended (for Next.js 16 compatibility; use a current supported LTS)
- npm
- Docker Desktop with Compose, or an existing PostgreSQL 16+ instance

## Quick start

```bash
cp .env.example .env.local
# Edit .env.local: set a secure ADMIN_PASSWORD and SESSION_SECRET

docker compose up -d
npm install
npm run db:init
npm run db:seed  # optional illustrative records
npm run dev
```

Visit **http://localhost:3000**. Browsing data is read-only. Click **Staff sign in** and enter `ADMIN_PASSWORD` to enable editing.

**Important:** Database scripts use Node.js `--env-file=.env.local` to load credentials. Next.js also loads `.env.local` when running `npm run dev`.

### PowerShell example

```powershell
Copy-Item .env.example .env.local
# Edit your .env.local in a text editor
docker compose up -d
npm install
npm run db:init
npm run db:seed
npm run dev
```

## Features implemented in this initial version

- Responsive admin-style dashboard with counts, environment bars and sector summaries
- Activities, organisations and locations: create, read, update and delete via authenticated API routes
- Multi-role organisations (provider, supplier, training, government, land manager, etc.)
- Search, environment/category/region filtering, verification status and sources
- Relationship creation and deletion; referential integrity and duplicate prevention
- Interactive WA map from saved location coordinates using OpenStreetMap tiles
- CSV export for each core table and relationships
- PostgreSQL DDL, indexes, constraints, persistent generated codes and example data
- Basic single-administrator sign-in with signed, httpOnly, same-site, 8-hour session cookie
- Simple mutation audit log

## API

| Endpoint | Methods | Purpose |
|---|---|---|
| `/api/records/activities` | GET / POST | Browse / add activities |
| `/api/records/organisations` | GET / POST | Browse / add organisations |
| `/api/records/locations` | GET / POST | Browse / add locations |
| `/api/records/{resource}/{uuid}` | PUT / DELETE | Modify / delete records |
| `/api/relationships` | GET / POST | Browse / create activity relations |
| `/api/relationships/{uuid}` | DELETE | Delete relation |
| `/api/stats` | GET | Aggregated totals |
| `/api/export?resource=activities` | GET | CSV export (also organisations/locations/relationships) |
| `/api/auth/login` | POST | Administrator sign-in |
| `/api/auth/logout` | POST | Sign out |

Data-modifying routes require a valid administrator session and a same-origin browser request. GET routes are public in this initial prototype; change this before adding internal or personal data.

## Data model

`activities (1) → (many) relationships (many) ← (1) organisations` or `locations`.

Activity classification is an enumerated category: Recreation, Adventure & Tourism, Both, Outdoor Education, Outdoor Health. A single activity may be represented with **Both**, or split into distinct subtypes/experience variants. Environment: Land, Water, Air. Organisation roles are a text array, supporting multiple roles per organisation.

Location records are distinct from organisations. Land ownership, land management, permits, and publicly accessible sites are not assumed to be equivalent.

## Data quality and scope

- Store an authoritative source URL and verification date whenever possible.
- An item marked **Verified** is a staff assertion; the application does not independently validate the source.
- Example records intentionally represent activities and **fictional** example organisations. Do not publish them as real operators.
- WA region dropdown is intended as a starting controlled vocabulary and can be expanded.
- Lists currently return a maximum of 500 rows per entity, 1,000 relationships. Add **server-side pagination** before large-scale production use.
- CSV export is limited to 20,000 rows per request.

## Security / production readiness

This is an **initial working application**, **not an audited production system**. Before hosting for Outdoors WA:

1. Replace single shared administrator password with SSO/OIDC, named user accounts, role-based permissions, password recovery and access logging.
2. Require authentication for read and export if data is confidential; add field-level privacy controls and eliminate public contact detail leaks.
3. Add rate limiting for login, session revocation, CSRF hardening, security headers and malware-safe import validation.
4. Add automated unit/integration/end-to-end tests, CI, staging, backup/restore drills, TLS, secret management and error monitoring.
5. Replace destructive deletes with soft-delete/archive workflow, improve audit log transactions and add moderation/review queues.
6. Add pagination, indexes as usage expands, CSV/Excel imports with preview and duplicate resolution, and database migration tooling.
7. Review OpenStreetMap tile usage policies and select a supported map tile provider for anticipated traffic.
8. Have organisational IT and legal teams review hosting, personal data, accessibility and licensing.

## Known first-release limitations

- No cloud service is provisioned, so you must supply the database and hosting.
- No Excel/CSV **import** yet (export is implemented).
- No named staff accounts or granular roles beyond an administrator and anonymous read-only viewer.
- No dedicated network graph; the Relationships table provides the underlying linked data.
- No location-to-organisation relationship table yet; it can be added as an extension.
- No server-side pagination or bulk edit.
- **The supplied archive has not been installed or runtime-tested in this environment**, because npm registry access and a running PostgreSQL server were unavailable at build time. The code was checked structurally, but local testing remains required.

## Next implementation milestone

Implement named staff users and review queues; CSV import and merge; search pages with pagination; network explorer; organisation-to-location operating relationships; data enrichment and reports.
