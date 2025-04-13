"use client";

import React, { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { fetchDueFlashcards, reviewFlashcard,deleteFlashcard, Card } from "../redux/cardsSlice";
import { RootState, AppDispatch } from "../lib/store";
import Modal from '../components/modal';
import { closeModal,openModal } from "../redux/modal";
import ShowFlashCard from "./showFlashCardModal";
import { toast } from "sonner";

const FlashcardReview = () => {
  // const { user, loading } = useAuth();
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>();

  const [frontFlashCard, setFrontFlashCard] = useState("");
  const [backFlashCard, setBackFlashCard] = useState("");
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const isOpenModal = useSelector((state: RootState) => state.modal.isOpen);
  const { dueFlashcards, loading, error } = useSelector((state: RootState) => state.cards);
  const {user} = useSelector((state: RootState) => state.auth);

    useEffect(() => {
    if (!user || !user.email) {
        router.push("/");
      } else {
        dispatch(fetchDueFlashcards(user.uid));
      }
   
  }, [user, dispatch]);

  if (!user || !user.uid) {
    return ("User not authenticated");
  }
  
  const handleReview = (data: Card, isCorrect: boolean) => {
    dispatch(reviewFlashcard({ card: data, isCorrect }));
    dispatch(closeModal())
    dispatch(fetchDueFlashcards(user.uid));
    toast.success("Select next word!");
  };
  const showFlashCardModal = (data: Card) => {
    dispatch(openModal())
    setFrontFlashCard(data.front);
    setBackFlashCard(data.back);
    setSelectedCard(data);
  }
  const handleDelete = (id?: string) => {
    if (confirm("Are you sure you want to delete this card?")) {
      dispatch(deleteFlashcard(id as string));
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!dueFlashcards.length) return <p>No flashcards due today.</p>;

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Today's Flashcards</h2>
      {dueFlashcards.map((card) => (
        <div key={card.id} className="flex justify-between p-4 border rounded mb-2">
          <button onClick={() => showFlashCardModal(card)}>
            <h3 className="font-semibold underline">{card.front}</h3>
          </button>
          
          <button onClick={() => handleDelete(card.id)} className="text-red-500 hover:text-gray-700 transition text-xl">
            ✖
          </button>

        </div>
      ))}

      <Modal isOpen={isOpenModal} onClose={() => dispatch(closeModal())} modal_title="For today">
          <hr className="mt-2 mb-5"/>
          <ShowFlashCard front={frontFlashCard} back={backFlashCard}/>
          <div className="flex justify-center mt-4">
            <button onClick={() => selectedCard && handleReview(selectedCard, true)} className="bg-green-500 text-white p-2 rounded mr-2">I've known this word</button>
            <button onClick={() => selectedCard && handleReview(selectedCard, false)} className="bg-red-500 text-white p-2 rounded">I don't know yet</button>
          </div>
       </Modal>
    </>
  );
};

export default FlashcardReview;