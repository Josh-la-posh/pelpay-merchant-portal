import React from 'react'

const ComplianceTextArea = ({ label, value, onChange, type, minLength }) => {
  return (
    <div className='mb-4'>
      <label className='block text-[13px] py-2'>{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        type={type}
        minLength={minLength}
        className='mb-4 bg-gray-200 block w-full border border-gray-200 text-[11px] rounded-md p-2 h-[100px]'
      />
        <p className='mt-2 text-xs text-gray-500'>At least 100 characters.</p>
    </div>
  )
}

export default ComplianceTextArea