import React, { useState } from 'react';
import useTitle from '../services/hooks/useTitle';
import useAuth from '../services/hooks/useAuth';
import {AlignJustify} from 'lucide-react';
import MerchantSelector from './MerchantSelector';

const Header = ({ openSidebar, setOpenSidebar, setIsSidebarTextVisible }) => {
  const {auth} = useAuth();
  const { appTitle } = useTitle();
  const merchants = auth?.data?.merchants || [];
  const [merchant, setMerchant] = useState(merchants[0] || {});

  const handleMerchantChange = (selectedMerchant) => {
    setMerchant(selectedMerchant);
  };

  const handleSidebar = () => {
    setOpenSidebar(!openSidebar);
    setIsSidebarTextVisible(!openSidebar)
  }

  return (
    <header className="flex justify-between items-center relative">
      <div className="flex items-center">
        
        {/* { openSidebar === false && */}
        <button className="" onClick={handleSidebar}>
          <AlignJustify />
        </button>
    
        <div className='text-lg font-semibold ml-3'>{appTitle ?? ''}</div>
      </div>
      <MerchantSelector merchants={merchants} onMerchantChange={handleMerchantChange} />
    </header>
  );
};

export default Header;