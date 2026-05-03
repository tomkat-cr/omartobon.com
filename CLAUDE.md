# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Portfolio/service website for Omar Tobón's creative studio **OTO VISUAL FLOW** (omartobon.com). Five service areas: Customer Success, AI Image Creation, PowerPoint/Canva Presentations, Strategic Prompts, and Animated Avatars. Hosting only supports HTML, JavaScript, and PHP — no server-side frameworks.

## Commands

```bash
# Development
make install          # Install npm dependencies
make run-dev          # Run Vite dev server (sources .env, port 3000)

# Local Apache/PHP testing (Docker)
make run              # Start Docker container (PHP 8.2-Apache on port 8080)
make stop             # Stop Docker container
make restart          # Restart Docker container
make logs-f           # Follow container logs
make init-config      # Initialize .htaccess for dev/prod

# Deployment
make publish          # Deploy via FTP (uses .env credentials)
make publish-cicd     # Deploy via FTP in CI/CD mode
```

Copy `.env.example` to `.env` and fill in FTP credentials and `PHP_BINARY_PATH` before first run.

## Architecture

**SPA with dynamic HTML fragment loading** — `www/index.html` is the shell; `www/js/app.js` fetches `.html` fragment files and injects them into `#content-placeholder` based on client-side routes. There is no build step required for the PHP backend.

**Frontend (Vite root: `www/`)**
- `www/js/app.js` — client-side router, maps routes to HTML fragments or anchor scrolls
- `www/js/galleries.js` — renders gallery grids from JSON data files
- `www/js/script.js` — shared UI behavior (navigation, animations)
- `www/data/*.json` — gallery data (ai_avatars.json, presentations.json, ai_image_generation.json)

**Backend (PHP)**
- `www/php/contact.php` — form submission endpoint; delegates to `ContactService`
- `www/php/config.php` — returns JSON with Google Tag ID and reCAPTCHA site key
- `www/php/contact_service.php` → `mail_service.php` → `recaptcha_service.php` — layered service classes
- All PHP endpoints validate the HTTP referrer via `isAllowedReferrer()` before processing

**Local vs. prod `.htaccess`** — two versions managed in `local_apache/config/`. `make init-config` and `make restore-htaccess` swap between them. The Docker container mounts `www/` directly (no build needed for PHP testing).

**Vite** only bundles the frontend assets. The `vite-plugin-php` dependency is currently commented out in `vite.config.js` — PHP files are served directly by Apache/Docker, not by Vite.

## Key Conventions

- Gallery resources are declared in `www/data/*.json` with a `resources_type` field (`"video"` or `"image"`) and a `resources` array. New gallery items go in the JSON, not in HTML.
- The `.htaccess` handles URL rewriting for the SPA — all non-file requests redirect to `index.html`.
- Environment variables for the PHP backend (SMTP, reCAPTCHA secret key, allowed referrers) live in `www/.env` (not committed), loaded by `www/php/env_loader.php`.
- FTP credentials for deployment live in the root `.env`, consumed by `scripts/ftp_transfer_site.sh`.
- Fonts: Montserrat. Color palette: blues, purples, greens, and pinks on dark backgrounds; white footer.
