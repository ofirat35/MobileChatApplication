import { configureStore, Reducer } from "@reduxjs/toolkit";
import discoveryReducer from "../features/slices/discoverySlice";
import chatReducer from "../features/slices/chatSlice";

export const store = configureStore({
  reducer: {
    discovery: discoveryReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
