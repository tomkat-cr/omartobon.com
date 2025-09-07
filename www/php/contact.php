<?php
/*
 * contact.php
 * 2025-06-28 | CR
 * 
 */
require_once __DIR__ . '/contact_service.php';
$response_mode = $_POST['response_mode'] ?? 'json';
(new ContactService($response_mode))->send_message();
