
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  modal_title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, modal_title }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-modal-backdrop" 
      onClick={onClose}
    >
      <div 
        className="bg-white p-6 rounded-xl  shadow-2xl w-[800px] max-w-3xl transform transition-all scale-95 opacity-0 animate-fadeIn"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
       <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{modal_title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition text-xl"
          >
            ✖
          </button>
        </div>
        {children}
        {/* <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Close
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Modal;
// import { useState } from "react";

// const ModalExample: React.FC = () => {
//   const [isOpen, setIsOpen] = useState<boolean>(false);

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <button
//         onClick={() => setIsOpen(true)}
//         className="px-4 py-2 bg-blue-500 text-white rounded-lg"
//       >
//         Open Modal
//       </button>

//       {isOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-xl font-semibold mb-4">Modal Title</h2>
//             <p className="text-gray-600 mb-4">This is a simple modal.</p>
//             <div className="flex justify-end">
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="px-4 py-2 bg-red-500 text-white rounded-lg"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ModalExample;
