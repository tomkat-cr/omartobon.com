<?php
header('Content-Type: application/json');
require_once __DIR__ . '/env_loader.php';
require_once __DIR__ . '/utils.php';

// Check referrer URL
if (isAllowedReferrer()) {
    $siteKey = getenv('RECAPTCHA_SITE_KEY');
    $googleTagId = getenv('GOOGLE_TAG_ID');
    echo json_encode(['siteKey' => $siteKey, 'googleTagId' => $googleTagId]);
    exit;
}

// Return not authorized
return_not_authorized(json_encode(['siteKey' => '', 'googleTagId' => '']));
