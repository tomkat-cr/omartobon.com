# Use an official PHP image with Apache
FROM php:8.2-apache

# Install dependencies for curl
RUN apt-get update && apt-get install -y \
    libcurl4-openssl-dev

# Install PHP extensions
RUN docker-php-ext-install curl

# Enable Apache rewrite module (to handle URL rewriting)
RUN a2enmod rewrite

# Enable Apache headers module (to handle CORS requests)
RUN a2enmod headers

# Set working directory
WORKDIR /var/www/html
