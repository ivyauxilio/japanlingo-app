"use client";

import { Provider } from "react-redux";
import { store } from "./lib/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuthState } from "./redux/authSlice";
import { AppDispatch } from "./lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      {children}
    </Provider>);
}


function AuthInitializer() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(checkAuthState());
  }, [dispatch]);

  return null;
}