import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";
import { AppUserProfile } from "../../models/Users/AppUserProfile";
import { UserImageListDto } from "../../models/Images/UserImageListDto";

interface AppState {
  users: AppUserProfile[];
  discoveryVersion: number;
}

var initialState: AppState = {
  users: [],
  discoveryVersion: 0,
};

const discoverySlice = createSlice({
  name: "discovery",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<AppUserProfile[]>) => {
      state.users = action.payload;
    },
    addUsers: (state, action: PayloadAction<AppUserProfile[]>) => {
      state.users.push(...action.payload);
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((_) => _.id != action.payload);
    },
    increaseDiscoveryVersion: (state) => {
      state.discoveryVersion += 1;
    },
    resetDiscoveryVersion: (state) => {
      state.discoveryVersion = 0;
    },
  },
});

export const {
  setUsers,
  addUsers,
  removeUser,
  increaseDiscoveryVersion,
  resetDiscoveryVersion,
} = discoverySlice.actions;
export default discoverySlice.reducer;
