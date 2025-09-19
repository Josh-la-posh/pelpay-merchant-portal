import React from 'react'
import Spinner from '@/components/Spinner';
import { useSelector } from "react-redux";


const FormSix = () => {
      const { complianceLoading } = useSelector((state) => state.compliance);
      if (complianceLoading) return (
          <div className='h-[50vh] w-full'>
              <Spinner />
          </div>
      );
  return (
    <div>
        <div className="max-w-[450px] ">
          
        </div>
    </div>
  )
}

export default FormSix
