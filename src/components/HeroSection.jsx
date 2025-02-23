import React from 'react';
import Home from "../assets/auth-img.png";

const HeroSection = () => {
  return (
    <div className="relative h-screen">
      <div 
        className="bg-cover bg-right h-screen w-full" 
        style={{backgroundImage: `url(${Home})`}}
      ></div>
      <div className="absolute top-0 bottom-0 flex flex-col justify-center text-white p-8">
        {/* Background overlay with reduced opacity */}
        <div className="absolute inset-0 bg-black bg-opacity-55"></div>

        {/* Text content with shadow */}
        <div className="relative z-10">
          <h1 className="text-5xl font-semibold mb-6 w-[80%]">
            Payments Made Easy with <span className="text-6xl text-priColor">PelPay</span>
          </h1>
          <div className="bg-black bg-opacity-50 p-3 w-full lg:w-[80%]">
            <p className="text-md lg:text-lg shadow-md">
              We help businesses in Africa receive payments from their customers all over the world.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
