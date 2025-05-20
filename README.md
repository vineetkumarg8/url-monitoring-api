![Screenshot (127)](https://github.com/user-attachments/assets/abb8efbc-172e-4176-8076-3cb117e3b71a)# 🌐 URL Monitoring API

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
## Database schema
![Screenshot (120)](https://github.com/user-attachments/assets/09c30225-697a-45e2-8676-89b9a154f711)

### 1.🧑‍💼 It All Starts With a User

Meet Alex, a product engineer who wants to monitor their startup’s website uptime.
To begin, Alex needs an account in your app. So the very first thing stored is:

✅ A user
- Unique email
- Password (hashed for security)
- Automatically gets a UUID <br>
### See the users table  <br>
Why start here?<br>
Because all monitoring data must belong to someone — authentication and ownership come first.

### 2.🔗 Alex Adds URLs to Monitor

Once Alex logs in, they can submit websites to track — like https://mycoolapp.com.
Every time they submit a URL, a new record is created in:

🔍 monitored_urls
- Tied to Alex's user ID
- Stores the URL, how often it should be checked (interval), and when it was added<br>
### see monitored_urls table <br>
Why this second?<br>
Because a URL can’t exist in the system without a user who owns it. This lets you show Alex their own monitoring dashboard and enforce access control.

### 3.📈 The System Starts Monitoring

Now that the URL is saved, your backend scheduler (like cron or a background worker) begins to check the site at regular intervals (e.g., every 5 minutes).
Each time a check happens, the result is saved in:

📊 check_results<br>
- Linked to the monitored URL
- Saves the status code, is it up, response time, and timestamp<br>
### see check_results table <br>
Why this second?<br>
Because a URL can’t exist in the system without a user who owns it. This lets you show Alex their own monitoring dashboard and enforce access control.


## ⚙️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/url-monitoring-api.git
cd url-monitoring-api
```
## 2.📁 Folder Structure
```bash

url-monitoring-api/
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
│ │ └──  db.ts
│ └──index.ts # Main app entry with route mounts
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

## 🚀 Deployment (Cloudflare Workers)
### 1.Install Wrangler
```bash
npm install -g wrangler
```
### 2.Wrangler configuration
```bash
# wrangler.toml
main = "src/index.ts"
compatibility_date = "2024-09-23"
compatibility_flags = [ "nodejs_compat" ]

[build]
command = "npm run build"

[triggers]
crons = ["*/5 * * * *"]

[vars]
DATABASE_URL = "YOUR_POSTGRES_URL"
JWT_SECRET = "your_jwt_secret"
```
### 3.Deploy
```bash
 npx wrangler deploy
```

## Scheduling Logs
```bash
# wrangler.toml
[triggers]
crons = ["*/5 * * * *"]
```
- Cloudflare will trigger your Worker every 5 minutes (standard cron syntax).<br>
- Worker handle these scheduled events via the special scheduled event handler.
- ![Screenshot (140)](https://github.com/user-attachments/assets/094927be-686a-4ae9-9e76-c37eb2c795b7)

## API Testing using curl Local
### 1.Register a new user

```bash
curl -X POST https://your-worker-url/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com", "password":"mypassword"}'
```


### 2.Login and get JWT token

```bash
curl -X POST https://your-worker-url/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com", "password":"mypassword"}'
```
Use the returned JWT to authenticate subsequent requests.

### 3.Create a new monitored URL (Authenticated)
```bash
CopyEdit
curl -X POST http://localhost:3000/api/urls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{"url": "https://example.com"}'
```
### 4.Get monitored URLs (Authenticated)
```bash
CopyEdit
curl -X GET http://localhost:3000/api/urls \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```
### 5.Get check results with pagination (Authenticated)
```bash
CopyEdit
curl -X GET "http://localhost:3000/api/results?urlId=1&page=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```
## API Testing usin Postman
### 1.Register a new user

![Screenshot (127)](https://github.com/user-attachments/assets/7825a6fc-8784-4dbb-85d5-5f55ef07f99d)
choose - POST
Enter url - https://url-monitoring-api.vineetkumar12392.workers.dev/auth/register <br>
in body ,choose row<br>
enter - {"email":"test@example.com", "password":"mypassword"} <br>
click Send <br>
result - registered succesfully! <br>

### 2.Login and get JWT token

![Screenshot (127)](https://github.com/user-attachments/assets/c36342c3-bf5f-461e-a39f-31576110f02d)
only change Enter URL - https://url-monitoring-api.vineetkumar12392.workers.dev/auth/login <br>
click Send <br>
result - you will get token ex- (eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImV4cCI6MTc0NzgxMTA3N30.cAaS55_m17_5uuX_M-6jrBA76Fm23djD7GMyq45GgRE)

### 3.Create a new monitored URL(Authenticated)
![Screenshot (128)](https://github.com/user-attachments/assets/bb9c73a9-3e72-4109-b80a-82aaf51b9de5)
choose - POST
Enter Url - https://url-monitoring-api.vineetkumar12392.workers.dev/urls <br>
in authorization choose Auth Type - Bearer Token <br>
paste token <br>
in body - {"url": "https://example.com"} <br>
click Send <br>
Output - url added successfully

### 4.Get monitored URLs (Authenticated)
![Screenshot (130)](https://github.com/user-attachments/assets/21d589cb-bd8f-438c-a964-6084e13adf1f)
choose - GET <br>
click Send <br>
output - "id","userId","url","createdAt","lastCheckedAt"

### 5.Get check results with pagination (Authenticated)

![Screenshot (133)](https://github.com/user-attachments/assets/7f64c9cc-1ec4-47ff-b2ad-35b10c82afc4)
Enter url - https://url-monitoring-api.vineetkumar12392.workers.dev/result <br>
click Send <br>
output -  "page","limit","total","results"




















