<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sahara Journeys API</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 40px; background: #f8f9fa; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; margin-bottom: 20px; }
        .status { background: #d4edda; color: #155724; padding: 15px; border-radius: 4px; margin: 20px 0; }
        .endpoints { background: #f8f9fa; padding: 20px; border-radius: 4px; margin: 20px 0; }
        .endpoint { margin: 10px 0; font-family: monospace; }
        .version { color: #6c757d; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Sahara Journeys API</h1>
        
        <div class="status">
            ✅ Laravel Backend is running successfully
        </div>
        
        <p class="version">Laravel Framework {{ app()->version() }} | PHP {{ PHP_VERSION }}</p>
        
        <div class="endpoints">
            <h3>Available API Endpoints:</h3>
            <div class="endpoint">GET /api/health - Health check</div>
            <div class="endpoint">POST /api/auth/login - User authentication</div>
            <div class="endpoint">POST /api/auth/register - User registration</div>
            <div class="endpoint">GET /api/destinations - Travel destinations</div>
            <div class="endpoint">GET /api/tours - Available tours</div>
            <div class="endpoint">GET /api/packages - Travel packages</div>
            <div class="endpoint">GET /api/bookings - Booking management</div>
        </div>
        
        <p>
            <strong>Admin Access:</strong><br>
            Email: admin@saharajourneys.com<br>
            Password: password123
        </p>
        
        <p>
            <strong>Database:</strong> MySQL (sahara_journeys)<br>
            <strong>Environment:</strong> {{ app()->environment() }}<br>
            <strong>Debug Mode:</strong> {{ config('app.debug') ? 'Enabled' : 'Disabled' }}
        </p>
    </div>
</body>
</html>