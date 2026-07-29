import { createAsyncThunk } from "@reduxjs/toolkit";
import { setSite } from "../slices/siteSlice";

export const fetchSiteThunk = createAsyncThunk(
  "site/fetchSite",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user?.token;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/wp-json/`, {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      });

      if (!response.ok) {
        throw new Error("Impossible de récupérer les informations du site.");
      }

      const siteData = await response.json();

      const formattedData = {
        name: siteData.name,
        description: siteData.description,
        url: siteData.url || siteData.home,
      };

      thunkAPI.dispatch(setSite(formattedData));

      return formattedData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
