CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE yoga_postures (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    video_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_postures (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    posture_id INT REFERENCES yoga_postures(id),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_correct BOOLEAN
);