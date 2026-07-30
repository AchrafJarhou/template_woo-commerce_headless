<?php

add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/reset-password', [
        'methods'             => 'POST',
        'callback'            => 'headless_reset_password',
        'permission_callback' => '__return_true',
    ]);
});

// 1. Utiliser l'adresse "De" configurée dans WooCommerce pour TOUS les mails du site
add_filter('wp_mail_from', function ($original_email) {
    $wc_email = get_option('woocommerce_email_from_address');

    // Si l'option WooCommerce existe et n'est pas vide, on l'utilise
    return !empty($wc_email) ? $wc_email : $original_email;
});

// 2. Utiliser le nom "De" configuré dans WooCommerce
add_filter('wp_mail_from_name', function ($original_name) {
    $wc_name = get_option('woocommerce_email_from_name');

    return !empty($wc_name) ? $wc_name : get_bloginfo('name');
});

function headless_reset_password($request)
{
    $email = sanitize_email($request->get_param('email'));

    if (empty($email)) {
        return new WP_Error('missing_email', 'Email requis.', ['status' => 400]);
    }

    $user = get_user_by('email', $email);

    if (!$user) {
        return new WP_Error('user_not_found', 'Aucun compte trouvé avec cet email.', ['status' => 404]);
    }

    // Génère et envoie l'email de réinitialisation
    retrieve_password($user->user_login);

    return rest_ensure_response(['message' => 'Email de réinitialisation envoyé.']);
}
