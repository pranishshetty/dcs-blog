<?php
// upload.php - Handles image and video uploads for cPanel
require_once __DIR__ . '/cors.php';
header("Content-Type: application/json");

$targetDir = __DIR__ . '/uploads/';

// Ensure uploads directory exists
if (!file_exists($targetDir)) {
    mkdir($targetDir, 0755, true);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
    exit();
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(["success" => false, "message" => "No file uploaded or file upload error."]);
    exit();
}

$file = $_FILES['file'];
$fileName = basename($file['name']);
$fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

// Allowed Extensions
$allowedImageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
$allowedVideoExts = ['mp4', 'webm', 'mov', 'avi', 'mkv'];

$isVideo = in_array($fileExt, $allowedVideoExts);
$isImage = in_array($fileExt, $allowedImageExts);

if (!$isVideo && !$isImage) {
    echo json_encode(["success" => false, "message" => "Unsupported file format. Please upload an image or video."]);
    exit();
}

// Generate unique filename to prevent overwriting
$uniqueName = uniqid("media_", true) . '.' . $fileExt;
$targetFilePath = $targetDir . $uniqueName;

if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
    // Determine base URL relative path for cPanel / production
    $relativeUrl = '/api/uploads/' . $uniqueName;
    echo json_encode([
        "success" => true,
        "url" => $relativeUrl,
        "filename" => $uniqueName,
        "isVideo" => $isVideo,
        "message" => "File uploaded successfully."
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to save uploaded file."]);
}
