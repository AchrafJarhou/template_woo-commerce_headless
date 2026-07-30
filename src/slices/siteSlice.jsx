import { createSlice } from "@reduxjs/toolkit";

export const siteSlice = createSlice({
name: "site",
initialState: {
name: "", description: "",
url: "",
logoUrl:"",
faviconUrl:"",
},
 reducers: {
 setSite: (state, action) => {
 state.name = action.payload.name ?? state.name;
 state.description = action.payload.description ?? state.description;
 state.url = action.payload.url ?? state.url;
 state.logoUrl = action.payload.logoUrl ?? state.logoUrl;
 state.faviconUrl = action.payload.faviconUrl ?? state.faviconUrl;
},
 },
});

export const { setSite } = siteSlice.actions;