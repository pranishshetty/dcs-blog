<?php
// posts.php - Handles CRUD for blog posts on cPanel
require_once __DIR__ . '/cors.php';
header("Content-Type: application/json");

$dataDir = __DIR__ . '/data/';
$postsFile = $dataDir . 'posts.json';

if (!file_exists($dataDir)) {
    mkdir($dataDir, 0755, true);
}

$defaultPosts = [
    [
        'id' => 'post-1',
        'title' => 'How to build an Application with modern Technology',
        'slug' => 'how-to-build-an-application-with-modern-technology',
        'author' => 'Admin',
        'authorAvatar' => '',
        'categories' => ['Application', 'Data'],
        'tags' => ['React', 'Technology', 'Software'],
        'date' => '04 Apr, 2026',
        'published' => true,
        'views' => 142,
        'coverImage' => '/dcs_logo.png',
        'excerpt' => 'Modern application engineering requires a blend of high-performance rendering, secure authentication, and resilient state management.',
        'content' => '<h2>The Shift Towards Modern Web Architectures</h2><p>Modern application engineering requires a blend of high-performance rendering, secure authentication, and resilient state management. As user expectations rise, modular designs with sleek aesthetics and robust backends become paramount.</p>'
    ]
];

// Function to load posts
function getPosts($file, $defaults) {
    if (!file_exists($file)) {
        file_put_contents($file, json_encode($defaults, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        return $defaults;
    }
    $json = file_get_contents($file);
    return json_decode($json, true) ?: $defaults;
}

// Function to save posts
function savePosts($file, $data) {
    file_put_contents($file, json_encode(array_values($data), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $posts = getPosts($postsFile, $defaultPosts);
    echo json_encode(["success" => true, "posts" => $posts]);
    exit();
}

$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

if ($method === 'POST') {
    $posts = getPosts($postsFile, $defaultPosts);
    
    // Check if updating existing or adding new
    if (isset($input['id'])) {
        $existingIndex = -1;
        foreach ($posts as $idx => $p) {
            if ($p['id'] === $input['id']) {
                $existingIndex = $idx;
                break;
            }
        }
        
        if ($existingIndex !== -1) {
            // Update
            $posts[$existingIndex] = array_merge($posts[$existingIndex], $input);
            savePosts($postsFile, $posts);
            echo json_encode(["success" => true, "post" => $posts[$existingIndex], "message" => "Post updated."]);
            exit();
        }
    }
    
    // Create new post
    $newId = isset($input['id']) ? $input['id'] : 'post-' . time();
    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $input['title'] ?? 'untitled')));
    
    $newPost = array_merge([
        'id' => $newId,
        'title' => 'Untitled',
        'slug' => $slug,
        'author' => 'Admin',
        'authorAvatar' => '',
        'categories' => ['General'],
        'tags' => [],
        'date' => date('d M, Y'),
        'published' => true,
        'views' => 0,
        'coverImage' => '',
        'excerpt' => '',
        'content' => ''
    ], $input);

    array_unshift($posts, $newPost);
    savePosts($postsFile, $posts);

    echo json_encode(["success" => true, "post" => $newPost, "message" => "Post created."]);
    exit();
}

if ($method === 'DELETE') {
    $postId = $_GET['id'] ?? ($input['id'] ?? null);
    if (!$postId) {
        echo json_encode(["success" => false, "message" => "Post ID missing."]);
        exit();
    }

    $posts = getPosts($postsFile, $defaultPosts);
    $filtered = array_values(array_filter($posts, function($p) use ($postId) {
        return $p['id'] !== $postId;
    }));

    savePosts($postsFile, $filtered);
    echo json_encode(["success" => true, "message" => "Post deleted."]);
    exit();
}
