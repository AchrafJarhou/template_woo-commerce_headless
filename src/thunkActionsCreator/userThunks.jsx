import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginThunk = createAsyncThunk(
  "user/login",
  async ({ username, password }, thunkAPI) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/wp-json/jwt-auth/v1/token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Identifiants incorrects.");
      }
      thunkAPI.dispatch(fetchCurrentCustomerThunk(data.token));
      thunkAPI.dispatch(fetchCurrentUserOrdersThunk(data.token));
      return {
        token: data.token,
        profile: {
          email: data.user_email,
          displayName: data.user_display_name,
          nicename: data.user_nicename,
        },
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const fetchCurrentUserThunk = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.token;
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/wp-json/wp/v2/users/me?context=edit`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Impossible de recuperer le profil.");
      }
      return {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        displayName: data.name,
        roles: data.roles,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const fetchCurrentCustomerThunk = createAsyncThunk(
  "user/fetchCurrentCustomer",
  async (tokenArg, thunkAPI) => {
    try {
      const token = tokenArg || thunkAPI.getState().user.token;
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/wp-json/custom/v1/customer`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || "Impossible de recuperer les infos client.",
        );
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const fetchCurrentUserOrdersThunk = createAsyncThunk(
  "user/fetchCurrentUserOrders",
  async (tokenArg, thunkAPI) => {
    try {
      const token = tokenArg || thunkAPI.getState().user.token;
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/wp-json/custom/v1/orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || "Impossible de recuperer les commandes.",
        );
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const registerThunk = createAsyncThunk(
  "user/register",
  async ({ username, email, password }, thunkAPI) => {
    try {
      // Endpoint custom a exposer cote WordPress (mu-plugin), au meme titre
      // que le CORS : WordPress ne permet pas la creation de compte anonyme
      // via son API par defaut. On attend en reponse un token, comme pour le
      // login, pour eviter un deuxieme aller-retour reseau.
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/wp-json/custom/v1/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Impossible de creer le compte.");
      }
      thunkAPI.dispatch(fetchCurrentCustomerThunk(data.token));
      thunkAPI.dispatch(fetchCurrentUserOrdersThunk(data.token));
      return {
        token: data.token,
        profile: {
          email: data.user_email,
          displayName: data.user_display_name,
          nicename: data.user_nicename,
        },
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const updateCurrentCustomerThunk = createAsyncThunk(
  "user/updateCurrentCustomer",
  async (customerData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.token;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/wp-json/custom/v1/customer`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(customerData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible de mettre à jour les informations client.",
        );
      }

      // L'API renvoie directement l'objet client complet mis à jour
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const deleteCurrentCustomerThunk = createAsyncThunk(
  "user/deleteCurrentCustomer",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.token;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/wp-json/custom/v1/customer`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible de supprimer le compte.");
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
