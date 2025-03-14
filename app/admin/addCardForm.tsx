"use client";

import { useState,useEffect } from "react";
import { FaParagraph, FaNewspaper } from "react-icons/fa";
import { addCardToFirestore, Card } from "../firebase/firestore";

const AddCardForm = ({ userId }: { userId: string }) => {
  // const [question, setQuestion] = useState("");
  // const [answer, setAnswer] = useState("");
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  // const [wrongAnswers, setWrongAnswers] = useState<string[]>(["", "", ""]);

  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (!question || !answer || wrongAnswers.some((wa) => !wa)) return;
    if (!front || !back ) return;

    const newFlashCard: Card = {
      front,
      back,
      interval:1,
      repetitions:0,
      longMemory:false,
      nextReview: new Date(),
    }

    // const newCard: Card = {
    //   question,
    //   answer,
    //   wrongAnswers,
    //   interval: 1, // Start review in 1 day
    //   repetitions: 0,
    //   longMemory: false,
    //   nextReview: new Date(), // Today's date
    // };

    await addCardToFirestore(userId, newFlashCard);

    // Clear input fields
    // setQuestion("");
    // setAnswer("");
    // setWrongAnswers(["", "", ""]);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg">
    <div className="memo_views_molecules_card-fields_fields-container">
      <div className="memo_views_molecules_card-fields_field-label--container">
          <p className="flex items-center gap-2"><FaNewspaper/> <span> Front</span></p>
      </div>
      <div className="memo_views_molecules_card-fields_field-input-container">
          <textarea 
             value={front}
             onChange={(e) => setFront(e.target.value)}
            className="textarea-input-memo memo_views_molecules_card-fields_field-input-class"></textarea>
      </div>
      <div className="memo_views_molecules_card-fields_field-label--container">
          <p className="flex items-center gap-2"><FaNewspaper/> <span> Back</span></p>
      </div>
      <div className="memo_views_molecules_card-fields_field-input-container">
          <textarea 
             value={back}
             onChange={(e) => setBack(e.target.value)}
          className="textarea-input-memo memo_views_molecules_card-fields_field-input-class"></textarea>
      </div>
    {/* <form onSubmit={handleSubmit} className="p-4 border rounded-lg">
      <input
        type="text"
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="border p-2 w-full"
      />
      <input
        type="text"
        placeholder="Correct Answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="border p-2 w-full mt-2"
      />
      {wrongAnswers.map((wrong, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Wrong Answer ${index + 1}`}
          value={wrong}
          onChange={(e) =>
            setWrongAnswers((prev) =>
              prev.map((w, i) => (i === index ? e.target.value : w))
            )
          }
          className="border p-2 w-full mt-2"
        />
      ))}
      <button type="submit" 
        className="bg-blue-500 text-white px-4 py-2 mt-2">
        Add Card
      </button>
    </form> */}
    </div>
    <div className="flex justify-end mt-2">
        <button type="submit" 
          className="bg-blue-500 text-white px-4 py-2 mt-2">
          Add Card
        </button>
      </div>

    </form>
  );
};

export default AddCardForm;

