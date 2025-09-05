import HeroSection from './HeroSection';

import PropTypes from 'prop-types';

const AuthLayout = ({children = null}) => {
  return (
    <div className="block md:bg-[transparent] md:flex h-screen overflow-hidden">
      <div className="h-full lg:w-[55%] hidden lg:block">
        <HeroSection />
      </div>
      <div className='h-full w-full lg:w-[45%] bg-[#f7f7f7]'>
        <div className="h-full w-full flex justify-center items-center overflow-y-hidden">
          <div className="">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

AuthLayout.propTypes = {
  children: PropTypes.node,
};