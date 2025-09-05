// no local state needed here
import useTitle from '../services/hooks/useTitle';
import useAuth from '../services/hooks/useAuth';
import {AlignJustify} from 'lucide-react';
import MerchantSelector from './MerchantSelector';
import PropTypes from 'prop-types';

const Header = ({ openSidebar = true, setOpenSidebar, setIsSidebarTextVisible }) => {
  const {auth} = useAuth();
  const { appTitle } = useTitle();
  const merchants = auth?.data?.merchants || [];
  const handleMerchantChange = () => {};

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

Header.propTypes = {
  openSidebar: PropTypes.bool,
  setOpenSidebar: PropTypes.func.isRequired,
  setIsSidebarTextVisible: PropTypes.func.isRequired,
};

export default Header;