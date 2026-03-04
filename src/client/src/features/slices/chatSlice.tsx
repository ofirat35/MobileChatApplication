import { createSlice } from "@reduxjs/toolkit";

interface AppState {
  chatVersion: number;
}

var initialState: AppState = {
  chatVersion: 0,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    updateChatVersion: (state) => {
      state.chatVersion += 1;
    },
    resetChatVersion: (state) => {
      state.chatVersion = 0;
    },
  },
});

export const { updateChatVersion, resetChatVersion } = chatSlice.actions;
export default chatSlice.reducer;
