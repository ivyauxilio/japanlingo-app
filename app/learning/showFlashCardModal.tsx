'use client'
import { useState,useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import Modal from '../components/modal';
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { updateReviewStatus,fetchUserCards, Card } from "../redux/cardsSlice";
import { useAppDispatch } from "../lib/store";
import { closeModal,openModal } from "../redux/modal";
import { useDispatch } from "react-redux";
import { AppDispatch,RootState } from "../lib/store";
import styles from "./flashcard.module.css";

interface FlashcardProps {
    front: string;
    back: string;
  }

const ShowFlashCard: React.FC<FlashcardProps> = ({ front, back }) => {
    const [flipped, setFlipped] = useState(false);
    return (
    //   <div className="relative w-100 h-50 bg-white shadow-lg rounded-xl 
    //   flex justify-center items-center p-4 cursor-pointer transition-transform 
    //   duration-500 transform hover:rotate-y-180">
    //     <div className="absolute w-full h-full flex justify-center items-center text-xl font-bold backface-hidden">
    //       {front}
    //     </div>
    //     <div className="absolute w-full h-full flex justify-center items-center text-xl font-bold bg-blue-500 text-white rounded-xl rotate-y-180 backface-hidden">
    //       {back}
    //     </div>
    //   </div>
    <div
      className={`w-100 h-50 ${styles["flashcard-container"]} ${flipped ? styles.flipped : ""}`}
      onClick={() => setFlipped(!flipped)} // Toggle flipped state on click
    >
      <div className={styles["flashcard-inner"]}>
        <div className={styles["flashcard-front"]}>{front}</div>
        <div className={`bg-blue-500 ${styles["flashcard-back"]}`}>{back}</div>
      </div>
    </div>
    );
  };
export default ShowFlashCard;