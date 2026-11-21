<?php

header('Content-Type: application/json');

$allowedOrigins = [
    'https://tutos-production.up.railway.app',
    'http://localhost:5173'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

header('Vary: Origin');

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
}

header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed'
    ]);
    exit;
}

require_once __DIR__ . '/../db.php';

$email = $_GET['email'] ?? '';
$mode = $_GET['mode'] ?? '';

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Invalid email address'
    ]);
    exit;
}

// Only allow these two predefined tables.
$tables = [
    'indexed' => 'users_indexed',
    'unindexed' => 'users_unindexed'
];

if (!isset($tables[$mode])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Invalid benchmark mode'
    ]);
    exit;
}

try {
    $table = $tables[$mode];

    $sql = "SELECT id, username, email, city, created_at
            FROM $table
            WHERE email = :email
            LIMIT 1";

    $stmt = $pdo->prepare($sql);

    $times = [];
    $user = null;

    // Run the same query 15 times.
    for ($i = 0; $i < 15; $i++) {
        $startTime = microtime(true);

        $stmt->bindValue(':email', trim($email), PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        $endTime = microtime(true);

        $times[] = ($endTime - $startTime) * 1000;

        $user = $result ?: null;
    }

    // Calculate median execution time.
    sort($times);

    $median = $times[7];

    echo json_encode([
        'success' => true,
        'mode' => $mode,
        'user' => $user,
        'found' => $user !== null,
        'execution_time_ms' => round($median, 3),
        'sample_count' => count($times),
        'times_ms' => array_map(
            fn($time) => round($time, 3),
            $times
        )
    ]);

} catch (PDOException $e) {
    error_log("Benchmark query failed: " . $e->getMessage());

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => 'Database query failed'
    ]);
}

