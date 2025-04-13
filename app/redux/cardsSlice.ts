import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { collection,addDoc, getDocs, query,orderBy, where, doc, updateDoc, deleteDoc} from "firebase/firestore";
import { db,auth } from "../firebase/config";
import { Timestamp } from "firebase/firestore";
import { RootState } from "../lib/store";

export interface Card {
  id?: string;
  userId: string;
  front: string;
  back: string;
  interval: number;
  nextReview: string;
  repetitions: number;
  longMemory: boolean;
  created_at: string;
}

interface CardsState {
  allFlashcards: Card[];
  dueFlashcards: Card[];
  loading: boolean;
  error: string | null;
}

// ✅ Convert Firestore Timestamp to a serializable format
// const convertTimestampToDate = (doc: DocumentData): Card => ({
//   id: doc.id, // ✅ Firestore Document ID
//   userId: doc.data().userId,
//   front: doc.data().front,
//   back: doc.data().back,
//   nextReview: doc.data().nextReview instanceof Timestamp ? doc.data().nextReview.toDate().toISOString() : doc.data().nextReview,
//   interval: doc.data().interval || 0,
//   repetitions: doc.data().repetitions || 0,
//   longMemory: doc.data().longMemory || false,
// });

export const addCard = createAsyncThunk<Card, Omit<Card, "id" | "userId">>(
  "cards/addCard",
  async (newFlashCard): Promise<Card> => {
    const user = auth.currentUser;
    console.log("auth.user in addCard:", user);
    if (!user) throw new Error("User not logged in");

    const cardWithUser = {
      ...newFlashCard,
      userId: user.uid,
      nextReview: new Date(newFlashCard.nextReview).toISOString(),
    };

    const docRef = await addDoc(collection(db, "cards"), cardWithUser);
    return {
      id: docRef.id,
      ...cardWithUser,
      nextReview: cardWithUser.nextReview,
    };
  }
);


// ✅ Fetch only the logged-in user's cards
export const fetchUserCards = createAsyncThunk<Card[]>("cards/fetchUserCards", 
  async (_, { getState }) => {
  // const user = auth.currentUser;
  // if (!user) return rejectWithValue("User not authenticated");
  const state = getState() as RootState; // Explicitly type the state
  const { user } = state.auth;

  if (!user?.uid) throw new Error("User not authenticated");

  // if (!auth.user || !auth.user.uid) {
  //   throw new Error("User not authenticated");
  // }

  const q = query(collection(db, "cards"), where("userId", "==", user.uid));
  const querySnapshot = await getDocs(q);

  // return querySnapshot.docs.map((doc) => convertTimestampToDate(doc));
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    console.log("data",data)
    return {
      id: doc.id,
      ...data,
      nextReview: data.nextReview instanceof Timestamp 
      ? data.nextReview.toDate().toISOString()  // ✅ Convert Firestore Timestamp to string
      : data.nextReview, // ✅ If already a string, use it directly
    } as Card;
  });
  
});

export const fetchInitialCards = createAsyncThunk(
  "cards/fetchInitialCards",
  async (_, { rejectWithValue }) => {
    try {
      const cardsRef = collection(db, "cards");
      const q = query(cardsRef, where("interval", "==", 1));
      const querySnapshot = await getDocs(q);

      const cards: Card[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Card[];

      return cards;
    } catch (error) {
      return rejectWithValue("Failed to fetch cards.");
    }
  }
);

// Update review function (Async action)1
export const updateReviewStatus = createAsyncThunk(
  "cards/updateReviewStatus",
  async ({ card, isCorrect }: { card: Card; isCorrect: boolean }) => {
    const cardRef = doc(db, "cards", String(card.id));

    let { interval, repetitions } = card;
    const now = new Date();

    if (isCorrect) {
      repetitions += 1;
      interval = Math.ceil(interval * 1.5); // Increase interval
      console.log("updateReviewStatus is correct, add repetition",repetitions)
    } else {
      repetitions = 0;
      interval = 1; // Reset interval if incorrect
      console.log("updateReviewStatus is incorrect,",repetitions)
    }

    const nextReview = new Date(now.setDate(now.getDate() + interval)).toISOString();

    await updateDoc(cardRef, { nextReview, interval, repetitions });

    return { id: card.id, nextReview, interval, repetitions };
  }
);

export const fetchDueCards = createAsyncThunk("cards/fetchDueCards", async (userId: string) => {
  const today = new Date().toISOString();
  const q = query(collection(db, "cards"), where("userId", "==", userId), where("nextReview", "<=", today));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Card[];
});

export const deleteFlashcard = createAsyncThunk(
  "cards/deleteFlashcard",
  async (cardId: string, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "cards", cardId));
      return cardId; // Return ID for state update
    } catch (error) {
      // return rejectWithValue(error.message);
      console.error("Error deleting flashcards:", error);
    }
  }
);

