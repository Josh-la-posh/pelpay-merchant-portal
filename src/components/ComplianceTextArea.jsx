import React from 'react'

const ComplianceTextArea = ({ label, value, onChange, type, minLength, errMsg }) => {
  return (
    <div className='mb-4'>
      <label className='block text-[13px] py-2'>{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        type={type}
        minLength={minLength}
        className='mb-2 bg-gray-200 block w-full border border-gray-200 text-[11px] rounded-md p-2 h-[100px]'
      />
        <p className='mt-1 text-right text-xs text-gray-500'>At least 100 characters.</p>
        {errMsg && <p className="text-red-500 text-xs lg:text-sm font-normal">{errMsg}</p>}
    </div>
  )
}

export default ComplianceTextArea