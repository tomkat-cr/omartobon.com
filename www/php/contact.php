<?php
/*
 * contact.php
 * 2025-06-28 | CR
 * 
 */
require_once __DIR__ . '/env_loader.php';
require_once __DIR__ . '/utils.php';
require_once __DIR__ . '/mail_service.php';
require_once __DIR__ . '/recaptcha_service.php';

class Contact extends MailService {
    function __construct() {
        parent::__construct();
    }
    
    function send_message() {
        if (!isAllowedReferrer()) {
            return_not_authorized('No autorizado');
        }

        $mailProvider = getenv('MAIL_PROVIDER');
        if (!$mailProvider) {
            $mailProvider = 'smtp';
        }
    
        $std_error = 'Error al enviar el email. Por favor, intente de nuevo o contáctenos directamente al teléfono que se encuentra al pie de la página.';
        $std_success = 'Email enviado correctamente. Gracias por contactarnos. Responderemos lo mas pronto posible.';
    
        if ($this->debug) {
            error_reporting(E_ALL);
            ini_set('display_errors', 1);
        }

        $send_type = $_POST['send_type'] ?? 'contact';
    
        // Receive POST data
        $name = $_POST['name'];
        $email = $_POST['email'];
        $message = $_POST['message'];
        $attachments = $this->get_attachments();

        $this->referrer = $_POST['referrer'];

        // reCAPTCHA verification
        $recaptcha_result = (new RecaptchaService())->verify_recaptcha();
        if ($this->debug) {
            debugVarDump($recaptcha_result);
        }
        if (!$recaptcha_result['result']) {
            $this->sendResult($recaptcha_result['message']);
        }
    
        // Validate data
        if (empty($name) || empty($email) || empty($message)) {
            $this->sendResult('Error: Faltan datos');
        }
    
        // Sanitize data
        $name = htmlspecialchars($name);
        $email = htmlspecialchars($email);
        $message = htmlspecialchars($message);
    
        $target_email = getenv('TARGET_EMAIL');
        $target_name = getenv('TARGET_NAME');
        if (!$target_email) {
            $this->sendResult('Error: TARGET_EMAIL no encontrada');
        }
        if (!$target_name) {
            $this->sendResult('Error: TARGET_NAME no encontrada');
        }
    
        $cc = null;
    
        $this->referrer = htmlspecialchars($this->referrer);

        switch ($send_type) {
            case 'contact':
                // Contact form
                $from = ['email' => $email, 'name' => $name];
                $to = ['email' => $target_email, 'name' => $target_name];
                $subject = 'Nuevo mensaje de contacto: ' . $email . ' - ' . $name;
                $body = 'Mensaje enviado desde el sitio web: ' . 
                        (isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'Host Unknown') . "\r\n" .
                    'URL de referencia: ' . ($this->referrer ? $this->referrer : 'Referrer Unknown') . "\r\n" .
                    "\r\n" .
                    'Nombre: ' . $name . "\r\n" .
                    'Email: ' . $email . "\r\n" .
                    'Mensaje: ' . $message . "\r\n";
                break;

            case 'send_content':
                $from = ['email' => $target_email, 'name' => $target_name]; 
                $to = ['email' => $email, 'name' => $name];
                $cc = ['email' => $target_email, 'name' => $target_name];
                $subject = $_POST['subject'] ?? 'Lo prometido...';
                $subject = htmlspecialchars($subject);
                $body = $_POST['body'] ?? $subject;
                $body = htmlspecialchars($body);
                break;
        }

        $result = $this->send_mail($mailProvider, $from, $to, $cc, $subject, $body, $attachments);
        if ($this->debug) {
            debugVarDump($result);
        }
    
        if ($result['result']) {
            $status = $std_success;
        } else {
            $status = $std_error;
        }
        if ($this->debug) {
            $status .= ' | Debug: ' . $to . ' | ' . $mailProvider . ' | Result Msg: ' . $result['message'];
        }
    
        // Carga la página de inicio con el status
        $this->sendResult($status);
    }
}

(new Contact())->send_message();
