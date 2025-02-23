import React from 'react';
import HeroSection from './HeroSection';

const AuthLayout = ({children}) => {
  return (
    <div className="block md:bg-[transparent] md:flex h-screen overflow-hidden">
      <div className="h-full w-[60%] hidden md:block">
        <HeroSection />
      </div>
      <div className='h-full md:w-[40%] bg-[#f7f7f7]'>
        <div className="h-full w-full flex justify-center overflow-y-scroll">
          <div className="w-[280px] md:w-[unset] md:px-10 lg:px-20">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;