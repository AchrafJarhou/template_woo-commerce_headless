import { createSlice } from "@reduxjs/toolkit";
import { fetchPageThunk } from "../thunkActionsCreator/pagesThunks";

export const pagesSlice = createSlice({
  name: "pages",
  initialState: {
    items: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPageThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPageThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Indexé sur le slug demandé, pas sur celui renvoyé : en cas de repli
        // linguistique les deux diffèrent, et le lecteur interroge le premier.
        const { key, page, isFallback } = action.payload;
        if (key && page) {
          state.items[key] = { page, isFallback };
        }
      })
      .addCase(fetchPageThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      });
  },
});

export default pagesSlice.reducer;
