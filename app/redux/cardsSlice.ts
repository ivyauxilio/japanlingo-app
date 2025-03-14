import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { collection, getDocs, query, where, DocumentData } from "firebase/firestore";
import { db,auth } from "../firebase/config";
import { Timestamp } from "firebase/firestore";

interface Card {
  id: string;
  userId: string;
  front: string;
  back: string;
  nextReview: string; // Stored as ISO string for serialization
  interval: number;
  repetitions: number;
  longMemory: boolean;
}

interface CardsState {
  data: Card[];
  loading: boolean;
  error: string | null;
}

// ✅ Convert Firestore Timestamp to a serializable format
const convertTimestampToDate = (doc: DocumentData): Card => ({
  id: doc.id, // ✅ Firestore Document ID
  userId: doc.data().userId,
  front: doc.data().front,
  back: doc.data().back,
  nextReview: doc.data().nextReview instanceof Timestamp ? doc.data().nextReview.toDate().toISOString() : doc.data().nextReview,
  interval: doc.data().interval || 0,
  repetitions: doc.data().repetitions || 0,
  longMemory: doc.data().longMemory || false,
});

// ✅ Fetch only the logged-in user's cards
export const fetchUserCards = createAsyncThunk<Card[]>("cards/fetchUserCards", async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const q = query(collection(db, "cards"), where("userId", "==", user.uid));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => convertTimestampToDate(doc));
});

// ✅ Initial state with explicit typing
const initialState: CardsState = {
  data: [],
  loading: false,
  error: null,
};

// ✅ Redux Slice
const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCards.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserCards.fulfilled, (state, action: PayloadAction<Card[]>) => {
        state.loading = false;
        state.data = action.payload; // ✅ Correctly typed
      })
      .addCase(fetchUserCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load cards";
      });
  },
});

export default cardsSlice.reducer;