import { createSlice } from "@reduxjs/toolkit";
import {
  fetchBlogDataThunk,
  fetchBlogPostBySlugThunk,
} from "../thunkActionsCreator/blogThunks";

const initialState = {
  posts: [],
  categories: [],
  loading: false,
  loadingMore: false,
  error: null,
  page: 1,
  hasMore: true,
  singlePost: null,
  loadingSingle: false,
  errorSingle: null,
};

export const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogDataThunk.pending, (state, action) => {
        if (action.meta.arg?.page && action.meta.arg.page > 1) {
          state.loadingMore = true;
        } else {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchBlogDataThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.page = action.payload.page;
        state.hasMore = action.payload.hasMore;

        if (action.payload.page === 1) {
          state.posts = action.payload.posts;
          state.categories = action.payload.categories;
        } else {
          state.posts = [...state.posts, ...action.payload.posts];
        }
      })
      .addCase(fetchBlogDataThunk.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.payload || action.error?.message;
      })
      // --- Nouveau : article unique par slug ---
      .addCase(fetchBlogPostBySlugThunk.pending, (state) => {
        state.loadingSingle = true;
        state.errorSingle = null;
      })
      .addCase(fetchBlogPostBySlugThunk.fulfilled, (state, action) => {
        state.loadingSingle = false;
        state.singlePost = action.payload;
      })
      .addCase(fetchBlogPostBySlugThunk.rejected, (state, action) => {
        state.loadingSingle = false;
        state.errorSingle = action.payload || action.error?.message;
      });
  },
});

export default blogSlice.reducer;