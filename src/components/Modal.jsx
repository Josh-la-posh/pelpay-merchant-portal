// React import removed: using automatic JSX runtime
import { X } from 'lucide-react';
import PropTypes from 'prop-types';


const CustomModal = ({ handleOpenModal, children = null, width = undefined }) => {
  return (
    <div className="fixed inset-0 h-full w-[100%] bg-black/50 z-50 max-h-screen overflow-auto">
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

CustomModal.propTypes = {
  handleOpenModal: PropTypes.func.isRequired,
  children: PropTypes.node,
  width: PropTypes.string,
};

export default CustomModal;