# Use an official PHP image with Apache
FROM php:8.2-apache

# Install dependencies for curl
# Install PHP extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
    libcurl4-openssl-dev \
    && docker-php-ext-install curl \
    && rm -rf /var/lib/apt/lists/*

# Enable Apache rewrite module (to handle URL rewriting)
# Enable Apache headers module (to handle CORS requests)
RUN a2enmod rewrite headers

# Set working directory
WORKDIR /var/www/html
