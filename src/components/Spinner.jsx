import { Loader } from 'lucide-react';
import React from 'react';

const Spinner = () => {
    return (
        <div className="h-full w-full flex items-center justify-center bg-gray-200/50 z-50">
            <div className="flex flex-col items-center">
                {/* <div className="w-12 h-12 border-4 border-t-4 border-[#272662] rounded-full animate-spin"></div> */}
                <Loader size='35px' />
                <p className="mt-4 text-black text-lg">Loading...</p>
            </div>
        </div>
    );
};

export default Spinner;
