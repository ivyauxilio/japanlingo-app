import { useState, ReactNode } from "react";

interface DropdownProps {
    children: ReactNode;
}


const DropdownButton: React.FC<DropdownProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <div className="relative inline-block text-left">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg flex items-center gap-2 hover:bg-gray-700 transition"
        >
          Flashcard ▼
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
            <div className="py-2 text-gray-700">{children}</div>
          </div>
        )}
      </div>
    );
  };

export default DropdownButton;


{/* <Dropdown>
<ul>
  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Option 1</li>
  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Option 2</li>
  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Option 3</li>
</ul>
</Dropdown> */}