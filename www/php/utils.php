<?php

function getDebugflag() {
    return false;
}

// Check if referrer is allowed
function isAllowedReferrer($referrer = null) {
    if (is_null($referrer)) {
        $referrer = $_SERVER['HTTP_REFERER'] ?? '';
        if (empty($referrer)) {
            return false;
        }
    }
    $allowedReferrersString = getenv('ALLOWED_REFERRERS') ?: '';
    $allowedReferrers = explode(',', $allowedReferrersString);
    foreach ($allowedReferrers as $allowedReferrer) {
        // Check if referrer starts with allowed referrer
        if (strpos($referrer, $allowedReferrer) === 0) {
            return true;
        }
    }
    return false;
}

// Return not authorized
function return_not_authorized($message = 'Not authorized') {
    http_response_code(401);
    echo $message;
    exit;
}

function debugVarDump($var) {
    if (is_null($var)) {
        return;
    }
    echo "\n";
    var_dump($var);
    echo "\n";
}