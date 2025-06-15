<?php

require_once 'vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;

$capsule = new Capsule;

$capsule->addConnection([
    'driver' => 'mysql',
    'host' => 'localhost',
    'database' => 'sahara_journeys',
    'username' => 'root',
    'password' => '',
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix' => '',
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();

try {
    // Create countries table
    Capsule::schema()->dropIfExists('countries');
    Capsule::schema()->create('countries', function ($table) {
        $table->increments('id');
        $table->string('name');
        $table->string('code', 3);
        $table->string('currency')->nullable();
        $table->timestamps();
    });

    // Create destinations table
    Capsule::schema()->dropIfExists('destinations');
    Capsule::schema()->create('destinations', function ($table) {
        $table->increments('id');
        $table->string('name');
        $table->text('description');
        $table->integer('country_id')->unsigned();
        $table->boolean('is_featured')->default(false);
        $table->timestamps();
    });

    // Insert sample data
    Capsule::table('countries')->insert([
        ['name' => 'Egypt', 'code' => 'EG', 'currency' => 'EGP', 'created_at' => now(), 'updated_at' => now()],
        ['name' => 'Jordan', 'code' => 'JO', 'currency' => 'JOD', 'created_at' => now(), 'updated_at' => now()],
        ['name' => 'Morocco', 'code' => 'MA', 'currency' => 'MAD', 'created_at' => now(), 'updated_at' => now()],
    ]);

    Capsule::table('destinations')->insert([
        [
            'name' => 'Cairo',
            'description' => 'The capital of Egypt with ancient pyramids and rich history',
            'country_id' => 1,
            'is_featured' => true,
            'created_at' => now(),
            'updated_at' => now()
        ],
        [
            'name' => 'Petra',
            'description' => 'Ancient archaeological site in Jordan',
            'country_id' => 2,
            'is_featured' => true,
            'created_at' => now(),
            'updated_at' => now()
        ],
        [
            'name' => 'Marrakech',
            'description' => 'Imperial city in Morocco with vibrant markets',
            'country_id' => 3,
            'is_featured' => false,
            'created_at' => now(),
            'updated_at' => now()
        ]
    ]);

    echo "Database setup completed successfully!\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

function now() {
    return date('Y-m-d H:i:s');
}