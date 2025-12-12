<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$file = 'data.json';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $input = file_get_contents('php://input');
    
    if ($input) {
        file_put_contents($file, $input);
        echo json_encode(["message" => "Дані успішно збережено"]);
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Немає даних"]);
    }

} elseif ($method === 'GET') {
    if (file_exists($file)) {
        $content = file_get_contents($file);
        echo $content;
    } else {
        echo json_encode([]);
    }
}
?>