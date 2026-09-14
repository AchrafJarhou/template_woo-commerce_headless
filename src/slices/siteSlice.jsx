import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  siteSettings: null,
  isLoadingSiteSettings: true,
};

export const siteSlice = createSlice({
  name: "site",
  initialState,
  reducers: {
    setSite: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    setSiteSettings: (state, action) => {
      state.siteSettings = {
        heroVideo: action.payload.hero_video || null,
        siteLogo: action.payload.site_logo_custom || null,
        heroTitle: action.payload.hero_title || null,
      };
      state.isLoadingSiteSettings = false;
    },
  },
});

export const { setSite, setSiteSettings } = siteSlice.actions;
