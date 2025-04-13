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
import { closeModal,openModal } from "../redux/modal";

function Page() {
    // const { user } = useAuthContext()
    // const { user, loading } = useAuth(); // Get auth status
    const {user,loading} = useSelector((state: RootState) => state.auth);
    const router = useRouter()
    const dispatch = useAppDispatch();
    const isOpenModal = useSelector((state: RootState) => state.modal.isOpen);
    // const [isOpen, setIsOpen] = useState(false);

    // useEffect(() => {
    //     if (user == null) router.push("/")
    // }, [user])


      useEffect(() => {
        if (user && user.email) {
          dispatch(fetchUserCards()); // Fetch cards only if logged in
        }
        console.log("auth.user in Admin:", user);
        if (!loading && !user) {
          router.push("/"); // Redirect to login page
        }
      }, [dispatch, user, loading]);

      const { 
        allFlashcards: cards, 
        loading: cardsLoading, 
        error 
      } = useSelector((state: RootState) => state.cards);
      
      if (loading) return <p>Checking authentication...</p>;
      if (!user) return <p className="text-red-500">You must be logged in to view this page.</p>;
      if (cardsLoading) return <p>Loading cards...</p>;
      if (error) return <p>Error: {error}</p>;
    

    return cards.length > 0 ?(  
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Add a New Flashcard</h1>
        <button 
          // onClick={() => setIsOpen(true)}
          onClick={() => dispatch(openModal())}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 mb-5 rounded inline-flex items-center">
            <FaPlus/>
           <span> New Card</span>
        </button>

        <h2 className="text-xl font-bold">List of Flashcards</h2>
        {/* <ul>
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
        </ul> */}
        <table className="auto-table min-w-full border border-gray-300 bg-white rounded-lg">
          <thead className="bg-gray-100">
            <tr className="px-4 py-2 border">
              <th>No.</th>
              <th>Front Flashcard</th>
              <th>Interval</th>
              <th>Due</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((card,i) => (
              <tr key={card.id}>
                <th className="px-4 py-2 border">{i + 1}</th>
                <th className="px-4 py-2 border">{card.front}</th>
                <th className="px-4 py-2 border">{card.interval}</th>
                <th className="px-4 py-2 border">{new Date(card.nextReview).toLocaleDateString()}</th>
                <th className="px-4 py-2 border">{new Date(card.created_at).toLocaleDateString()}</th>
              </tr>
              
            ))}
          </tbody>
        </table>
        
        <Modal isOpen={isOpenModal} onClose={() => dispatch(closeModal())} modal_title="FlashCards">
          <hr className="mt-2 mb-5"/>
          <AddCardForm userId={user.uid} />
        </Modal>
      </div>
        
    ) : <p>Loading ...</p>;
}

export default Page;