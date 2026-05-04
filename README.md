# Buy a Product - Take Home Challenge Solution

This repository contains my solution for a take-home challenge implemented as a NestJS microservices system.

The solution focuses on:

- Clear service boundaries
- Event-driven integration between services
- Reusable shared libraries
- Practical developer experience (Docker, hot reload, debug)
- Strong automated testing and high coverage discipline

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Why this design](#why-this-design)
- [Why I chose the NestJS monorepo option](#why-i-chose-the-nestjs-monorepo-option)
- [Quick Start (Easiest Way)](#quick-start-easiest-way)
- [API Summary](#api-summary)
- [Tests](#tests)
- [Coverage and 100% Policy](#coverage-and-100-policy)
- [Hot Reloading](#hot-reloading)
- [Debugging (including Windows)](#debugging-including-windows)
- [AI Integration With Skills (Solution-Specific)](#ai-integration-with-skills-solution-specific)
- [Local (Non-Docker) Run (Optional)](#local-non-docker-run-optional)
- [Useful Commands](#useful-commands)

## Tech Stack

- Node.js + NestJS
- PostgreSQL (orders data)
- MongoDB (audit trail data)
- TypeORM + Mongoose
- Docker Compose
- Jest + Supertest

## Architecture Overview

The system is split into two microservices and shared libraries:

- orders-service
- audit-service
- common libraries under libs/

### 1) orders-service

Responsibilities:

- Receives order commands over HTTP
- Creates orders with an initial status
- Applies status transition rules
- Emits order status change events to the audit service

Storage:

- PostgreSQL (transactional order data)

### 2) audit-service

Responsibilities:

- Listens for order status change events via Nest TCP transport
- Persists an immutable audit log entry per event
- Exposes HTTP endpoint to retrieve audit history by order

Storage:

- MongoDB (append-friendly event/audit documents)

### 3) Shared Libraries

- libs/common
  - Cross-cutting modules (health checks, throttling, SQL/NoSQL base modules and repository abstractions)
- libs/orders-common
  - Order domain contract: status enum + event payload contract
- libs/audit-common
  - Audit transport contract (client token and TCP module wiring)

### Why this design

- Separation of concerns: order state management is isolated from audit concerns.
- Independent persistence models: each service uses the database type best suited for its workload.
- Contract-driven communication: shared libs keep both services aligned on event shape and tokens.
- Better maintainability: common infrastructure code is centralized and reused.

### Why I chose the NestJS monorepo option

I intentionally used the NestJS monorepo mode instead of multiple independent repositories.

Reasoning for this take-home:

- Shared contracts are first-class: order events, enums, and service tokens live in libs and are consumed by both services without duplication.
- Safer refactors: when a shared contract changes, TypeScript catches breakage across all apps in one place.
- Faster development loop: a single workspace, one dependency graph, one lint/test/build toolchain.
- Better consistency: same coding standards, validation patterns, and test setup across microservices.
- Challenge clarity: architecture decisions are easier to review when microservices and shared modules are visible in one codebase.

Tradeoff accepted:

- A monorepo requires discipline in module boundaries so services stay decoupled even though they live together.

## Quick Start (Easiest Way)

### Prerequisites

- Docker + Docker Compose
- Optional: Node 22 + pnpm (only needed for local non-Docker workflows)

### 1) Configure environment

Create your local environment file:

```bash
cp .env.example .env
```

### 2) Start everything

```bash
docker compose up --build
```

This starts:

- postgres on 5432
- mongodb on 27017
- orders-service HTTP on 3000
- audit-service HTTP on 3001
- audit TCP transport on 4000 (internal)

### 3) Smoke check

```bash
curl http://localhost:3000/
curl http://localhost:3001/
```

## API Summary

Both services expose interactive Swagger UI documentation where you can explore and test all endpoints directly from the browser:

- Orders Swagger UI: http://localhost:3000/api/docs
- Audit Swagger UI: http://localhost:3001/api/docs

### Orders service (http://localhost:3000)

- POST /orders
- GET /orders
- GET /orders/:id
- PUT /orders/:id/status

### Audit service (http://localhost:3001)

- GET /audit/:orderId

## Tests

This repository includes three layers of tests:

### 1) Unit tests

Coverage for:

- Controllers
- Services
- Repositories
- DTOs and entities
- Domain constants and transition rules
- Shared library abstractions/modules

Run:

```bash
pnpm test
```

Current result:

- 24/24 test suites passing
- 59/59 tests passing

### 2) E2E tests (service behavior)

Implemented suites:

- orders e2e:
  - Health endpoint
  - Orders endpoints
  - Validation behavior
  - Throttling behavior
- audit e2e:
  - Health endpoint
  - Audit retrieval endpoint
  - Throttling behavior

Run:

```bash
pnpm test:e2e:orders
pnpm test:e2e:audit
```

### 3) Integration e2e between microservices contracts

Implemented in orders e2e package:

- Verifies event emission to audit contract when:
  - an order is created
  - an order status is updated

## Coverage and 100% Policy

Run coverage:

```bash
pnpm test:cov
```

Current metrics:

- Statements: 100%
- Lines: 100%
- Functions: 100%
- Branches: 79%

Coverage collection is intentionally focused on implementation code and excludes:

- e2e test folders
- \*.spec.ts files
- bootstrap files (main.ts)
- wiring modules (\*.module.ts)

This keeps coverage centered on business and reusable logic while still validating runtime wiring through e2e suites.

## Hot Reloading

Hot reloading is already configured in Docker using bind mounts plus watch mode commands.

In docker-compose, services run with debug+watch commands:

- orders-service: pnpm start:debug orders
- audit-service: pnpm start:debug audit

When you edit files, Nest recompiles and restarts automatically inside containers.

### Linux/macOS

For best performance, run the project from your native Linux/macOS filesystem and start with:

```bash
docker compose up --build
```

### Windows (recommended)

For fast and reliable file watching, run the repo inside WSL2 filesystem.

1. Install and open Ubuntu in WSL2

```bash
wsl --install -d Ubuntu
wsl -d Ubuntu
wsl -l -v
```

2. Open Ubuntu files from Windows Explorer

```bash
explorer.exe \\\\wsl.localhost\\Ubuntu
```

3. Move/clone the project into Ubuntu filesystem

```text
\\wsl.localhost\Ubuntu\home\<your-ubuntu-user>\projects\buy-a-product
```

4. Open the project from WSL terminal

```bash
wsl -d Ubuntu
cd ~/projects/buy-a-product
code .
```

5. Validate Docker access

```bash
docker ps
```

If Docker permission fails:

```bash
sudo usermod -aG docker $USER
exit
wsl --shutdown
wsl -d Ubuntu
docker ps
```

6. Run the stack

```bash
docker compose up --build
```

## Debugging (including Windows)

Both services run in debug mode in Docker and expose inspector ports:

- orders-service: 9229
- audit-service: 9230 (mapped from container 9229)

VS Code launch configurations are provided to attach to both services:

- Debug Orders Service
- Debug Audit Service

How to debug:

1. Start stack:

```bash
docker compose up --build
```

2. In VS Code, open Run and Debug and select one of the attach configs.
3. Set breakpoints in source TypeScript files.
4. Trigger requests and inspect execution.

Windows note: if breakpoints feel inconsistent, ensure the project is opened from WSL path and the debugger is attached from that WSL-backed workspace.

## AI Integration With Skills (Solution-Specific)

This repository includes AI skill integration tailored for this solution's workflow, not generic autocomplete usage.

What is integrated:

- skills-lock.json pins the exact external skill source and hash for reproducibility
- .agents/skills/nestjs-best-practices/SKILL.md provides a rule catalog used during coding/review/refactor flows
- The skill content is aligned with this codebase priorities:
  - module boundaries
  - DI patterns
  - event-driven microservice patterns
  - testing and validation discipline

How to install the skills in this repo:

```bash
npx skills experimental_install
```

Why this matters for this challenge:

- AI assistance is constrained by explicit architectural/testability rules.
- Suggestions remain consistent with the microservice + shared-lib design used here.
- Team members get repeatable AI behavior by using the same pinned skill definitions.

## Local (Non-Docker) Run (Optional)

If you want to run directly on your machine:

```bash
pnpm install
pnpm start:orders
pnpm start:audit
```

You must provide accessible local PostgreSQL and MongoDB instances and configure .env accordingly.

## Useful Commands

```bash
pnpm build
pnpm lint
pnpm test
pnpm test:cov
pnpm test:e2e:orders
pnpm test:e2e:audit
docker compose up --build
```
