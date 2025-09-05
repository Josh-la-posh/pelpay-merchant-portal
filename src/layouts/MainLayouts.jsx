import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import TextButton from '../components/ui/text-button';
import { X } from 'lucide-react';
import { TitleProvider } from '../services/context/TitleProvider';

const MainLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [isSidebarTextVisible, setIsSidebarTextVisible] = useState(false);

  const handleSidebar = (val) => {
    setOpenSidebar(val);
    setIsSidebarTextVisible(val);
  };

  return (
    <TitleProvider>
        <div className="w-full h-svh max-h-svh bg-gray-100 relative">
        {openSidebar && (
          <div className='fixed top-0 left-0 w-48 z-50 block md:hidden'>
            <Sidebar handleSidebar={handleSidebar} isSidebarTextVisible={isSidebarTextVisible}/>
            <TextButton
              className="absolute top-4 right-0 text-white"
              onClick={() => handleSidebar(false)}
            >
              <X size='15px'/>
            </TextButton>
          </div>
        )}
        <div className={`fixed top-0 left-0 ${isSidebarTextVisible && openSidebar ? 'md:w-48' : 'w-20'} z-50 hidden md:block`}>
          <Sidebar handleSidebar={handleSidebar} isSidebarTextVisible={isSidebarTextVisible}/>
        </div>
        <div className={`h-full relative overflow-hidden ${isSidebarTextVisible && openSidebar ? 'ml-0 md:ml-48' : 'ml-0 md:ml-20'} bg-[#f7f7f7]`}>
          <div className={`bg-white z-10 p-4 border-b border-gray-300 h-16 w-full fixed top-0 right-0 left-0 ${isSidebarTextVisible && openSidebar ? 'md:pl-48' : 'pl-5 md:pl-20'}`}>
            <Header setOpenSidebar={setOpenSidebar} openSidebar={openSidebar} setIsSidebarTextVisible={setIsSidebarTextVisible} />
          </div>
          <main className="pt-20 pb-5 px-5 h-full overflow-hidden">
            <div className='h-full overflow-y-scroll scrollbar-none'>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </TitleProvider>
  );
};

export default MainLayout;