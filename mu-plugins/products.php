<?php

/*=======================================
 *  wp-json/wc/store/v1/products renvoie, pour les produits variables, une cle
 *  "variations" qui ne contient que id/attributes/permalink : ni is_in_stock
 *  ni stock_status. Le front a besoin de ces infos par variation (ex: griser
 *  un choix de taille/couleur en rupture) sans faire un appel par variation.
 *  On reexpose donc le Store API via une route custom qui enrichit chaque
 *  entree de "variations" avec ces deux champs.
 *  =============================================*/

add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/products', [
        'methods'             => 'GET',
        'callback'            => 'headless_get_products_with_variation_stock',
        'permission_callback' => '__return_true',
    ]);
});

function headless_enrich_variation_stock($product_data)
{
    // Selon le contexte, le Store API renvoie les entrees de "variations" en
    // stdClass ou en tableau associatif : on gere les deux formes.
    $variations = is_object($product_data) ? ($product_data->variations ?? null) : ($product_data['variations'] ?? null);

    if (empty($variations) || !is_array($variations)) {
        return $product_data;
    }

    $enriched = array_map(function ($variation) {
        $variation_id      = is_object($variation) ? ($variation->id ?? null) : ($variation['id'] ?? null);
        $variation_product = $variation_id ? wc_get_product($variation_id) : null;

        $is_in_stock  = $variation_product ? $variation_product->is_in_stock() : null;
        $stock_status = $variation_product ? $variation_product->get_stock_status() : null;

        if (is_object($variation)) {
            $variation->is_in_stock  = $is_in_stock;
            $variation->stock_status = $stock_status;
        } else {
            $variation['is_in_stock']  = $is_in_stock;
            $variation['stock_status'] = $stock_status;
        }

        return $variation;
    }, $variations);

    if (is_object($product_data)) {
        $product_data->variations = $enriched;
    } else {
        $product_data['variations'] = $enriched;
    }

    return $product_data;
}

function headless_get_products_with_variation_stock($request)
{
    if (!function_exists('wc_get_product')) {
        return new WP_Error('woocommerce_unavailable', 'WooCommerce est requis pour cette fonctionnalite.', ['status' => 500]);
    }

    // On relaie tel quel le Store API pour garder son filtrage/tri/pagination,
    // on ne fait qu'enrichir la reponse ensuite.
    $store_request = new WP_REST_Request('GET', '/wc/store/v1/products');
    $store_request->set_query_params($request->get_query_params());

    $store_response = rest_do_request($store_request);

    if ($store_response->is_error()) {
        $error = $store_response->as_error();
        return $error instanceof WP_Error
            ? $error
            : new WP_Error('products_fetch_failed', 'Impossible de recuperer les produits.', ['status' => 500]);
    }

    $products = array_map('headless_enrich_variation_stock', $store_response->get_data());

    $response = rest_ensure_response($products);

    // On repercute les headers de pagination du Store API, utilises par le front
    $store_headers = $store_response->get_headers();
    foreach (['X-WP-Total', 'X-WP-TotalPages'] as $header) {
        if (isset($store_headers[$header])) {
            $response->header($header, $store_headers[$header]);
        }
    }

    return $response;
}
