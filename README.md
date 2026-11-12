# Pennywise Expense Tracker

Pennywise is a React dashboard backed by a Spring Boot REST API and a local
MySQL database. The API is the source of truth; expense records are not stored
in browser storage.

## Requirements

- Node.js 20.19+ or 22.12+
- Java 21
- Maven 3.8+
- MySQL Server 8+

## Create and configure MySQL

Connect to your local MySQL server as an administrator and create the database:

```sql
CREATE DATABASE expense_tracker
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

For this local workspace, the supplied MySQL credentials are in the ignored
`backend/src/main/resources/application-local.properties` file. It is not tracked
by Git. To use different credentials, edit that local file or override the
settings using environment variables in the same terminal as the backend.
PowerShell example:

```powershell
$env:DB_USERNAME = "your_mysql_username"
$env:DB_PASSWORD = "your_mysql_password"
```

Optionally set `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` in the same terminal
to override the local profile settings. Set `DB_URL` if MySQL is not listening
at the default `jdbc:mysql://localhost:3306/expense_tracker`. Hibernate creates
or updates the `expenses` table at startup, and MySQL keeps records across
application and browser restarts.

## Run the application

Start the backend from the `backend` folder. No credential environment variables
are needed for this local setup. The Maven wrapper downloads the pinned Maven
version on first use:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Start the frontend in a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL printed in the terminal (normally
`http://localhost:5173`). The frontend reads the API base URL from
`VITE_API_BASE_URL`; the default is `http://localhost:8080/api/expenses`.
Copy `frontend/.env.example` to `frontend/.env.local` to override it.

## REST API

All endpoints are rooted at `http://localhost:8080/api/expenses`.

| Method | Path | Purpose | Success |
| --- | --- | --- | --- |
| `POST` | `/api/expenses` | Create an expense | `201 Created` |
| `GET` | `/api/expenses` | List expenses, newest date first | `200 OK` |
| `GET` | `/api/expenses/{id}` | Get an expense | `200 OK` |
| `PUT` | `/api/expenses/{id}` | Replace an expense | `200 OK` |
| `DELETE` | `/api/expenses/{id}` | Delete an expense | `200 OK` |
| `GET` | `/api/expenses/category/{category}` | List one category | `200 OK` |

Valid categories are `Food`, `Travel`, `Shopping`, and `Other`. Create and
update requests use this JSON shape:

```json
{
  "title": "Lunch",
  "amount": 12.50,
  "category": "Food",
  "date": "2026-10-31"
}
```

Titles must be non-blank (up to 120 characters); amounts must be positive with
at most two decimal places; category and ISO `yyyy-MM-dd` date are required.
Invalid requests return `400` with a JSON error body, unknown expense IDs return
`404`, and unexpected server errors return `500`.

## Verification

Run the frontend checks:

```powershell
cd frontend
npm run lint
npm run build
```

Run backend tests and package the service:

```powershell
cd backend
.\mvnw.cmd test
```

With MySQL configured and both services running, verify the API:

```powershell
Invoke-RestMethod http://localhost:8080/api/expenses
```

Create, read, update, filter, and delete expenses in the dashboard. Refresh the
page or restart the backend to verify the records remain in MySQL.
