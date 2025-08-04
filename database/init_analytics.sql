-- YoJa Analytics Database Initialization Script
-- Creates the analytics database for reporting and business intelligence

-- Enable required PostgreSQL extensions for analytics
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "btree_gist";
CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS "hstore";
CREATE EXTENSION IF NOT EXISTS "tablefunc";

-- Create schemas for analytics organization
CREATE SCHEMA IF NOT EXISTS analytics;
CREATE SCHEMA IF NOT EXISTS reporting;
CREATE SCHEMA IF NOT EXISTS metrics;
CREATE SCHEMA IF NOT EXISTS dashboards;
CREATE SCHEMA IF NOT EXISTS etl;

-- Grant permissions to the application user
GRANT ALL PRIVILEGES ON SCHEMA public TO adminYoja;
GRANT ALL PRIVILEGES ON SCHEMA analytics TO adminYoja;
GRANT ALL PRIVILEGES ON SCHEMA reporting TO adminYoja;
GRANT ALL PRIVILEGES ON SCHEMA metrics TO adminYoja;
GRANT ALL PRIVILEGES ON SCHEMA dashboards TO adminYoja;
GRANT ALL PRIVILEGES ON SCHEMA etl TO adminYoja;

-- Create a function for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create initial analytics configuration table
CREATE TABLE IF NOT EXISTS analytics.config (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial analytics configuration
INSERT INTO analytics.config (key, value, description) VALUES
    ('retention_days', '365', 'Data retention period in days'),
    ('aggregation_interval', '3600', 'Data aggregation interval in seconds'),
    ('auto_cleanup', 'true', 'Enable automatic data cleanup'),
    ('export_enabled', 'true', 'Enable data export functionality'),
    ('real_time_processing', 'true', 'Enable real-time analytics processing')
ON CONFLICT (key) DO NOTHING;

-- Create trigger for analytics config
CREATE TRIGGER update_analytics_config_updated_at 
    BEFORE UPDATE ON analytics.config 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create initial metrics tracking table
CREATE TABLE IF NOT EXISTS metrics.system_health (
    id SERIAL PRIMARY KEY,
    metric_name VARCHAR(255) NOT NULL,
    metric_value NUMERIC,
    metric_unit VARCHAR(50),
    service_name VARCHAR(100),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'
);

-- Create partitioned table for high-volume analytics data
CREATE TABLE IF NOT EXISTS analytics.user_events (
    id BIGSERIAL,
    user_id INTEGER NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB DEFAULT '{}',
    session_id VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE (timestamp);

-- Create partitions for the current and next month
DO $$
DECLARE
    start_date DATE;
    end_date DATE;
    partition_name TEXT;
BEGIN
    -- Current month partition
    start_date := DATE_TRUNC('month', CURRENT_DATE);
    end_date := start_date + INTERVAL '1 month';
    partition_name := 'user_events_' || TO_CHAR(start_date, 'YYYY_MM');
    
    EXECUTE format('CREATE TABLE IF NOT EXISTS analytics.%I PARTITION OF analytics.user_events 
                    FOR VALUES FROM (%L) TO (%L)', 
                    partition_name, start_date, end_date);
    
    -- Next month partition
    start_date := end_date;
    end_date := start_date + INTERVAL '1 month';
    partition_name := 'user_events_' || TO_CHAR(start_date, 'YYYY_MM');
    
    EXECUTE format('CREATE TABLE IF NOT EXISTS analytics.%I PARTITION OF analytics.user_events 
                    FOR VALUES FROM (%L) TO (%L)', 
                    partition_name, start_date, end_date);
END $$;

-- Create indexes for better analytics performance
CREATE INDEX IF NOT EXISTS idx_user_events_user_id ON analytics.user_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_events_event_type ON analytics.user_events(event_type);
CREATE INDEX IF NOT EXISTS idx_user_events_timestamp ON analytics.user_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_events_session_id ON analytics.user_events(session_id);
CREATE INDEX IF NOT EXISTS idx_system_health_metric_name ON metrics.system_health(metric_name);
CREATE INDEX IF NOT EXISTS idx_system_health_timestamp ON metrics.system_health(timestamp);
CREATE INDEX IF NOT EXISTS idx_system_health_service ON metrics.system_health(service_name);

-- Create materialized view for daily user statistics
CREATE MATERIALIZED VIEW IF NOT EXISTS reporting.daily_user_stats AS
SELECT 
    DATE(timestamp) as date,
    COUNT(DISTINCT user_id) as active_users,
    COUNT(*) as total_events,
    COUNT(DISTINCT session_id) as total_sessions
FROM analytics.user_events
WHERE timestamp >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(timestamp)
ORDER BY date DESC;

-- Create refresh function for materialized views
CREATE OR REPLACE FUNCTION refresh_reporting_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW reporting.daily_user_stats;
    -- Add more materialized views here as needed
    RAISE NOTICE 'Reporting views refreshed at %', CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'YoJa Analytics Database initialized successfully with user: adminYoja';
    RAISE NOTICE 'Schemas created: analytics, reporting, metrics, dashboards, etl';
    RAISE NOTICE 'Partitioned tables created for high-volume data';
    RAISE NOTICE 'Materialized views created for reporting';
END $$;
