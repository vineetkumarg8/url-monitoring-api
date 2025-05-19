# 🌐 URL Monitoring API

A lightweight serverless API that allows users to register, manage, and monitor the health of URLs periodically using Cloudflare Workers, Hono, PostgreSQL, and Drizzle ORM.

---

## 🧰 Core Stack

- **Runtime**: Cloudflare Workers (serverless)
- **Language**: TypeScript
- **Web Framework**: [Hono](https://hono.dev/)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Drizzle ORM
- **Cron Jobs**: Cloudflare Cron Triggers

---

## 🛠️ Features

- 🔐 JWT-based User Authentication
- 🌐 CRUD operations for Monitored URLs
- 📊 Result logs for URL health checks (with pagination)
- 🕒 Background URL checks using cron
- 📦 Fully serverless and edge-ready

---

## ⚙️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/url-monitoring-api.git
cd url-monitoring-api
```
## 2.📁 Folder Structure
```bash

url-monitoring-api/
this is my folder structure - url-monitoring-api/
│
├── drizzle/
│ ├── migrations/
│ └── schema.ts
│
├── node_modules/
│
├── scripts/
│ └── createUsers.ts # Script for seeding/testing user creation
│
├── src/
│ ├── middleware/
│ ├── routes/
│ │ ├── auth.ts
│ │ ├── result.ts
│ │ └── urls.ts
│ ├── utils/
│ │ ├── db.ts
│ │ ├── jwt.ts
│ │ └── validation.ts
│ └──index.ts # Main app entry with route mounts
│ 
│
├── .env
├── drizzle.config.ts
├── package.json
├── package-lock.json
├── test-db-connection.ts
├── tsconfig.json
└── wrangler.toml
```
## 3.Install Dependencies
```bash
npm install
```

## 4. Configure Environment
- Create a .env file:
```bash
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_jwt_secret

```

## 🧱 Database Setup (Drizzle)

- Configure Drizzle

```bash
// drizzle.config.ts
export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
};
```

## Run Migrations

```bash
npx drizzle-kit push
```

## Local Dev

```bash
npm run dev
```









