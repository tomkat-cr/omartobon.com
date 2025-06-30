<?php
/*
 * contact.php
 * 2025-06-28 | CR
 * 
 */
require_once __DIR__ . '/env_loader.php';

class Contact {
    private $referrer;
    private $debug = false;
  
    function sendResult($status) {
        // Toma la URL que llamo al script (el referrer)
        if (!$this->referrer) {
            try {
                $this->referrer = $_SERVER['HTTP_REFERER'];
            } catch (Exception $e) {
                $this->referrer = null;
            }
        }
        if (!$this->referrer || strpos($this->referrer, 'contact.php') !== false) {
            $this->referrer = '../index.html';
        }
        header("Location: $this->referrer?status=$status");
        exit;
    }
    
    function get_std_result($result, $message = '') {
        return array(
            'result' => $result,
            'message' => $message
        );
    }
    
    function get_smtp_config() {
        $smtp_host = getenv('SMTP_HOST');
        $smtp_port = getenv('SMTP_PORT');
        $smtp_username = getenv('SMTP_USERNAME');
        $smtp_password = getenv('SMTP_PASSWORD');
        if (!$smtp_host || !$smtp_port || !$smtp_username || !$smtp_password) {
            $this->sendResult('Error: variables SMTP no encontradas');
        }
        return array(
            'host' => $smtp_host,
            'port' => $smtp_port,
            'username' => $smtp_username,
            'password' => $smtp_password
        );
    }

    function send_mail_with_smtp($from, $to, $subject, $body) {
        // https://stackoverflow.com/questions/14722556/using-curl-to-send-email
        $smtp_config = $this->get_smtp_config();
        $smtp_host = 'smtps://' . $smtp_config['host'] . ':' . $smtp_config['port'];
        
        // Create mail content
        $mail_content = 'To: ' . $to . "\r\n";
        // $mail_content .= 'From: ' . $from . "\r\n";
        $mail_content .= 'From: ' . $smtp_config['username'] . "\r\n";
        $mail_content .= 'Subject: ' . $subject . "\r\n\r\n";
        $mail_content .= $body . "\r\n";
        
        // Create temporary file
        $temp_file = tempnam(sys_get_temp_dir(), 'mail');
        file_put_contents($temp_file, $mail_content);
        
        // Setup cURL options
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $smtp_host);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
        curl_setopt($ch, CURLOPT_USERPWD, $smtp_config['username'] . ':' . $smtp_config['password']);
        curl_setopt($ch, CURLOPT_MAIL_FROM, $from);
        curl_setopt($ch, CURLOPT_MAIL_RCPT, [$to]);
        curl_setopt($ch, CURLOPT_READDATA, fopen($temp_file, 'r'));
        curl_setopt($ch, CURLOPT_UPLOAD, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        // $result = curl_exec($ch);
        // $error = curl_error($ch);
        $error = '';
        $result = curl_exec($ch);
        if (curl_errno($ch)) {
            $error = 'Curl error: ' . curl_error($ch);
            $result = false;
        } else {
            $result = true;
        }

        curl_close($ch);
        unlink($temp_file); // Remove temp file
        
        return $this->get_std_result($result, $error);
    }

    function send_mail_with_pear($from, $to, $subject, $body) {
        $allowed_paths = getenv('ALLOWED_PATHS');
        $hosting_user_pear_path = getenv('HOSTING_USER_PEAR_PATH');
        if ($allowed_paths) {
            ini_set("include_path", $allowed_paths . ':' . ini_get("include_path") );
        } else {
            $this->sendResult('Error: variable ALLOWED_PATHS no encontrada');
        }
        if ($hosting_user_pear_path) {
            try {
                include($hosting_user_pear_path . '/Mail.php');
            } catch (Exception $e) {
                $status = $std_error;
                if ($this->debug) {
                    $status .= ' | Debug: ' . $e->getMessage();
                }
                $this->sendResult($status);
            }
        } else {
            $this->sendResult('Error: variable HOSTING_USER_PEAR_PATH no encontrada');
        }
        $recipients = $to;
        $headers['From']    = $from;
        $headers['To']      = $to;
        $headers['Subject'] = $subject;
        $params['sendmail_path'] = '/usr/lib/sendmail';
        $mail_object =& Mail::factory('sendmail', $params);
        $result = $mail_object->send($recipients, $headers, $body);
        return $this->get_std_result($result);
    }
    
