import { createSlice } from "@reduxjs/toolkit";
import {
  loginThunk,
  registerThunk,
  fetchCurrentUserThunk,
  fetchCurrentCustomerThunk,
  fetchCurrentUserOrdersThunk,
  updateCurrentCustomerThunk,
  deleteCurrentCustomerThunk,
} from "../thunkActionsCreator/userThunks";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
    customer: null,
    orders: [],
    token:
      typeof window !== "undefined"
        ? localStorage.getItem("wc_user_token")
        : null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.profile = null;
      state.customer = null;
      state.orders = [];
      state.token = null;
      localStorage.removeItem("wc_user_token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.profile = action.payload.profile;
        localStorage.setItem("wc_user_token", action.payload.token);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.profile = action.payload.profile;
        localStorage.setItem("wc_user_token", action.payload.token);
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCurrentUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchCurrentUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCurrentCustomerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentCustomerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload;
      })
      .addCase(fetchCurrentCustomerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCurrentUserOrdersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUserOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchCurrentUserOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCurrentCustomerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCurrentCustomerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload;
      })
      .addCase(updateCurrentCustomerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteCurrentCustomerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCurrentCustomerThunk.fulfilled, (state) => {
        state.loading = false;
        // Remet tout l'état utilisateur à zéro (déconnexion automatique)
        state.token = null;
        state.profile = null;
        state.customer = null;
        state.orders = [];
        state.error = null;

        localStorage.removeItem("wc_user_token");
      })
      .addCase(deleteCurrentCustomerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
