import { createSlice, configureStore } from "@reduxjs/toolkit";

interface AppState {
  discoveryVersion: number;
}

var initialState: AppState = {
  discoveryVersion: 0,
};

const discoverySlice = createSlice({
  name: "discovery",
  initialState,
  reducers: {
    updateDiscoveryVersion: (state) => {
      state.discoveryVersion += 1;
    },
    resetDiscoveryVersion: (state) => {
      state.discoveryVersion = 0;
    },
  },
});

export const { updateDiscoveryVersion, resetDiscoveryVersion } =
  discoverySlice.actions;
export default discoverySlice.reducer;
