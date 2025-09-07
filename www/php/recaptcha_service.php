<?php
class RecaptchaService {
    protected $debug = false;

    function verify_recaptcha() {
        $result = [
            'result' => false,
            'message' => ''
        ];

        // reCAPTCHA verification
        $recaptcha_secret = getenv('RECAPTCHA_SECRET_KEY');
        if (!$recaptcha_secret) {
            $result['message'] = 'Error: reCAPTCHA secret key no configurada';
            return $result;
        }

        if (isset($_POST['g-recaptcha-response'])) {
            $recaptcha_response = $_POST['g-recaptcha-response'];
        } else {
            $result['message'] = 'Error: Por favor, complete el reCAPTCHA.';
            return $result;
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
            $result['message'] = 'Error: Verificación de reCAPTCHA fallida. Intente de nuevo.';
            return $result;
        }

        $result['result'] = true;
        return $result;
    }
}
