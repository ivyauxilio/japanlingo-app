import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

// Define the initial state
interface AuthState {
  user: User | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: true, // Set loading to true initially
};

// Async function to check auth state
export const checkAuthState = createAsyncThunk("auth/checkAuthState", async () => {
  return new Promise<User | null>((resolve) => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      resolve(user);
    });
  });
});

// Create Redux Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(checkAuthState.pending, (state) => {
        state.loading = true;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;