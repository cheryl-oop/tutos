<?php

header('Content-Type: application/json');

echo json_encode([
    'message' => 'PHP backend is running!',
    'status' => 'success'
]);