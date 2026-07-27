import { createSlice } from "@reduxjs/toolkit";

export const siteSlice = createSlice({
  name: "site",
  initialState: {
    name: "",
    description: "",
    url: "",
  },
  reducers: {
    setSite: (state, action) => {
      state.name = action.payload.name ?? state.name;
      state.description = action.payload.description ?? state.description;
      state.url = action.payload.url ?? state.url;
    },
  },
});

export const { setSite } = siteSlice.actions;
