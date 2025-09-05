// React import removed: using automatic JSX runtime

import PropTypes from 'prop-types';

const ComplianceInputSelect = ({ label, options = [], value, onChange, id }) => {
  return (
    <div className='mb-4'>
      <label className='block text-[13px] py-2'>{label}</label>
      <select
      id={id}
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


ComplianceInputSelect.propTypes = {
  label: PropTypes.string,
  options: PropTypes.array,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  id: PropTypes.string,
};

// options defaulted in function parameters to avoid accessing before declaration

export default ComplianceInputSelect