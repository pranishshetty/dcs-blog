<?php
// categories.php - Handles adding, fetching, and deleting categories for cPanel
require_once __DIR__ . '/cors.php';
header("Content-Type: application/json");

$dataDir = __DIR__ . '/data/';
$catFile = $dataDir . 'categories.json';

if (!file_exists($dataDir)) {
    mkdir($dataDir, 0755, true);
}

$defaultCategories = [
    'Application',
    'Data',
    'Technology',
    'Software',
    'Architecture',
    'Cybersecurity'
];

function getCategories($file, $defaults) {
    if (!file_exists($file)) {
        file_put_contents($file, json_encode($defaults, JSON_PRETTY_PRINT));
        return $defaults;
    }
    $json = file_get_contents($file);
    return json_decode($json, true) ?: $defaults;
}

function saveCategories($file, $data) {
    file_put_contents($file, json_encode(array_values(array_unique($data)), JSON_PRETTY_PRINT));
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $cats = getCategories($catFile, $defaultCategories);
    echo json_encode(["success" => true, "categories" => $cats]);
    exit();
}

$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

if ($method === 'POST') {
    $name = trim($input['name'] ?? '');
    if (!$name) {
        echo json_encode(["success" => false, "message" => "Category name cannot be empty."]);
        exit();
    }

    $cats = getCategories($catFile, $defaultCategories);
    if (!in_array($name, $cats)) {
        $cats[] = $name;
        saveCategories($catFile, $cats);
    }

    echo json_encode(["success" => true, "categories" => $cats, "message" => "Category added."]);
    exit();
}

if ($method === 'DELETE') {
    $name = $_GET['name'] ?? ($input['name'] ?? null);
    if (!$name) {
        echo json_encode(["success" => false, "message" => "Category name required."]);
        exit();
    }

    $cats = getCategories($catFile, $defaultCategories);
    $filtered = array_values(array_filter($cats, function($c) use ($name) {
        return strtolower($c) !== strtolower($name);
    }));

    saveCategories($catFile, $filtered);
    echo json_encode(["success" => true, "categories" => $filtered, "message" => "Category deleted."]);
    exit();
}
