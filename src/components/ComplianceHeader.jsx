import React from 'react'

const ComplianceHeader = ({title, subtitle}) => {
  return (
    <div className='text-center mb-4'>
      <h3 className='text-[19px] font-semibold m-[20px]'>{title}</h3>
      <p className='text-[13px] text-gray-500'>{subtitle}</p>
    </div>
  )
}

export default ComplianceHeader