const getNextReviewDate = (days: number) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); 
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
};

export const reviewFlashcard = createAsyncThunk(
  "cards/reviewFlashcard",
  async ({ card, isCorrect }: { card: Card; isCorrect: boolean }, { rejectWithValue }) => {
    try {
      let { interval, repetitions } = card;
      let newInterval = isCorrect ? interval * 2 : 1;
      // if (isCorrect){
      //   repetitions += 1;
      // } else {
      //   repetitions -= 1;
      // }
      let newRepetitions = isCorrect ? repetitions + 1 : Math.max(0, repetitions - 1);

      console.log("newInterva",newInterval)
      if (newInterval === 4) newInterval = 9;
      if (newInterval === 18) newInterval = 14;

      const nextReview = getNextReviewDate(newInterval);
      const longMemory = newInterval === 36 && isCorrect;
      if (longMemory) newInterval = 0;

      await updateDoc(doc(db, "cards", String(card.id)), { nextReview, interval: newInterval, longMemory,newRepetitions });

      return { ...card, nextReview, interval: newInterval,newRepetitions, longMemory };
    } catch (error) {
      return rejectWithValue("Failed to update card.");
    }
  }
);


const getTodayDateString = () => new Date().toISOString().split("T")[0];
const convertToTimestamp = (isoString: string) => Timestamp.fromDate(new Date(isoString));

export const fetchDueFlashcards = createAsyncThunk(
  "cards/fetchDueFlashcards",
  async (userId: string) => {
    try {
      const today = new Date();
      today.setMinutes(today.getMinutes() - today.getTimezoneOffset()); // Adjust to local time
      const todayString = today.toISOString().split("T")[0];
      console.log(todayString);
      // Get today's date in YYYY-MM-DD format
      // const todayString = new Date().toISOString().split("T")[0];
      // console.log(todayString)
      // const q = query(
      //   collection(db, "cards"),
      //   // where("nextReview", "<=", todayString) // Fetch past & today's cards
      //   where("interval", "==", 1 )
      // );

      const q = query(collection(db, "cards"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      const flashcards = querySnapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            userId: data.userId || "",
            front: data.front || "",
            back: data.back || "",
            nextReview: data.nextReview || todayString,
            interval: data.interval || 1,
            repetitions: data.repetitions || 0,
            longMemory: data.longMemory || false,
            created_at: data.created_at || "",
          };
        })
        .filter(card => {
          const nextReviewDate = new Date(
            card.nextReview?.toDate?.() || card.nextReview
          );
          return nextReviewDate.toISOString().split("T")[0] <= todayString;
        });
        // .filter(card => card.interval == 1)
        
      // const querySnapshot = await getDocs(q);
      
      // const flashcards = querySnapshot.docs.map(doc => {
      //   const data = doc.data();
      //   return {
      //     id: doc.id,
      //     userId: data.userId || "", // Ensure required properties exist
      //     front: data.front || "",
      //     back: data.back || "",
      //     nextReview: data.nextReview || todayString, // Ensure nextReview exists
      //     interval: data.interval || 1,
      //     repetitions: data.repetitions || 0,
      //     longMemory: data.longMemory || false,
      //     created_at: data.created_at || "",
      //   };
      // });
  
      console.log("Fetched Flashcards:", flashcards);
      return flashcards;
    } catch (error) {
      console.error("Error fetching flashcards:", error);
      throw new Error("Failed to fetch flashcards.");
    }
  }
);


// ✅ Initial state with explicit typing
const initialState: CardsState = {
  allFlashcards: [],
  dueFlashcards: [],
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
        state.allFlashcards = action.payload; // ✅ Correctly typed
      })
      .addCase(fetchUserCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load cards";
      })
      .addCase(addCard.fulfilled, (state, action: PayloadAction<Card>) => {
        state.allFlashcards.push(action.payload);
      })
      .addCase(updateReviewStatus.fulfilled, (state, action) => {
        const index = state.allFlashcards.findIndex((card) => card.id === action.payload.id);
        if (index !== -1) {
          state.allFlashcards[index].nextReview = action.payload.nextReview;
          state.allFlashcards[index].interval = action.payload.interval;
          state.allFlashcards[index].repetitions = action.payload.repetitions;
        }
      })
      .addCase(fetchDueFlashcards.pending, (state) => { state.loading = true; })
      .addCase(fetchDueFlashcards.fulfilled, (state, action) => {
        state.loading = false;
        state.dueFlashcards = action.payload;
      })
      .addCase(fetchDueFlashcards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteFlashcard.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteFlashcard.fulfilled, (state, action) => {
        state.loading = false;
        state.dueFlashcards = state.dueFlashcards.filter((card) => card.id !== action.payload); // Remove from state
      })
      .addCase(deleteFlashcard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default cardsSlice.reducer;