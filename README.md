# CS Node Headless API

This project is a **Node.js + TypeScript backend API** that acts as a middle layer between a **headless WordPress (WPGraphQL)** backend and future frontend clients (Next.js, React, etc).

It exists as a **learning and case-study project** focused on:
- Node.js fundamentals
- Express routing & middleware
- Consuming a GraphQL API from Node
- Exposing a clean REST-style API on top of GraphQL
- Authentication handoff (Basic Auth → WPGraphQL)
- API hygiene (validation, pagination, error handling)

---

## Architecture Overview

Client  
↓  
Node.js API (Express)  
↓  
WPGraphQL (WordPress)  
↓  
WordPress Database  

This API does **not** store data itself.  
It fetches data from WordPress via GraphQL, reshapes it, enforces limits, and exposes predictable REST endpoints.

---

## Tech Stack

- Node.js 20
- TypeScript
- Express
- WPGraphQL
- dotenv
- fetch (Undici)
- WordPress Application Passwords

---

## Environment Variables

Create a `.env` file:

```env
PORT=4000
WP_GRAPHQL_URL=https://cs-wordpress-headless.lndo.site/graphql
WP_BASIC_AUTH_BASE64=base64(username:application-password)
```

Generate the auth value with:

```bash
echo -n "username:application-password" | base64
```

---

## Running the Server

```bash
npm install
npm run dev
```

Server runs at:

```
http://localhost:4000
```

---

## API Routes

### Resources

GET:
```
/api/resources
/api/resources/:id
```

Example:
```bash
curl http://localhost:4000/api/resources
```

---

### People

GET:
```
/api/people
/api/people/:id
```

---

### Groups

GET:
```
/api/groups
/api/groups/:id
```

---

## Mutations (REST → GraphQL)

### Add a Person to a Group

POST:
```
/api/groups/:groupId/people/:personId
```

Example:
```bash
curl -X POST http://localhost:4000/api/groups/16/people/12
```

Response:
```json
{
  "added": true,
  "groupIds": [16],
  "person": {
    "databaseId": 12,
    "title": "Bob Smith"
  }
}
```

---

## Middleware Concepts Demonstrated

- Centralized async error handling
- Global error middleware
- CORS handling
- Input validation
- Auth forwarding to WPGraphQL

---

## Pagination & Validation

Client input is clamped and validated before hitting WordPress.

Example helper:

```ts
clampFirst(value, fallback = 10)
```

Ensures safe numeric bounds and defaults.

---

## Case Study Goals

This project demonstrates:

- Practical Node.js backend usage
- Express routing and middleware patterns
- GraphQL consumption from Node
- Bridging CMS data into a modern API
- Real-world auth and error handling

---

## Status

Case study complete.  
Paused intentionally to avoid burnout.
