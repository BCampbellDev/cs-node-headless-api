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
