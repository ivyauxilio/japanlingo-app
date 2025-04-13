import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import cardsReducer from "../redux/cardsSlice";
import modalReducer from "../redux/modal";
import authReducer from "../redux/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cards: cardsReducer,
    modal: modalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // 🔥 Disable this if you have Firebase listeners
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();