<?php

header('Content-Type: application/json');

require_once __DIR__ . '/../config.php';

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Only GET requests are allowed']);
    exit;
}

// Get the email from the URL
$email = $_GET['email'] ?? '';

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Please provide a valid email']);
    exit;
}

try {
    // Prepare the SQL query
    $sql = "SELECT id, username, email, city, created_at
            FROM users
            WHERE email = :email";

    $stmt = $pdo->prepare($sql);

    // Start measuring
    $startTime = microtime(true);

    // Execute the query
    $stmt->execute([
        'email' => $email
    ]);

    $user = $stmt->fetch();

    // Stop measuring
    $endTime = microtime(true);

    $executionTime = ($endTime - $startTime) * 1000;

    // Return the result
    echo json_encode([
        'success' => true,
        'user' => $user ?: null,
        'execution_time_ms' => round($executionTime, 3),
        'found' => $user !== false
    ]);

} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => 'Database query failed'
    ]);
}
