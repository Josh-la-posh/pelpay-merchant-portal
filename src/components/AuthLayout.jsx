import React from 'react';
import HeroSection from './HeroSection';

const AuthLayout = ({children}) => {
  return (
    <div className="block md:bg-[transparent] md:flex h-screen overflow-hidden">
      <div className="h-full lg:w-[55%] hidden lg:block">
        <HeroSection />
      </div>
      <div className='h-full w-full lg:w-[45%] bg-[#f7f7f7]'>
        <div className="h-full w-full flex justify-center items-center overflow-y-scroll">
          <div className="w-[280px] lg:w-[unset] lg:px-20">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;