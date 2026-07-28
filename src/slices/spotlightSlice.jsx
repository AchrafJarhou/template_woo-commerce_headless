import { createSlice } from "@reduxjs/toolkit";
import { fetchSpotlightProductsThunk } from "../thunkActionsCreator/spotlightThunks";

export const spotlightSlice = createSlice({
  name: "spotlight",
  initialState: {
    list: {
      data: [],
      page: 1,
      perPage: 20,
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpotlightProductsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSpotlightProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { data, page, perPage } = action.payload;
        state.list.data = data;
        state.list.page = page;
        state.list.perPage = perPage;
      })
      .addCase(fetchSpotlightProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
