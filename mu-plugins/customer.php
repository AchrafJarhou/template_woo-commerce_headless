<?php

/*=======================================
 *  Meme probleme que pour /orders : wp-json/wc/v3/customers exige les cles
 *  API WooCommerce reservees aux admins. On expose une route custom,
 *  utilisable avec le JWT du user, qui renvoie les donnees WooCommerce
 *  (facturation/livraison) du client actuellement connecte uniquement.
 *  =============================================*/

add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/customer', [
        'methods'             => 'GET',
        'callback'            => 'headless_get_current_customer',
        'permission_callback' => function () {
            return is_user_logged_in();
        },
    ]);
});
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/customer', [
        'methods'             => 'PUT',
        'callback'            => 'headless_update_current_customer',
        'permission_callback' => function () {
            return is_user_logged_in();
        },
    ]);
});

add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/customer', [
        'methods'             => 'DELETE',
        'callback'            => 'headless_delete_current_customer',
        'permission_callback' => function () {
            return is_user_logged_in();
        },
    ]);
});

function headless_get_current_customer($request)
{
    if (!class_exists('WC_Customer')) {
        return new WP_Error('woocommerce_unavailable', 'WooCommerce est requis pour cette fonctionnalite.', ['status' => 500]);
    }

    $user_id  = get_current_user_id();
    $customer = new WC_Customer($user_id);

    return rest_ensure_response([
        'billing'        => [
            'firstName' => $customer->get_billing_first_name(),
            'lastName'  => $customer->get_billing_last_name(),
            'company'   => $customer->get_billing_company(),
            'address1'  => $customer->get_billing_address_1(),
            'address2'  => $customer->get_billing_address_2(),
            'city'      => $customer->get_billing_city(),
            'state'     => $customer->get_billing_state(),
            'postcode'  => $customer->get_billing_postcode(),
            'country'   => $customer->get_billing_country(),
            'phone'     => $customer->get_billing_phone(),
        ],
        'shipping'       => [
            'firstName' => $customer->get_shipping_first_name(),
            'lastName'  => $customer->get_shipping_last_name(),
            'company'   => $customer->get_shipping_company(),
            'address1'  => $customer->get_shipping_address_1(),
            'address2'  => $customer->get_shipping_address_2(),
            'city'      => $customer->get_shipping_city(),
            'state'     => $customer->get_shipping_state(),
            'postcode'  => $customer->get_shipping_postcode(),
            'country'   => $customer->get_shipping_country(),
        ],
        'ordersCount'    => function_exists('wc_get_customer_order_count') ? wc_get_customer_order_count($user_id) : null,
        'totalSpent'     => function_exists('wc_get_customer_total_spent') ? wc_get_customer_total_spent($user_id) : null,
    ]);
}


function headless_update_current_customer($request)
{
    if (!class_exists('WC_Customer')) {
        return new WP_Error('woocommerce_unavailable', 'WooCommerce est requis pour cette fonctionnalité.', ['status' => 500]);
    }

    $user_id  = get_current_user_id();
    $customer = new WC_Customer($user_id);
    $params   = $request->get_json_params();

    // 1. Mise à jour des champs Billing (si envoyés)
    if (isset($params['billing']) && is_array($params['billing'])) {
        $b = $params['billing'];

        if (array_key_exists('firstName', $b)) $customer->set_billing_first_name(sanitize_text_field($b['firstName']));
        if (array_key_exists('lastName', $b))  $customer->set_billing_last_name(sanitize_text_field($b['lastName']));
        if (array_key_exists('company', $b))   $customer->set_billing_company(sanitize_text_field($b['company']));
        if (array_key_exists('address1', $b))  $customer->set_billing_address_1(sanitize_text_field($b['address1']));
        if (array_key_exists('address2', $b))  $customer->set_billing_address_2(sanitize_text_field($b['address2']));
        if (array_key_exists('city', $b))      $customer->set_billing_city(sanitize_text_field($b['city']));
        if (array_key_exists('state', $b))     $customer->set_billing_state(sanitize_text_field($b['state']));
        if (array_key_exists('postcode', $b))  $customer->set_billing_postcode(sanitize_text_field($b['postcode']));
        if (array_key_exists('country', $b))   $customer->set_billing_country(sanitize_text_field($b['country']));
        if (array_key_exists('phone', $b))     $customer->set_billing_phone(sanitize_text_field($b['phone']));
    }

    // 2. Mise à jour des champs Shipping (si envoyés)
    if (isset($params['shipping']) && is_array($params['shipping'])) {
        $s = $params['shipping'];

        if (array_key_exists('firstName', $s)) $customer->set_shipping_first_name(sanitize_text_field($s['firstName']));
        if (array_key_exists('lastName', $s))  $customer->set_shipping_last_name(sanitize_text_field($s['lastName']));
        if (array_key_exists('company', $s))   $customer->set_shipping_company(sanitize_text_field($s['company']));
        if (array_key_exists('address1', $s))  $customer->set_shipping_address_1(sanitize_text_field($s['address1']));
        if (array_key_exists('address2', $s))  $customer->set_shipping_address_2(sanitize_text_field($s['address2']));
        if (array_key_exists('city', $s))      $customer->set_shipping_city(sanitize_text_field($s['city']));
        if (array_key_exists('state', $s))     $customer->set_shipping_state(sanitize_text_field($s['state']));
        if (array_key_exists('postcode', $s))  $customer->set_shipping_postcode(sanitize_text_field($s['postcode']));
        if (array_key_exists('country', $s))   $customer->set_shipping_country(sanitize_text_field($s['country']));
        if (array_key_exists('phone', $s))     $customer->set_shipping_phone(sanitize_text_field($s['phone']));
    }

    // Persistance des modifications en BDD
    $customer->save();

    // On réutilise la fonction GET pour retourner le profil immédiatement mis à jour
    return headless_get_current_customer($request);
}


function headless_delete_current_customer($request)
{
    if (!class_exists('WooCommerce')) {
        return new WP_Error('woocommerce_unavailable', 'WooCommerce est requis pour cette fonctionnalité.', ['status' => 500]);
    }

    // Requis pour pouvoir utiliser la fonction wp_delete_user() dans l'API REST
    require_once ABSPATH . 'wp-admin/includes/user.php';

    $user_id = get_current_user_id();

    if (!$user_id) {
        return new WP_Error('unauthorized', 'Utilisateur non identifié.', ['status' => 401]);
    }

    // 1. Récupération et suppression définitive de toutes les commandes WooCommerce du client
    $orders = wc_get_orders([
        'customer_id' => $user_id,
        'limit'       => -1, // Récupère TOUTES les commandes
    ]);

    foreach ($orders as $order) {
        // true = suppression définitive (contourne la corbeille WooCommerce)
        $order->delete(true);
    }

    // 2. Suppression du compte utilisateur WordPress
    $deleted = wp_delete_user($user_id);

    if (!$deleted) {
        return new WP_Error('delete_failed', 'Impossible de supprimer le compte utilisateur.', ['status' => 500]);
    }

    return rest_ensure_response([
        'success' => true,
        'message' => 'Le compte utilisateur et toutes ses commandes ont été supprimés définitivement.',
    ]);
}
