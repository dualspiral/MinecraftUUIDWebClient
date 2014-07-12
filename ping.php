<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if (!isset($_POST['name']) || preg_match("/^[a-zA-Z0-9_]{1,16}$/", $_POST['name']) != 1) {
    header("HTTP/1.1 400 Bad Request");
    die();
}

$url = 'https://api.mojang.com/profiles/minecraft';
$ch = curl_init($url); 
   $headers = array(
    'Content-Type: application/json'
    );
   
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POSTFIELDS, '[ "' . $_POST['name'] . '" ]');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
 
$response = curl_exec($ch);
$http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if (strpos($http_status, '200') === false) {
    if (preg_match("/4[\d]{2}/", $http_status)) {
        header("HTTP/1.1 400 Bad Request");
    } else {
        header("HTTP/1.1 500 Internal Server Error");
    }
    
    die();
}

header('Content-Type: application/json');
echo $response;