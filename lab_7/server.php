<?php
header("Content-Type: application/json");
$filename = 'data.json';

// Отримання даних з потоку
$input = json_decode(file_get_contents('php://input'), true);
$action = $_GET['action'] ?? '';

// Читання існуючих даних
$data = file_exists($filename) ? json_decode(file_get_contents($filename), true) : [];
if (!is_array($data)) $data = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($action === 'save_immediate') {
        // Миттєве збереження (Спосіб 1)
        $record = [
            'id' => $input['id'],
            'msg' => $input['msg'],
            'time' => $input['time'], // час клієнта
            'server_time' => microtime(true) * 1000,
            'mode' => 'immediate'
        ];
        $data[] = $record;
    } elseif ($action === 'save_batch') {
        // Пакетне збереження (Спосіб 2)
        foreach ($input as $item) {
            $item['server_time'] = microtime(true) * 1000;
            $item['mode'] = 'batch';
            $data[] = $item;
        }
    }
    file_put_contents($filename, json_encode($data));
    echo json_encode(['status' => 'success']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($action === 'get') {
        echo json_encode($data);
    } elseif ($action === 'clear') {
        file_put_contents($filename, json_encode([]));
        echo json_encode(['status' => 'cleared']);
    }
    exit;
}
?>