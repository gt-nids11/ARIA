-- Run this ONCE in your Neon SQL Editor
-- Creates a restricted app user with minimal permissions

-- Create restricted user
CREATE USER aria_app WITH PASSWORD 'ChangeThisPassword123!';

-- Grant connection
GRANT CONNECT ON DATABASE aria_db TO aria_app;
GRANT USAGE ON SCHEMA public TO aria_app;

-- Grant only what the app needs
GRANT SELECT, INSERT, UPDATE, DELETE 
    ON ALL TABLES IN SCHEMA public TO aria_app;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO aria_app;

-- Auto-grant on future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO aria_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT USAGE ON SEQUENCES TO aria_app;

-- Verify setup
SELECT usename, usesuper, usecreatedb 
FROM pg_user WHERE usename = 'aria_app';
