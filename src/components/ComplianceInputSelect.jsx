import React from 'react'

const ComplianceInputSelect = ({ label, options, value, onChange }) => {
  return (
    <div className='mb-4'>
      <label className='block text-[13px] py-2'>{label}</label>
      <select
        value={value}
        onChange={onChange}
        className='bg-gray-200 block w-full border border-gray-200 rounded-md text-[13px] p-2'
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className='text-[13px]'>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ComplianceInputSelect