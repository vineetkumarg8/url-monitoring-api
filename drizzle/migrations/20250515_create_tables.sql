-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create monitored_urls table
CREATE TABLE monitored_urls (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    last_checked_at TIMESTAMP
);

-- Create check_results table
CREATE TABLE check_results (
    id SERIAL PRIMARY KEY,
    url_id INTEGER NOT NULL REFERENCES monitored_urls(id),
    status INTEGER NOT NULL,
    check_time TIMESTAMP DEFAULT NOW(),
    is_healthy BOOLEAN NOT NULL DEFAULT TRUE
);
