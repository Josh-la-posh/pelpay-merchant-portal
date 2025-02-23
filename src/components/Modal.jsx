import React from 'react';
import { X } from 'lucide-react';


const CustomModal = ({ handleOpenModal, children, width }) => {
  return (
    <div className="fixed inset-0 h-full w-[100%] bg-black bg-opacity-50 z-50 max-h-screen overflow-auto">
      <div className={`bg-white max-h-[95%] top-5 bottom-10 rounded-lg shadow-lg p-8 w-auto ${width ? width : 'max-w-md'} mx-auto relative overflow-y-auto scrollbar-none`}>
        <button
          className="absolute right-6 text-gray-400 hover:text-gray-600"
          onClick={handleOpenModal}
        >
          <X size='15px' />
        </button>
        <div className="">
            {children}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;