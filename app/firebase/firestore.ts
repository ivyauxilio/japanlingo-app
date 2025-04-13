import { db } from "./config";
import { collection, addDoc, Timestamp } from "firebase/firestore";


export type Card = {
  // question: string;
  // answer: string;
  // wrongAnswers: string[];
  front: string;
  back: string;
  interval: number;
  repetitions: number;
  longMemory: boolean;
  nextReview: Date;
};

export const addCardToFirestore = async (userId: string, card: Card) => {
  try {
    await addDoc(collection(db, "cards"), {
      userId,
      ...card,
      // nextReview: Timestamp.fromDate(card.nextReview),
    });
    console.log("Card added successfully!");
  } catch (error) {
    console.error("Error adding card:", error);
  }
};