# Pennywise frontend

This React application uses Vite and Axios to display and manage expenses through
the Spring Boot API. It does not store expense records in browser storage.

## Run locally

From this directory:

```powershell
npm install
npm run dev
```

The development server normally runs at `http://localhost:5173`. The API base
URL defaults to `http://localhost:8080/api/expenses`; copy `.env.example` to
`.env.local` to override it.

See the repository [README](../README.md) for MySQL setup, backend startup, and
REST endpoint details.

## Checks

```powershell
npm run lint
npm run build
```
