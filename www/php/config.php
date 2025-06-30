<?php
header('Content-Type: application/json');
require_once __DIR__ . '/env_loader.php';

$siteKey = getenv('RECAPTCHA_SITE_KEY');

echo json_encode(['siteKey' => $siteKey]);
