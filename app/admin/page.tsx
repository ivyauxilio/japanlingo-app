'use client'
import { useState,useEffect } from "react";
// import { useAuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import AddCardForm from "./addCardForm";
import { FaPlus } from "react-icons/fa";
import Modal from '../components/modal';

import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";
import { fetchUserCards } from "../redux/cardsSlice";
import { useAppDispatch } from "../lib/store";
import { RootState } from "../lib/store";

function Page() {
    // const { user } = useAuthContext()
    const { user, loading } = useAuth(); // Get auth status
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false);

    // useEffect(() => {
    //     if (user == null) router.push("/")
    // }, [user])

    
      const dispatch = useAppDispatch();
      const { 
        data: cards, 
        loading: cardsLoading, 
        error 
      } = useSelector((state: RootState) => state.cards);

      useEffect(() => {
        if (user) {
          dispatch(fetchUserCards()); // Fetch cards only if logged in
        }
        if (!loading && !user) {
          router.push("/login"); // Redirect to login page
        }
      }, [dispatch, user]);
    
      if (loading) return <p>Checking authentication...</p>;
      if (!user) return <p className="text-red-500">You must be logged in to view this page.</p>;
      if (cardsLoading) return <p>Loading cards...</p>;
      if (error) return <p>Error: {error}</p>;
    

    return (  
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Add a New Flashcard</h1>
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
            <FaPlus/>
           <span> New Card</span>
        </button>

        <h2 className="text-xl font-bold">Cards</h2>
        <ul>
          {cards.map((card) => (
            <li key={card.id} id={card.id} className="border p-2 my-2">
              <strong>{card.front}</strong>
              <p className="text-sm text-gray-500">
              Next Review: {new Date(card.nextReview).toLocaleDateString()}
            </p>
            <p className="text-sm">
              Interval: {card.interval} days | Repetitions: {card.repetitions} | Long Memory: {card.longMemory ? "Yes" : "No"}
            </p>
            </li>
          ))}
        </ul>
        

        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} modal_title="FlashCards">
          {/* <h1>FlashCards</h1> */}
          <hr className="mt-2 mb-5"/>
          <AddCardForm userId={user.uid} />
        </Modal>
      </div>
        
    );
}

export default Page;