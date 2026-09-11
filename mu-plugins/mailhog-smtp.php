<?php
/**
 * Mailhog SMTP Configuration
 * Configure WordPress to send emails via Mailhog (localhost:1025)
 * Mailhog Web UI: http://localhost:8025
 */

// Configure PHPMailer to use SMTP via Mailhog
add_action('phpmailer_init', function($phpmailer) {
    $phpmailer->isSMTP();
    $phpmailer->Host = 'localhost';
    $phpmailer->Port = 1025;
    $phpmailer->SMTPAuth = false; // Mailhog doesn't require auth
    $phpmailer->SMTPSecure = ''; // No encryption needed
});

// Set the "From" email and name
add_filter('wp_mail_from', function($from) {
    return 'noreply@localhost.test';
});

add_filter('wp_mail_from_name', function($name) {
    return get_option('blogname', 'Test Site');
});

// Log emails for debugging
add_action('wp_mail_failed', function($wp_error) {
    error_log('Email failed: ' . $wp_error->get_error_message());
});

// Success logging
add_filter('wp_mail', function($atts) {
    error_log('Email sent to: ' . implode(', ', (array)$atts['to']) . ' | Subject: ' . $atts['subject']);
    return $atts;
});
