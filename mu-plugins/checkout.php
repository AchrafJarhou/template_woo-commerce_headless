<?php

/*=======================================
 *  Endpoint pour créer les commandes via Stripe
 *  Reçoit les adresses et les détails de paiement
 *  =============================================*/

add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/checkout', [
        'methods'             => 'POST',
        'callback'            => 'headless_create_order_from_checkout',
        'permission_callback' => '__return_true',
    ]);
});

function headless_create_order_from_checkout($request)
{
    if (!function_exists('wc_create_order')) {
        return new WP_Error('woocommerce_unavailable', 'WooCommerce est requis.', ['status' => 500]);
    }

    $params = $request->get_json_params();

    $shipping_address = isset($params['shippingAddress']) ? $params['shippingAddress'] : [];
    $billing_address = isset($params['billingAddress']) ? $params['billingAddress'] : [];
    $cart_items = isset($params['cartItems']) ? $params['cartItems'] : [];
    $payment_method_id = isset($params['paymentMethodId']) ? sanitize_text_field($params['paymentMethodId']) : '';
    $shipping_method = isset($params['shippingMethod']) ? sanitize_text_field($params['shippingMethod']) : '';

    if (empty($cart_items)) {
        return new WP_Error('empty_cart', 'Le panier est vide.', ['status' => 400]);
    }

    if (empty($shipping_address['email'])) {
        return new WP_Error('missing_email', 'Email requis.', ['status' => 400]);
    }

    $email = sanitize_email($shipping_address['email']);
    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Email invalide.', ['status' => 400]);
    }

    $order = wc_create_order();

    foreach ($cart_items as $item) {
        $product_id = isset($item['id']) ? intval($item['id']) : 0;
        $quantity = isset($item['quantity']) ? intval($item['quantity']) : 1;

        if (!$product_id) continue;

        $product = wc_get_product($product_id);
        if (!$product) continue;

        $order->add_product($product, $quantity);
    }

    if (!empty($shipping_address)) {
        $order->set_address([
            'first_name' => sanitize_text_field($shipping_address['first_name'] ?? ''),
            'last_name'  => sanitize_text_field($shipping_address['last_name'] ?? ''),
            'company'    => sanitize_text_field($shipping_address['company'] ?? ''),
            'address_1'  => sanitize_text_field($shipping_address['address_1'] ?? ''),
            'address_2'  => sanitize_text_field($shipping_address['address_2'] ?? ''),
            'city'       => sanitize_text_field($shipping_address['city'] ?? ''),
            'postcode'   => sanitize_text_field($shipping_address['postcode'] ?? ''),
            'country'    => sanitize_text_field($shipping_address['country'] ?? ''),
            'email'      => $email,
        ], 'shipping');
    }

    if (!empty($billing_address)) {
        $order->set_address([
            'first_name' => sanitize_text_field($billing_address['first_name'] ?? ''),
            'last_name'  => sanitize_text_field($billing_address['last_name'] ?? ''),
            'company'    => sanitize_text_field($billing_address['company'] ?? ''),
            'address_1'  => sanitize_text_field($billing_address['address_1'] ?? ''),
            'address_2'  => sanitize_text_field($billing_address['address_2'] ?? ''),
            'city'       => sanitize_text_field($billing_address['city'] ?? ''),
            'postcode'   => sanitize_text_field($billing_address['postcode'] ?? ''),
            'country'    => sanitize_text_field($billing_address['country'] ?? ''),
            'email'      => $email,
        ], 'billing');
    }

    $order->set_payment_method_title('Stripe');
    $order->set_payment_method('stripe');

    if (!empty($shipping_method)) {
        $order->add_shipping_method('flat_rate:1', 1);
    }

    $order->calculate_totals();
    $order->save();

    $order_id = $order->get_id();

    headless_send_order_confirmation_email($order, $email);
    headless_send_order_notification_to_admin($order);

    return rest_ensure_response([
        'success'  => true,
        'order_id' => $order_id,
        'message' => 'Commande créée avec succès',
    ]);
}

function headless_send_order_confirmation_email($order, $customer_email)
{
    $subject = 'Confirmation de votre commande n°' . $order->get_order_number();

    $body = "Bonjour,\n\n";
    $body .= "Merci pour votre commande !\n\n";
    $body .= "Numéro de commande: #" . $order->get_order_number() . "\n";
    $body .= "Date: " . $order->get_date_created()->date('d/m/Y H:i') . "\n";
    $body .= "Total: " . $order->get_formatted_order_total() . "\n\n";

    $body .= "Articles:\n";
    foreach ($order->get_items() as $item) {
        $body .= "- " . $item->get_name() . " x " . $item->get_quantity() . " = " . wc_price($item->get_total()) . "\n";
    }

    $body .= "\nNous vous remerçions de votre confiance.\n";
    $body .= "Cordialement,\nL'équipe";

    $headers = ['Content-Type: text/plain; charset=UTF-8'];

    wp_mail($customer_email, $subject, $body, $headers);
}

function headless_send_order_notification_to_admin($order)
{
    $admin_email = get_option('admin_email');
    $subject = 'Nouvelle commande reçue: #' . $order->get_order_number();

    $body = "Une nouvelle commande a été reçue.\n\n";
    $body .= "Numéro de commande: #" . $order->get_order_number() . "\n";
    $body .= "Client: " . $order->get_billing_first_name() . ' ' . $order->get_billing_last_name() . "\n";
    $body .= "Email: " . $order->get_billing_email() . "\n";
    $body .= "Total: " . $order->get_formatted_order_total() . "\n\n";

    $body .= "Afficher la commande: " . admin_url('post.php?post=' . $order->get_id() . '&action=edit') . "\n";

    $headers = ['Content-Type: text/plain; charset=UTF-8'];

    wp_mail($admin_email, $subject, $body, $headers);
}
