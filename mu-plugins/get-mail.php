<?php
add_filter('rest_index', function ($response) {
    $data = $response->get_data();

    // On injecte les infos WooCommerce dans la réponse globale
    $data['store_email'] = get_option('woocommerce_email_from_address');
    $data['store_name']  = get_option('woocommerce_email_from_name');

    $response->set_data($data);
    return $response;
});
