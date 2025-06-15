-- Create sample tables for Laravel API endpoints
DROP TABLE IF EXISTS destinations CASCADE;
DROP TABLE IF EXISTS countries CASCADE;

CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(3) NOT NULL,
    currency VARCHAR(10),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE destinations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    country_id INTEGER REFERENCES countries(id),
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample data
INSERT INTO countries (name, code, currency) VALUES 
('Egypt', 'EG', 'EGP'),
('Jordan', 'JO', 'JOD'),
('Morocco', 'MA', 'MAD');

INSERT INTO destinations (name, description, country_id, is_featured) VALUES 
('Cairo', 'The capital of Egypt with ancient pyramids and rich history', 1, true),
('Petra', 'Ancient archaeological site in Jordan', 2, true),
('Marrakech', 'Imperial city in Morocco with vibrant markets', 3, false);