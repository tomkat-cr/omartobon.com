# CHANGELOG

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/) and [Keep a Changelog](http://keepachangelog.com/).



## [Unreleased] - Date
---

### Added

### Changed

### Fixed

### Removed

### Security


## [1.3.0] - 2025-09-06

### Added
- Add Apache local test environment (Docker based).
- Add attachment management to email sending.
- Add Tag for Google Analytics.

### Changed
- Update page's description, keywords and texts to enhance SEO.
- "mkdocs_transfer_site.sh" renamed to "ftp_transfer_site.sh".

### Fixed
- Fix "From" header to avoid emails to be marked as spam.

### Security
- Add referrer check to the backend API.


## [1.2.0] - 2025-06-30

### Added
- Add gallery and folder descriptions in the JSON files.
- Add strategic prompt use case page and "Lanza el Dado" demo to "prompts-estrategicos.html".

### Changed
- Galleries.js open images on a new page if it's desktop, and the same page if it's mobile.
- Images order on Image Gen AI (MedoffLine).
- Enhance page's description and texts of: avatares animados, customer success and presentaciones.
- Refactor: extract contact form logic into ContactService class and add JSON response mode

### Fixed
- Fix "#contacto" link in home.html.
- Fix the curl CURLOPT_MAIL_FROM in contact.php to match the SMTP username abd avoid emails to be marked as spam.
- Fix top lightbox gallery alignment when item name is too long.
- Fix columns count in galleries for different max-widths.
- Fix prefix "www" to the local php files using Vite php plugin.


## [1.1.0] - 2025-06-29

### Added
- Add Recaptcha v2 integration.
- Add ".env" file for environment variables reading.

### Fixed
- Fix responsive design for galleries on mobile devices.
- Fix "prompts-estrategicos" link in home.html.


## [1.0.0] - 2025-06-28

### Added
- Initial development.
