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



