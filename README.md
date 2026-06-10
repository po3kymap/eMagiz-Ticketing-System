# eMagiz Ticketing System — Team 04

A ticket management system for the eMagiz support team. Allows customers to create support requests and support staff to manage them.

## Tech Stack

|     Layer      |                      Technology                       |
|----------------|-------------------------------------------------------|
|     Frontend   | Vue 3, Vue Router 4, Tailwind CSS 3, Chart.js, Vite 5 |
|     Backend    |   Java 17, Jakarta EE, Jersey 3 (JAX-RS), Tomcat 10   |
|     Database   |                  PostgreSQL 15                        |
| Infrastructure |               Docker, Docker Compose                  |

## Repository Structure

```
di26-04/
├── backend/          # Java WAR application (Jersey + Tomcat)
│   └── src/app/
│       ├── java/com/emagiz/
│       │   ├── config/   # DatabaseConfig, JerseyConfig
│       │   ├── dao/      # UserDAO, TicketDAO
│       │   ├── model/    # User, Ticket
│       │   └── resource/ # REST endpoints
│       └── webapp/WEB-INF/web.xml
├── frontend/         # Vue 3 SPA (Vite)
│   └── src/
│       ├── js/       # App logic, router, API client
│       └── css/      # Tailwind, global styles, theme
├── db/
│   ├── init.sql      # DB schema (executed on first container start)
│   └── Dockerfile
└── docker-compose.yml
```

## REST API

Base URL: `http://localhost:8080/api`

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/users` | Get all users |
| `POST` | `/api/users` | Create a user |
| `GET` | `/api/tickets` | Get all tickets |
| `POST` | `/api/tickets` | Create a ticket |

## Data Models

**User** — `id`, `username`, `email`, `password`, `role`, `company`

**Ticket** — `id`, `title`, `description`, `status` (OPEN), `type` (INCIDENT), `priority` (MEDIUM), `creatorId`, `assigneeId`, `createdAt`, `updatedAt`

**AuditLog** — `id`, `ticketId`, `userId`, `action`, `createdAt`

## Running the Project

### Docker Compose (recommended)

```bash
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend API | http://localhost:8080/api |
| PostgreSQL | localhost:5434 |

### Local Development

**Frontend:**
```bash
cd frontend
npm install
npm run dev   # http://localhost:5173
```

**Backend** — build with Maven:
```bash
cd backend
mvn package
```

## Database Connection

```
Host:     localhost
Port:     5434
Database: emagiz_ticketing
```

> The DB schema is initialized automatically from `db/init.sql` on the first container start.
> If the `postgres_data` volume already exists, `init.sql` will not run again.

## Project Management

- **Trello:** [emagiz-4](https://trello.com/b/ydJlvntw/emagiz-4)
