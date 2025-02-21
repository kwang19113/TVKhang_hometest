# Full-Stack Application

This repository contains a full-stack web application that consists of three main services:
- **Frontend**: A React application built with Next.js.
- **Backend**: A Python API served using Uvicorn (likely powered by FastAPI).
- **Database**: A PostgreSQL database.

All services are containerized using Docker Compose for an easy-to-set-up development and deployment environment.

---

## Architecture Overview

### Frontend
- **Location**: `./frontend`
- **Build Context**: Uses the `Dockerfile` in the `./frontend` directory.
- **Environment**: Uses a build argument `NEXT_PUBLIC_API_URL` (default: `http://localhost:8080`) to communicate with the backend API.
- **Exposed Port**: `3000`
- **Dependency**: Waits for the backend service to start before launching.

### Backend
- **Location**: `./backend`
- **Build Context**: Uses the `Dockerfile` in the `./backend` directory.
- **Command**: Runs Uvicorn with the command:
  ```bash
  uvicorn app.main:app --host 0.0.0.0 --port 8080
### Build and Run
```bash
git clone kwang19113/TVKhang_hometest
cd TVKhang_hometest
docker-compose up
```
- **Default Address**: 127.0.0.1:3000
