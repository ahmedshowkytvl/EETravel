<?php

// Complete API test for Laravel backend
echo "Testing Sahara Journeys Laravel Backend API...\n\n";

// Test health endpoint
echo "1. Health Check:\n";
$health = file_get_contents('http://localhost:8000/api/health');
if ($health) {
    echo "✅ Health endpoint working\n";
    echo $health . "\n\n";
} else {
    echo "❌ Health endpoint failed\n\n";
}

// Test destinations endpoint
echo "2. Destinations API:\n";
$destinations = file_get_contents('http://localhost:8000/api/destinations');
if ($destinations) {
    echo "✅ Destinations endpoint working\n";
    $data = json_decode($destinations, true);
    if (is_array($data)) {
        echo "Found " . count($data) . " destinations\n";
        foreach ($data as $dest) {
            echo "- " . $dest['name'] . " (" . $dest['country']['name'] . ")\n";
        }
    }
    echo "\n";
} else {
    echo "❌ Destinations endpoint failed\n\n";
}

// Test database connection
echo "3. Database Connection Test:\n";
try {
    $pdo = new PDO($_ENV['DATABASE_URL']);
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM destinations");
    $result = $stmt->fetch();
    echo "✅ Database connected - " . $result['count'] . " destinations found\n\n";
} catch (Exception $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n\n";
}

echo "Laravel Backend API test completed.\n";