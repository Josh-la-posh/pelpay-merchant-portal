import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { SettingsProvider } from '../services/context/SettingsProvider';
import { ArrowLeft } from 'lucide-react';
import MerchantSidebar from '@/components/sidebar/merchantSidebar';

const MerchantLayout = () => {
  const navigate = useNavigate();
  const [isSidebarTextVisible, setIsSidebarTextVisible] = useState(true);

  const handleSidebar = (val) => {
    setIsSidebarTextVisible(val);
  };

  return (
    <SettingsProvider>
        <div className="w-full h-full max-h-svh bg-gray-100 relative">
            <div className={`h-full text-xs font-[500] absolute top-0 left-0 ${isSidebarTextVisible ? 'w-36 md:w-44' : 'w-0'} z-20`}>
                <MerchantSidebar />
            </div>
            <main className={`h-full pt-3 overflow-hidden ${isSidebarTextVisible ? 'ml-36 md:ml-44' : 'ml-0'}`}>
                <button onClick={() => navigate(-1)} className='text-priColor ml-3 mb-5 flex items-center gap-2 text-xs'><ArrowLeft size={'14px'}/> Go Back</button>
                <div className='ml-3 h-full overflow-y-scroll scrollbar-none'>
                    <Outlet />
                </div>
            </main>
        </div>
    </SettingsProvider>
  );
};

export default MerchantLayout;