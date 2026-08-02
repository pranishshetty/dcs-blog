<?php
// backup.php - Creates a complete downloadable backup ZIP of all articles and uploaded photos
require_once __DIR__ . '/cors.php';

if (!class_exists('ZipArchive')) {
    header("Content-Type: application/json");
    echo json_encode(["success" => false, "message" => "ZIP extension not enabled on PHP server."]);
    exit();
}

$zip = new ZipArchive();
$zipFileName = 'dcs_blog_backup_' . date('Y-m-d_H-i-s') . '.zip';
$zipPath = sys_get_temp_dir() . '/' . $zipFileName;

if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) === TRUE) {
    // 1. Include Data Files
    $dataDir = __DIR__ . '/data/';
    if (file_exists($dataDir)) {
        $files = scandir($dataDir);
        foreach ($files as $file) {
            if ($file !== '.' && $file !== '..') {
                $zip->addFile($dataDir . $file, 'data/' . $file);
            }
        }
    }

    // 2. Include Uploaded Media
    $uploadsDir = __DIR__ . '/uploads/';
    if (file_exists($uploadsDir)) {
        $files = scandir($uploadsDir);
        foreach ($files as $file) {
            if ($file !== '.' && $file !== '..') {
                $zip->addFile($uploadsDir . $file, 'uploads/' . $file);
            }
        }
    }

    $zip->close();

    // Send headers for file download
    header('Content-Type: application/zip');
    header('Content-Disposition: attachment; filename="' . $zipFileName . '"');
    header('Content-Length: ' . filesize($zipPath));
    readfile($zipPath);
    unlink($zipPath);
    exit();
} else {
    header("Content-Type: application/json");
    echo json_encode(["success" => false, "message" => "Failed to create backup archive."]);
    exit();
}
