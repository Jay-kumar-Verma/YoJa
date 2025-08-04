-- YoJa Main Database Initialization Script
-- Creates the main application database with proper extensions and initial setup

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "btree_gist";
CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS "hstore";

-- Create additional schemas for organization
CREATE SCHEMA IF NOT EXISTS users;
CREATE SCHEMA IF NOT EXISTS asanas;
CREATE SCHEMA IF NOT EXISTS progress;
CREATE SCHEMA IF NOT EXISTS content;
CREATE SCHEMA IF NOT EXISTS notifications;
CREATE SCHEMA IF NOT EXISTS ml_models;
CREATE SCHEMA IF NOT EXISTS system;

-- Grant permissions to the application user
GRANT ALL PRIVILEGES ON SCHEMA public TO adminYoja;
GRANT ALL PRIVILEGES ON SCHEMA users TO adminYoja;
GRANT ALL PRIVILEGES ON SCHEMA asanas TO adminYoja;
GRANT ALL PRIVILEGES ON SCHEMA progress TO adminYoja;
GRANT ALL PRIVILEGES ON SCHEMA content TO adminYoja;
GRANT ALL PRIVILEGES ON SCHEMA notifications TO adminYoja;
GRANT ALL PRIVILEGES ON SCHEMA ml_models TO adminYoja;
GRANT ALL PRIVILEGES ON SCHEMA system TO adminYoja;

-- Create a function for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create initial system configuration table
CREATE TABLE IF NOT EXISTS system.app_config (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial configuration
INSERT INTO system.app_config (key, value, description) VALUES
    ('app_version', '1.0.0', 'Current application version'),
    ('database_version', '1.0.0', 'Database schema version'),
    ('maintenance_mode', 'false', 'Application maintenance mode'),
    ('max_session_duration', '3600', 'Maximum session duration in seconds'),
    ('ml_model_version', '1.0.0', 'Current ML model version')
ON CONFLICT (key) DO NOTHING;

-- Create trigger for app_config
CREATE TRIGGER update_app_config_updated_at 
    BEFORE UPDATE ON system.app_config 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_app_config_key ON system.app_config(key);

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'YoJa Main Database initialized successfully with user: adminYoja';
    RAISE NOTICE 'Schemas created: public, users, asanas, progress, content, notifications, ml_models, system';
    RAISE NOTICE 'Extensions enabled: uuid-ossp, pg_trgm, btree_gin, btree_gist, citext, hstore';
END $$;
