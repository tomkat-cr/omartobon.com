const loadRecaptcha = (siteKey) => {
    if (siteKey) {
        const recaptchaContainer = document.getElementById('recaptcha-container');

        // const recaptchaDataSitekeyElement = document.getElementById('recaptcha-data-sitekey');
        // if (recaptchaDataSitekeyElement) {
        //     recaptchaDataSitekeyElement.setAttribute('data-sitekey', siteKey);
        // } else {
        //     console.error('reCAPTCHA data-sitekey element not found.');
        //     if(recaptchaContainer) {
        //         recaptchaContainer.innerHTML = '<p class="g-recaptcha-error">reCAPTCHA could not be loaded [3].</p>';
        //     } else {
        //         console.error('reCAPTCHA container not found.');
        //     }
        //     return;
        // }

        window.onloadRecaptchaCallback = function() {
            grecaptcha.render(recaptchaContainer, {
                'sitekey' : siteKey
            });
        };

        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js?onload=onloadRecaptchaCallback&render=explicit';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    } else {
        console.error('reCAPTCHA site key not found.');
        const container = document.getElementById('recaptcha-container');
        if(container) container.innerHTML = '<p class="g-recaptcha-error">reCAPTCHA could not be loaded [1].</p>';
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Check if recaptcha key was alredy loaded in localStorage
    const siteKey = localStorage.getItem('rsk');
    if (siteKey) {
        loadRecaptcha(siteKey);
    } else {
        // Fetch recaptcha key from config.php, load it and save it in localStorage
        fetch('php/config.php')
            .then(response => response.json())
            .then(data => {
                loadRecaptcha(data.siteKey);
                localStorage.setItem('rsk', data.siteKey);
            })
            .catch(error => {
                console.error('Error fetching reCAPTCHA config:', error);
                const container = document.getElementById('recaptcha-container');
                if(container) container.innerHTML = '<p class="g-recaptcha-error">reCAPTCHA could not be loaded [2].</p>';
            });
    }
});