    function send_mail_with_php($from, $to, $subject, $body) {
        $headers = 'From: ' . $from . "\nReply-To: " . $from . "\nX-Mailer: PHP/" . phpversion();
        $result = mail($to, $subject, $body, $headers);
        return $this->get_std_result($result);
    }
    
    function send_mail_with_sendgrid($from, $to, $subject, $body) {
        // https://www.twilio.com/docs/sendgrid/for-developers/sending-email/curl-examples
        
        $sendgrid_api_key = getenv('SENDGRID_API_KEY');
        if (!$sendgrid_api_key) {
            $this->sendResult('Error: variable SENDGRID_API_KEY no encontrada');
        }
    
        $sendgrid_from = getenv('SENDGRID_FROM');
        if (!$sendgrid_from) {
            $this->sendResult('Error: variable SENDGRID_FROM no encontrada');
        }
        
        $url = "https://api.sendgrid.com/v3/mail/send"; // Replace with your target URL
        $data = array(
            "personalizations" => [
                [
                    "to" => [
                        "email" => $to
                    ]
                ]
            ],
            "from" => [
                "email" => $sendgrid_from
            ],
            "subject" => $subject,
            "content" => [
                [
                    "type" => "text/plain",
                    "value" => $body
                ]
            ]
        );
    
        $json_data = json_encode($data);
       
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Authorization: Bearer ' . $sendgrid_api_key,
            'Content-Type: application/json'
        ));
        
        $error = '';
        $result = curl_exec($ch);
        if (curl_errno($ch)) {
            $error = 'Curl error [SG]: ' . curl_error($ch);
        }
        curl_close($ch);
        return $this->get_std_result($result, $error);
    }
    
    function send_message() {
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
    
        // Read env variables
        $target_email = getenv('TARGET_EMAIL');
        if (!$target_email) {
            $this->sendResult('Error: variable TARGET_EMAIL no encontrada');
        }
    
        // Receive POST data
        $name = $_POST['name'];
        $email = $_POST['email'];
        $message = $_POST['message'];
        $this->referrer = $_POST['referrer'];

        // reCAPTCHA verification
        $recaptcha_secret = getenv('RECAPTCHA_SECRET_KEY');
        if (!$recaptcha_secret) {
            $this->sendResult('Error: reCAPTCHA secret key no configurada');
        }

        if (isset($_POST['g-recaptcha-response'])) {
            $recaptcha_response = $_POST['g-recaptcha-response'];
        } else {
            $this->sendResult('Error: Por favor, complete el reCAPTCHA.');
        }

        $verify_url = 'https://www.google.com/recaptcha/api/siteverify';
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $verify_url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
            'secret' => $recaptcha_secret,
            'response' => $recaptcha_response
        ]));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);
        $response_data = json_decode($response);

        if (!$response_data->success) {
            $this->sendResult('Error: Verificación de reCAPTCHA fallida. Intente de nuevo.');
        }

    
        // Validate data
        if (empty($name) || empty($email) || empty($message)) {
            $this->sendResult('Error: Faltan datos');
        }
    
        // Sanitize data
        $name = htmlspecialchars($name);
        $email = htmlspecialchars($email);
        $message = htmlspecialchars($message);
        $this->referrer = htmlspecialchars($this->referrer);
    
        // Send email
        $to = $target_email;
        $subject = 'Nuevo mensaje de contacto: ' . $email . ' - ' . $name;
        $body = 'Mensaje enviado desde el sitio web: ' . 
                (isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'Host Unknown') . "\r\n" .
            'URL de referencia: ' . ($this->referrer ? $this->referrer : 'Referrer Unknown') . "\r\n" .
            "\r\n" .
            'Nombre: ' . $name . "\r\n" .
            'Email: ' . $email . "\r\n" .
            'Mensaje: ' . $message . "\r\n";
    
        // Send email using the selected provider
        switch ($mailProvider) {
            case 'smtp':
                $result = $this->send_mail_with_smtp($email, $to, $subject, $body);
                break;
            case 'sendgrid':
                $result = $this->send_mail_with_sendgrid($email, $to, $subject, $body);
                break;
            case 'pear':
                $result = $this->send_mail_with_pear($email, $to, $subject, $body);
                break;
            default:
                $result = $this->send_mail_with_php($email, $to, $subject, $body);
                break;
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
