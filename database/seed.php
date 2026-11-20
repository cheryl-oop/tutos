// The seed script is used to populate a lot of users in the database!

<?php

//reuse of PDO connection
require_once __DIR__ . '/../backend/config.php';

$numberOfUsers = 100000;
$batchSize = 1000;

$cities = [
    'Brussels',
    'Antwerp',
    'Ghent',
    'Bruges',
    'Leuven',
    'Amsterdam',
    'Rotterdam',
    'Paris',
    'Berlin',
    'London',
    'Madrid',
    'Lisbon',
    'New York',
    'Tokyo',
    'Sydney',
    'Toronto',
    'Copenhagen',
    'Oslo',
    'Rome',
    'Cotonou'
];

// Empties table so that we start with clean dataset (agressive tho, dont use it on real data lol!).
// PDO = PHP Dataset Object
$pdo->exec("TRUNCATE TABLE users");

// Insert users (properties and its values)
$sql = "INSERT INTO users (username, email, city, created_at)
        VALUES (:username, :email, :city, :created_at)";

//prepare statements
$stmt = $pdo->prepare($sql);

//measure how long the seeding process takes.
$startTime = microtime(true);

//loop
for ($i = 1; $i <= $numberOfUsers; $i++) {

    if ($i % $batchSize === 1) {
        $pdo->beginTransaction();
    }

    $username = 'user_' . str_pad($i, 6, '0', STR_PAD_LEFT);
    $email = $username . '@example.com';
    $city = $cities[array_rand($cities)];

    $randomTimestamp = mt_rand(
        strtotime('2020-01-01'),
        strtotime('2026-01-01')
    );

    $createdAt = date('Y-m-d H:i:s', $randomTimestamp);

    $stmt->execute([
        'username' => $username,
        'email' => $email,
        'city' => $city,
        'created_at' => $createdAt
    ]);
// Each batch of 1000 inserts commited together (no individual insert, can overhead!)
    if ($i % $batchSize === 0) {
        $pdo->commit();
        echo "Inserted $i users...\n";
    }
}

$endTime = microtime(true);

$totalTime = round($endTime - $startTime, 2);

echo "\nFinished!\n";
echo "Total users: $numberOfUsers\n";
echo "Execution time: {$totalTime} seconds\n";