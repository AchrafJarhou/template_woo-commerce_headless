import { createAsyncThunk } from "@reduxjs/toolkit";

// Produits à la une (page d'accueil) : copie de fetchProductsThunk mais
// avec son propre type d'action et son propre state, pour ne pas partager
// state.products avec le catalogue (évite les écrasements/requêtes
// redondantes en naviguant accueil <-> catalogue).
export const fetchSpotlightProductsThunk = createAsyncThunk(
  "spotlight/fetchAll",
  async (params = {}, thunkAPI) => {
    try {
      const page = params.page ? parseInt(params.page, 10) : 1;
      const perPage = params.per_page ? parseInt(params.per_page, 10) : 20;
      const minPrice =
        params.min_price !== undefined &&
        params.min_price !== null &&
        params.min_price !== ""
          ? Math.round(parseFloat(params.min_price) * 100)
          : undefined;
      const maxPrice =
        params.max_price !== undefined &&
        params.max_price !== null &&
        params.max_price !== ""
          ? Math.round(parseFloat(params.max_price) * 100)
          : undefined;
      const cleanParams = Object.entries({
        ...params,
        page,
        per_page: perPage,
        min_price: minPrice,
        max_price: maxPrice,
      }).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          acc[key] = String(value);
        }
        return acc;
      }, {});
      const queryString = new URLSearchParams(cleanParams).toString();
      const url = `${import.meta.env.VITE_API_URL}/wp-json/wc/store/v1/products?${queryString}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Impossible de récupérer les produits à la une.");
      }
      const data = await response.json();
      return { data, page, perPage };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
