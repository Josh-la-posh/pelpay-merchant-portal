import { Outlet, useNavigate } from 'react-router-dom';
import { SettingsProvider } from '../services/context/SettingsProvider';
import { ArrowLeft } from 'lucide-react';
import SettingsSidebar from '../components/sidebar/SettingsSidebar';

const SettingsLayout = () => {
  const navigate = useNavigate();

  return (
      <SettingsProvider>
          <div className="w-full h-full max-h-svh bg-gray-100 relative">
              <div className={`sm:h-full text-xs font-[500] sm:absolute sm:top-0 sm:left-0 w-full sm:w-36 md:w-44 z-20`}>
                  <SettingsSidebar />
              </div>
              <main className={`h-full pt-3 pb-10 overflow-scroll sm:ml-36 md:ml-44`}>
                  <button onClick={() => navigate(-1)} className='text-priColor ml-3 mb-5 flex items-center gap-2 text-xs'><ArrowLeft size={'14px'}/> Go Back</button>
                  <div className='ml-3 h-full overflow-y-scroll scrollbar-none pb-10'>
                      <Outlet />
                  </div>
              </main>
          </div>
      </SettingsProvider>
  );
};

export default SettingsLayout;