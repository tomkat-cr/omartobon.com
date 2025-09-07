<?php
/*
 * contact.php
 * 2025-06-28 | CR
 * 
 */
require_once __DIR__ . '/env_loader.php';
require_once __DIR__ . '/utils.php';

class MailService {
    protected $referrer;
    protected $debug = false;
    protected $boundary_string = 'MULTIPART-MIXED-BOUNDARY';

    function __construct() {
        $this->debug = getDebugflag();
    }

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

    function send_mail_with_smtp($from, $to, $cc, $subject, $body, $attachments = []) {
        // https://stackoverflow.com/questions/14722556/using-curl-to-send-email
        $smtp_config = $this->get_smtp_config();
        $smtp_host = 'smtps://' . $smtp_config['host'] . ':' . $smtp_config['port'];
        
        // Create mail content

        $mail_content = 'To: ' . $to['email'] . "\r\n";
        $mail_rcpt = [$to['email']];

        if (!is_null($cc)) {
            $mail_content .= 'Cc: ' . $cc['email'] . "\r\n";
            $mail_rcpt[] = $cc['email'];
        }

        $mail_content .= 'From: ' . $from['name'] . ' <' . $smtp_config['username'] . '>' . "\r\n";

        $mail_content .= 'Subject: ' . $subject . "\r\n";

        $mail_content .= 'MIME-Version: 1.0' . "\r\n";
        $mail_content .= 'Content-Type: multipart/mixed; boundary="' . $this->boundary_string . '"' . "\r\n";
        $mail_content .= "\r\n";

        $mail_content .= '--' . $this->boundary_string . "\r\n";
        $mail_content .= "Content-Type: text/plain; charset=\"UTF-8\"" . "\r\n";
        $mail_content .= "Content-Transfer-Encoding: 8bit" . "\r\n";
        // $mail_content .= "\r\n";
        $mail_content .= $body;

        if ($attachments) {
            $mail_content .= $this->convert_attachments_to_string($attachments);
        }

        $mail_content .= "\r\n";
        $mail_content .= '--' . $this->boundary_string . '--';
        $mail_content .= "\r\n";

        // Create temporary file
        $temp_file = tempnam(sys_get_temp_dir(), 'mail');
        file_put_contents($temp_file, $mail_content);
        
        // Setup cURL options
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $smtp_host);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
        curl_setopt($ch, CURLOPT_USERPWD, $smtp_config['username'] . ':' . $smtp_config['password']);
        curl_setopt($ch, CURLOPT_MAIL_FROM, $smtp_config['username']);
        curl_setopt($ch, CURLOPT_MAIL_RCPT, $mail_rcpt);
        curl_setopt($ch, CURLOPT_READDATA, fopen($temp_file, 'r'));
        curl_setopt($ch, CURLOPT_UPLOAD, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
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

    function send_mail_with_pear($from, $to, $cc, $subject, $body, $attachments = []) {
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
        if ($cc) {
            $headers['Cc'] = $cc;
        }
        $headers['Subject'] = $subject;
        $params['sendmail_path'] = '/usr/lib/sendmail';
        $mail_object =& Mail::factory('sendmail', $params);
        if ($attachments) {
            $result = $mail_object->send($recipients, $headers, $body, $attachments);
        } else {
            $result = $mail_object->send($recipients, $headers, $body);
        }
        return $this->get_std_result($result);
    }
    
    function send_mail_with_php($from, $to, $cc, $subject, $body, $attachments = []) {
        $headers = 'From: ' . $from . "\nReply-To: " . $from . "\nX-Mailer: PHP/" . phpversion();
        if ($cc) {
            $headers .= "\nCc: " . $cc;
        }
        $result = mail($to, $subject, $body, $headers);
        return $this->get_std_result($result);
    }
    
    function send_mail_with_sendgrid($from, $to, $cc, $subject, $body, $attachments = []) {
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
                    ],
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
        if ($cc) {
            $data['personalizations'][0]['cc'] = [
                "email" => $cc
            ];
        }
    
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
    
    function get_attachments($attachment_names = ['attachment']) {
        $attachments = [];
        foreach ($attachment_names as $attachment_name) {
            if (!isset($_FILES[$attachment_name])) {
                continue;
            }
            $attachments[] = [
                'name' => $_FILES[$attachment_name]['name'],
                'type' => $_FILES[$attachment_name]['type'],
                'tmp_name' => $_FILES[$attachment_name]['tmp_name'],
                'error' => $_FILES[$attachment_name]['error'],
                'size' => $_FILES[$attachment_name]['size']
            ];
        }
        return $attachments;
    }
    
    function convert_attachments_to_string($attachments) {
        /*
            https://stackoverflow.com/questions/44728855/curl-send-html-email-with-embedded-image-and-attachment/44728856#44728856
        
            --MULTIPART-MIXED-BOUNDARY
            Content-Type: image/png
            Content-Transfer-Encoding: base64
            Content-Disposition: inline
            Content-Id: <admin.png>
            iVBORw0KGgoAAAANSUhEUgAAAIAAAACgCAIAAABL8POqAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA
            B3RJTUUH4AQNDwEVouBdqAAAG2xJREFUeNrtfX9oHFe25jdDBU5BG25BG7pABhXEkDJjSIsYIs1m
            WbfJA8ubhcjjgdiTQNJOYCInj0RKYGIl8CbyPF4iZSCxEkgsB5LIgWQlL2Pcfow3bdgw0mMzox6e
            ....


            --MULTIPART-MIXED-BOUNDARY
            Content-Type: text/plain
            Content-Transfer-Encoding: base64
            Content-Disposition: inline; filename=log.txt
            c29tZSBsb2cgaW4gYSB0eHQgZmlsZSB0byBhdHRhY2ggdG8gdGhlIG1haWwK


            --MULTIPART-MIXED-BOUNDARY--
        */
        if (count($attachments) == 0) {
            return '';
        }
        $attachments_string = '';
        foreach ($attachments as $attachment) {
            $attachments_string .= "\r\n";
            $attachments_string .= '--' . $this->boundary_string . "\r\n";
            $attachments_string .= 'Content-Type: ' . $attachment['type'] . "\r\n";
            $attachments_string .= "Content-Transfer-Encoding: base64\r\n";
            $attachments_string .= 'Content-Disposition: attachment; filename="' . $attachment['name'] . "\"\r\n";
            $attachments_string .= chunk_split(base64_encode(file_get_contents($attachment['tmp_name']))) . "\r\n";
        }
        return $attachments_string;
    }

    function send_mail($mailProvider, $from, $to, $cc, $subject, $body, $attachments = []) {
        switch ($mailProvider) {
            case 'smtp':
                $result = $this->send_mail_with_smtp($from, $to, $cc, $subject, $body, $attachments);
                break;
            case 'sendgrid':
                $result = $this->send_mail_with_sendgrid($from, $to, $cc, $subject, $body, $attachments);
                break;
            case 'pear':
                $result = $this->send_mail_with_pear($from, $to, $cc, $subject, $body, $attachments);
                break;
            default:
                $result = $this->send_mail_with_php($from, $to, $cc, $subject, $body, $attachments);
                break;
        }
        $result['provider'] = $mailProvider;
        if ($this->debug) {
            debugVarDump($result);
        }
        return $result;
    }
}
