# CS Node Headless API

This project is a **Node.js + TypeScript backend API** that acts as a gateway between external data sources and a **headless WordPress (WPGraphQL)** backend.

It exists as a **case-study / learning project** focused on:

- Node.js fundamentals
- Express routing & middleware
- Consuming REST and GraphQL APIs from Node
- Exposing a clean REST-style API
- Authentication handoff (Basic Auth → WPGraphQL)
- Data synchronization (external API → WordPress)
- API hygiene (validation, pagination, error handling)

---

## Architecture Overview

External APIs (NPS Alerts)
↓
Node.js API (Express / TypeScript)
↓
WPGraphQL (Headless WordPress)
↓
WordPress Database

This API acts as a **gateway and data pipeline**, not a database.
It fetches, normalizes, and upserts data into WordPress.

---

## Tech Stack

- Node.js 20
- TypeScript
- Express
- WPGraphQL
- graphql-request
- dotenv
- Undici (fetch)
- WordPress Application Passwords

---

## Environment Variables

Create a `.env` file:

```env
PORT=4000

# WordPress
WP_GRAPHQL_URL=https://cs-wordpress-headless.lndo.site/graphql
WP_BASIC_AUTH_BASE64=base64(username:application-password)

# National Park Service
NPS_API_KEY=your-nps-api-key
NPS_ALERTS_URL=https://developer.nps.gov/api/v1/alerts
```

---

## Running the Server

```bash
npm install
npm run dev
# or
npm run start
```

---

## NPS Alerts Sync

POST:

```
/api/alerts/sync?parkCode=cane&limit=3
```

Example:

```bash
curl -X POST "http://localhost:4000/api/alerts/sync?parkCode=cane&limit=3"
```

---

## Status

Case study complete and functional.

---

## WordPress Publish Webhooks → Laravel Dashboard

In addition to scheduled and manual syncs, this API now reacts to **real-time WordPress editorial events**.

When an **NPS Alert post is published (or status changes)** in WordPress:

1. **WordPress** triggers a webhook
2. **Node.js Gateway** receives and validates the event
3. **Node.js** forwards the event to **Laravel**
4. **Laravel Dashboard** updates the alert’s publication status

This allows the system to reflect **editorial intent**, not just raw data ingestion.

---

## Webhook Flow

```
WordPress (publish event)
        ↓
Node.js API (/webhooks/wp/nps-alert-published)
        ↓
Laravel API (/api/wp-alerts/published)
        ↓
Laravel Database / Admin Dashboard
```

---

## Node Webhook Endpoint

**Route**

```
POST /webhooks/wp/nps-alert-published
```

**Purpose**

- Receive WordPress publish events for `nps_alert` posts
- Forward publish state to Laravel
- Keep WordPress as the source of editorial truth

**Example Payload**

```json
{
  "post_id": 19,
  "nps_id": "6EF2FA11-86EE-47CA-960B-7FDAE78C05ED",
  "status": "publish",
  "title": "Park Closure: Visitor Center Closed",
  "published_at": "2026-02-05T19:42:00Z"
}
```

---

## Laravel Forwarding

Node forwards the event to Laravel using a **dedicated bearer token**:

**Environment Variables**

```env
LARAVEL_WP_PUBLISHED_URL=http://127.0.0.1:8000/api/wp-alerts/published
LARAVEL_WP_PUBLISHED_TOKEN=your-laravel-token
```

**Behavior**

- Node does not fail the webhook if Laravel is temporarily unavailable
- Failures are logged but do not block WordPress publishing
- Laravel records:
  - WordPress post ID
  - Publication status
  - Last publish timestamp

---

## Why This Exists

This separation demonstrates real-world architecture patterns:

- **WordPress** → Editorial control
- **Node.js** → Event gateway & orchestration
- **Laravel** → Admin dashboards & business logic

It mirrors how production systems handle:

- CMS-driven workflows
- Event-based integrations
- Microservice-style responsibility boundaries

---

## Summary

The Node API now supports **three data paths**:

1. **Scheduled / manual sync** (NPS → WordPress → Laravel)
2. **On-demand sync** via REST
3. **Real-time editorial events** via webhooks

This completes the Node gateway’s role as a **central integration layer** in the case study.
